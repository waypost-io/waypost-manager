const PGTable = require("../db/PGTable");
const { EXPERIMENTS_TABLE_NAME, EXPERIMENT_METRICS_TABLE_NAME, EXPOSURES_TABLE_NAME, GET_EXPT_METRICS_QUERY, GET_EXPOSURES_ON_EXPT, GET_METRIC_DATA } = require("../constants/db");
const { getNowString } = require("../utils");
const { runAnalytics } = require('../lib/statistics');

const experimentsTable = new PGTable(EXPERIMENTS_TABLE_NAME);
experimentsTable.init();
const experimentMetricsTable = new PGTable(EXPERIMENT_METRICS_TABLE_NAME);
experimentMetricsTable.init();
const exposuresTable = new PGTable(EXPOSURES_TABLE_NAME);
exposuresTable.init();

const getExperiment = async (req, res, next) => {
  const id = req.params.id;
  try {
    const experiment = await experimentsTable.getRow(id);
    res.status(200).send(experiment);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message)
  }
};

// takes arr of joined expt and metric_id data with duplicate experiments
// returns arr with no duplicate experiments and metric_ids property is an arr
// [
//   {
//     id: 1,
//     name: experiment1,
//     ...,
//     metrics: [{ metric_id: 1, mean_test: ..., mean_control: ..., ...}, ...],
//     exposures_test: { "2022-03-08": 5, "2022-03-09": 10, ... },
//     exposures_control: { "2022-03-08": 5, "2022-03-09": 10, ... }
//   }
// ]

const separateMetricExperimentData = (metricExpt) => { // helper
  const {
    metric_id,
    mean_test,
    mean_control,
    interval_start,
    interval_end,
    p_value,
    name,
    type,
    ...expt
  } = metricExpt;

  const metricObj = {
    metric_id,
    mean_test,
    mean_control,
    interval_start,
    interval_end,
    p_value,
    name,
    type
  };

  return [expt, metricObj];
}

// Input: [
//   {
//     id: 7,
//     flag_id: 1,
//     date_started: 2022-03-23T07:00:00.000Z,
//     date_ended: null,
//     duration: 14,
//     name: 'Time on site',
//     description: null,
//     metric_id: 2,
//     type: 'duration',
//     mean_test: null,
//     mean_control: null,
//     interval_start: null,
//     interval_end: null,
//     p_value: null
//   },
//   ...
// ]

// Output:
// [
//   {
//     id: 7,
//     flag_id: 1,
//     date_started: 2022-03-23T07:00:00.000Z,
//     date_ended: null,
//     duration: 14,
//     description: null,
//     metrics: [ [Object] ]
//   },
//   ...
// ]

// Each metric object looks like:
// {
//   metric_id: 2,
//   mean_test: null,
//   mean_control: null,
//   interval_start: null,
//   interval_end: null,
//   p_value: null,
//   name: 'Time on site',
//   type: 'duration'
// }

const transformExptMetricData = (exptMetrics) => { // helper
  let idMap = {};
  exptMetrics.forEach((exptMetric) => {
    const [expt, metricObj] = separateMetricExperimentData(exptMetric);
    if (idMap[expt.id]) {
      idMap[expt.id].push(metricObj)
    } else {
      idMap[expt.id] = [metricObj];
    }
  });

  const experiments =  Object.keys(idMap).map((exptId) => {
    const exptMetric = exptMetrics.find((e) => e.id === Number(exptId))
    const [expt, metricObj] = separateMetricExperimentData(exptMetric);
    expt.metrics = idMap[exptId];
    return expt;
  })
  experiments.sort((a, b) => b.id - a.id);
  return experiments;
}

// variant is either "test" or "control"
// Input exposuresArr (below), and "test":
// [
//   { variant: 'test', num_users: 23, date: 2022-03-14T07:00:00.000Z },
//   { variant: 'control', num_users: 20, date: 2022-03-14T07:00:00.000Z },
//   { variant: 'test', num_users: 144, date: 2022-03-15T07:00:00.000Z },
//   ...
// ]
// Output
// {
//   '2022-03-14T07:00:00.000Z': 23,
//   '2022-03-15T07:00:00.000Z': 144,
//   ...,
// }

const createExposureObj = (exposuresArr, variant) => { // helper
  const obj = {};

  exposuresArr = exposuresArr.filter((expo) => expo.variant === variant);
  exposuresArr.forEach((expo) => {
    const date = expo.date.toISOString();
    obj[date] = expo.num_users
  })

  return obj;
}

