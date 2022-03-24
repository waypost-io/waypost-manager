const PGTable = require("../db/PGTable");
const { EXPERIMENTS_TABLE_NAME, EXPERIMENT_METRICS_TABLE_NAME, GET_EXPT_METRICS_QUERY, GET_METRIC_DATA } = require("../constants/db");
const { getNowString } = require("../utils");
const { runAnalytics } = require('../lib/statistics');
const {
  transformExptMetricData,
  setExposuresOnExperiment,
  updateMetricsOnExpt,
  addMetricsToExptMetricsTable,
} = require("../helpers/experiments.js")

const experimentsTable = new PGTable(EXPERIMENTS_TABLE_NAME);
experimentsTable.init();
const experimentMetricsTable = new PGTable(EXPERIMENT_METRICS_TABLE_NAME);
experimentMetricsTable.init();

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
