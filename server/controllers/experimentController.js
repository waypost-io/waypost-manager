const PGTable = require("../db/PGTable");
const {
  EXPERIMENTS_TABLE_NAME,
  EXPERIMENT_METRICS_TABLE_NAME,
} = require("../constants/db");
const { getNowString } = require("../utils");
const { runAnalytics } = require("../lib/statistics");
const {
  transformExptMetricData,
  setExposuresOnExperiment,
  updateMetricsOnExpt,
  addMetricsToExptMetricsTable,
} = require("../lib/experimentHelpers.js");

const experimentsTable = new PGTable(EXPERIMENTS_TABLE_NAME);
experimentsTable.init();
const experimentMetricsTable = new PGTable(EXPERIMENT_METRICS_TABLE_NAME);
experimentMetricsTable.init();

const GET_METRIC_DATA = `
  SELECT em.experiment_id,
    em.metric_id,
    m.name,
    m.type,
    em.mean_test,
    em.mean_control,
    em.interval_start,
    em.interval_end,
    em.p_value
  FROM experiment_metrics em
  JOIN metrics m
    ON em.metric_id = m.id
  WHERE em.experiment_id = $1
`;

const GET_EXPT_METRICS_QUERY = `
  SELECT e.* ,
    em.metric_id,
    m.name,
    m.type,
    em.mean_test,
    em.mean_control,
    em.interval_start,
    em.interval_end,
    em.p_value
  FROM experiments e
  JOIN experiment_metrics em
    ON e.id=em.experiment_id
  JOIN metrics m
    ON em.metric_id = m.id
  WHERE flag_id = $1
  ORDER BY e.id DESC;
`;

const getExperiment = async (req, res, next) => {
  const id = req.params.id;
  try {
    const experiment = await experimentsTable.getRow(id);
    res.status(200).send(experiment);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
};

const getExperimentsForFlag = async (req, res, next) => {
  const flagId = req.params.id;
  try {
    let {
      rows: exptMetrics,
    } = await experimentsTable.query(GET_EXPT_METRICS_QUERY, [flagId]);
    const experiments = transformExptMetricData(exptMetrics); // transforms to redux-friendly format

    const runningExpt = experiments.find((expt) => expt.date_ended === null);
    if (runningExpt) await setExposuresOnExperiment(runningExpt);
    res.status(200).send(experiments);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
};

const createExperiment = async (req, res, next) => {
  const exptObj = {
    flag_id: req.body.flag_id,
    duration: req.body.duration,
    name: req.body.name || "",
    description: req.body.description || "",
  };

  try {
    const newExpt = await experimentsTable.insertRow(exptObj);

    await addMetricsToExptMetricsTable(req.body.metric_ids, newExpt.id);

    const whereObj = { experiment_id: newExpt.id };
    newExpt.metrics = await experimentMetricsTable.getRowsWhere(whereObj);
    res.status(200).send(newExpt);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
};

const editExperiment = async (req, res, next) => {
  const id = req.params.id;
  let { metric_ids, old_metric_ids, ...updatedFields } = req.body;
  if (updatedFields.date_ended) {
    updatedFields.date_ended = getNowString();
  }
  let updatedExpt;

  try {
    if (metric_ids) await updateMetricsOnExpt(old_metric_ids, metric_ids, id);

    if (Object.keys(updatedFields).length > 0) {
      updatedExpt = await experimentsTable.editRow(updatedFields, { id: id });
    } else {
      updatedExpt = await experimentsTable.getRow(id);
    }

    if (!updatedExpt.date_ended) await setExposuresOnExperiment(updatedExpt);
    updatedExpt.metrics = (
      await experimentMetricsTable.query(GET_METRIC_DATA, [id])
    ).rows;
    req.updatedExpt = updatedExpt;

    next(); // go to analyzeExperiment
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
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
    const errMessage =
      "Not connected to event database. Please connect and try again for up-to-date results";
    returnObj.error_message = errMessage;
  }

  try {
    const result = await experimentsTable.query(GET_METRIC_DATA, [id]);
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