const setExposuresOnExperiment = async (experiment) => {
  let { rows: exposures } = await exposuresTable.query(GET_EXPOSURES_ON_EXPT, [ experiment.id ]);

  if (exposures.length > 0) { // put exposures onto running experiment
    const exposuresTest = createExposureObj(exposures, "test")
    const exposuresControl = createExposureObj(exposures, "control")
    experiment.exposuresTest = exposuresTest;
    experiment.exposuresControl = exposuresControl;
  }
}

const getExperimentsForFlag = async (req, res, next) => {
  const flagId = req.params.id;
  try {
    let { rows: exptMetrics } = await experimentsTable.query(GET_EXPT_METRICS_QUERY, [flagId]);
    const experiments = transformExptMetricData(exptMetrics); // transforms to redux-friendly format

    const runningExpt = experiments.find((expt) => expt.date_ended === null);
    if (runningExpt) await setExposuresOnExperiment(runningExpt);
    res.status(200).send(experiments);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message)
  }
};

const addMetricsToExptMetricsTable = async (metricIds, exptId) => { //
  for (let i = 0; i < metricIds.length; i++) {
    const metricId = metricIds[i];
    await experimentMetricsTable.insertRow({ experiment_id: exptId, metric_id: metricId });
  }
}

const createExperiment = async (req, res, next) => {
  try {
    const exptObj = {
      flag_id: req.body.flag_id,
      duration: req.body.duration,
      name: req.body.name || '',
      description: req.body.description || '',
    };
    const newExpt = await experimentsTable.insertRow(exptObj);

    await addMetricsToExptMetricsTable(req.body.metric_ids, newExpt.id)

    const metrics = await experimentMetricsTable.getRowsWhere({ experiment_id: newExpt.id });
    newExpt.metrics = metrics;
    res.status(200).send(newExpt);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message)
  }
};

const updateMetricsOnExpt = async (oldMetricIds, newMetricIds, exptId) => { // helper
  for (let i = 0; i < newMetricIds.length; i++) {
    const newMId = newMetricIds[i];
    if (!oldMetricIds.includes(newMId)) {
      await experimentMetricsTable.insertRow({ experiment_id: exptId, metric_id: newMId });
    }
  }

  for (let i = 0; i < oldMetricIds.length; i++) {
    const oldMId = oldMetricIds[i];
    if (!newMetricIds.includes(oldMId)) {
      await experimentMetricsTable.deleteRow({ experiment_id: exptId, metric_id: oldMId});
    }
  }
}

const editExperiment = async (req, res, next) => {
  const id = req.params.id;
  try {
    let { metric_ids, old_metric_ids, ...updatedFields} = req.body;
    if (metric_ids) await updateMetricsOnExpt(old_metric_ids, metric_ids, id);

    if (updatedFields.date_ended) {
      updatedFields.date_ended = getNowString();
    }

    let updatedExpt;
    if (Object.keys(updatedFields).length > 0) {
      updatedExpt = await experimentsTable.editRow(updatedFields, { id: id });
    } else {
      updatedExpt = await experimentsTable.getRow(id);
    }

    if (!updatedExpt.date_ended) await setExposuresOnExperiment(updatedExpt);
    const updatedMetrics = (await experimentMetricsTable.query(GET_METRIC_DATA, [ id ])).rows;
    updatedExpt.metrics = updatedMetrics;
    req.updatedExpt = updatedExpt;

    next(); // go to analyzeExperiment
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message)
  }
};

const analyzeAll = async (req, res, next) => {
  try {
    await runAnalytics();
    res.status(200).send("Success");
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
};

const analyzeExperiment = async (req, res, next) => {
  const id = req.params.id;
  const returnObj = req.updatedExpt ? { updatedExpt: req.updatedExpt } : {};
  try {
    await runAnalytics(id);
  } catch (e) {
    const errMessage = "Not connected to event database. Please connect and try again for up-to-date results";
    returnObj.error_message = errMessage;
  }

  try {
    const result = await experimentsTable.query(GET_METRIC_DATA, [ id ]);
    returnObj.stats = result.rows;
    res.status(200).send(returnObj);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
};

exports.getExperimentsForFlag = getExperimentsForFlag;
exports.getExperiment = getExperiment;
exports.createExperiment = createExperiment;
exports.editExperiment = editExperiment;
exports.analyzeAll = analyzeAll;
exports.analyzeExperiment = analyzeExperiment;
