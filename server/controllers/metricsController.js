const PGTable = require("../db/PGTable");
const { METRICS_TABLE_NAME, METRIC_TYPES } = require("../constants/db");
const { getNowString } = require("../utils");

const metricsTable = new PGTable(METRICS_TABLE_NAME);
metricsTable.init();

const getMetrics = async (req, res, next) => {
  try {
    const metrics = await metricsTable.getAllRows();
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
  try {
    if (!METRIC_TYPES.includes(req.body.type)) {
      res.status(400).send("Type not valid");
      return;
    }
    // TODO: Validate the query by connecting to the database
    // If no database connection, tell them to set that up first.

    const metricObj = {
      name: req.body.name,
      query_string: req.body.query_string,
      type: req.body.type
    };

    const newMetric = await metricsTable.insertRow(metricObj);
    res.status(200).send(newMetric);
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
    res.status(200).send(updatedMetric);
  } catch (e) {
    res.status(500).send(e);
  }
};

const deleteMetric = async (req, res, next) => {
  const id = req.params.id;
  try {
    const result = await metricsTable.deleteRow(id);
    if (result.rows.length === 0) {
      throw new Error(`Metric with id ${id} doesn't exist`);
    }
    const deletedMetricName = result.rows[0].name;
    res.status(200).send(`Metric '${deletedMetricName}' with id ${id} successfully deleted`);
  } catch (e) {
    res.status(500).send(e.message);
  }
};

exports.getMetrics = getMetrics;
exports.getMetric = getMetric;
exports.createMetric = createMetric;
exports.editMetric = editMetric;
exports.deleteMetric = deleteMetric;