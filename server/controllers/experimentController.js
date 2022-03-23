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

const separateMetricExperimentData = (metricExpt) => {
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

const transformMetricExptData = (exptMetrics) => {
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

const createExposureObj = (exposuresArr, variant) => {
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
    const experiments = transformMetricExptData(exptMetrics); // transforms to redux-friendly format
    // attaches exposures to running experiment
    const runningExpt = experiments.find((expt) => expt.date_ended === null);
    if (runningExpt) await setExposuresOnExperiment(runningExpt);
    res.status(200).send(experiments);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message)
  }
};

const createExperiment = async (req, res, next) => {
  try {
    const exptObj = {
      flag_id: req.body.flag_id,
      duration: req.body.duration,
      name: req.body.name || '',
      description: req.body.description || '',
    };
    const newExpt = await experimentsTable.insertRow(exptObj);
    // Add each metric_id to experiment_metrics with the experiment_id
    for (let i = 0; i < req.body.metric_ids.length; i++) {
      const metricId = req.body.metric_ids[i];
      await experimentMetricsTable.insertRow({ experiment_id: newExpt.id, metric_id: metricId });
    }

    const metrics = await experimentMetricsTable.getRowsWhere({ experiment_id: newExpt.id });
    newExpt.metrics = metrics;
    res.status(200).send(newExpt);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message)
  }
};

const editExperiment = async (req, res, next) => {
  const id = req.params.id;
  try {
    let { metric_ids, old_metric_ids, ...updatedFields} = req.body;
    if (updatedFields.date_ended) {
      updatedFields.date_ended = getNowString();
    }

    if (metric_ids) {
      for (let i = 0; i < metric_ids.length; i++) {
        const newMId = metric_ids[i];
        if (!old_metric_ids.includes(newMId)) {
          await experimentMetricsTable.insertRow({ experiment_id: id, metric_id: newMId });
        }
      }

      for (let i = 0; i < old_metric_ids.length; i++) {
        const oldMId = old_metric_ids[i];
        if (!metric_ids.includes(oldMId)) {
          await experimentMetricsTable.deleteRow({ experiment_id: id, metric_id: oldMId});
        }
      }
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
    returnObj.error_message = "Not connected to event database";
  }

  try {
    const result = await experimentsTable.query(GET_METRIC_DATA, [ id ]);
    returnObj.stats = result.rows;
    res.status(200).send(returnObj);
    // if (req.updatedExpt) {
    //   res.status(200).send({ stats: result.rows, updatedExpt: req.updatedExpt });
    // } else {
    //   res.status(200).send(result.rows)
    // }
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
