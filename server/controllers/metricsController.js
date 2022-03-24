const PGTable = require("../db/PGTable");
const { METRICS_TABLE_NAME, METRIC_TYPES } = require("../constants/db");
const { getNowString } = require("../utils");
const { eventDbQuery, verifyQueryString } = require("../db/event-db-query");

const metricsTable = new PGTable(METRICS_TABLE_NAME);
metricsTable.init();

const BINOMIAL_COLS = ['user_id', 'timestamp'];
const METRIC_COLS = ['user_id', 'timestamp', 'value'];

const validateQuery = async (req, res, next) => {
  const type = req.body.type;
  const requiredCols = type === 'binomial' ? BINOMIAL_COLS : METRIC_COLS;

  try {
    await verifyQueryString(req.body.query_string, requiredCols, "Columns not correct");
  } catch (err) {
    console.log(err);
    res.status(200).send({ ok: false, error_message: err.message });
    return;
  }
  next();
};

const getMetrics = async (req, res, next) => {
  try {
    const metrics = await metricsTable.getAllRowsNotDeleted();
    res.status(200).send(metrics);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message)
  }
};

const getMetric = async (req, res, next) => {
  const id = req.params.id;
  try {
    const metric = await metricsTable.getRow(id);
    res.status(200).send(metric);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message)
  }
};

const createMetric = async (req, res, next) => {
  if (!METRIC_TYPES.includes(req.body.type)) {
    res.status(400).send("Type not valid");
    return;
  }

  const metricObj = {
    name: req.body.name,
    query_string: req.body.query_string,
    type: req.body.type
  };

  try {
    const newMetric = await metricsTable.insertRow(metricObj);
    res.status(200).send({ok: true, metric: newMetric });
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message)
  }
};

const editMetric = async (req, res, next) => {
  const id = req.params.id;
  const updatedFields = req.body;
  try {
    const updatedMetric = await metricsTable.editRow(updatedFields, { id });
    res.status(200).send({ ok: true, metric: updatedMetric });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const deleteMetric = async (req, res, next) => {
  const id = req.params.id;
  try {
    const result = await metricsTable.editRow({ is_deleted: true }, { id: Number(id) });
    if (!result) {
      throw new Error(`Metric with id ${id} doesn't exist`);
    }
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.validateQuery = validateQuery;
exports.getMetrics = getMetrics;
exports.getMetric = getMetric;
exports.createMetric = createMetric;
exports.editMetric = editMetric;
exports.deleteMetric = deleteMetric;
