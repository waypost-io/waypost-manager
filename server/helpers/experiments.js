const PGTable = require("../db/PGTable");
const { EXPERIMENT_METRICS_TABLE_NAME, EXPOSURES_TABLE_NAME, GET_EXPOSURES_ON_EXPT } = require("../constants/db");
const experimentMetricsTable = new PGTable(EXPERIMENT_METRICS_TABLE_NAME);
experimentMetricsTable.init();
const exposuresTable = new PGTable(EXPOSURES_TABLE_NAME);
exposuresTable.init();

// separateMetricExperimentData
// takes metric experiment data and separates it into two objects
// one with metric data, one with experiment data
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

// transformExptMetricData
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

const addMetricsToExptMetricsTable = async (metricIds, exptId) => { //
  for (let i = 0; i < metricIds.length; i++) {
    const metricId = metricIds[i];
    await experimentMetricsTable.insertRow({ experiment_id: exptId, metric_id: metricId });
  }
}

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

exports.transformExptMetricData = transformExptMetricData;
exports.setExposuresOnExperiment = setExposuresOnExperiment;
exports.updateMetricsOnExpt = updateMetricsOnExpt;
exports.addMetricsToExptMetricsTable = addMetricsToExptMetricsTable;
