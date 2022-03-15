const PGTable = require("../db/PGTable");
const { METRICS_TABLE_NAME } = require("../constants/db");
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
  res.status(200).send("TODO: Create Metric");
};

const editMetric = async (req, res, next) => {
  const id = req.params.id;
  res.status(200).send("TODO: Edit Metric");
};

const deleteMetric = async (req, res, next) => {
  const id = req.params.id;
  res.status(200).send("TODO: Delete Metric");
};

exports.getMetrics = getMetrics;
exports.getMetric = getMetric;
exports.createMetric = createMetric;
exports.editMetric = editMetric;
exports.deleteMetric = deleteMetric;