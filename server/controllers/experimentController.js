const PGTable = require("../db/PGTable");
const { EXPERIMENTS_TABLE_NAME, GET_EXPERIMENTS_QUERY } = require("../constants/db");
const { getNowString } = require("../utils");

const experimentsTable = new PGTable(EXPERIMENTS_TABLE_NAME);
experimentsTable.init();

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
  const id = req.params.id;
  try {
    const experiments = await experimentsTable.query(GET_EXPERIMENTS_QUERY, [id]);
    res.status(200).send(experiments.rows);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message)
  }
};

const createExperiment = async (req, res, next) => {
  try {
    const exptObj = {
      flag_id: req.body.flagId,
      duration: req.body.duration,
      metric_ids: `{${req.body.metricIds.join(', ')}}`
    };

    const newExpt = await experimentsTable.insertRow(exptObj);
    res.status(200).send(newExpt);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message)
  }
};

const stopExperiment = async (flagId) => {
  const updatedFields = { date_ended: getNowString() };
  const where = {flag_id: flagId, date_ended: "NULL"};
  try {
    await experimentsTable.editRow(updatedFields, where);
  } catch (err) {
    console.log(err);
  }
};

const analyzeExperiment = async (req, res, next) => {
  const id = req.params.id;
  res.status(200).send("Todo");
};

exports.getExperimentsForFlag = getExperimentsForFlag;
exports.getExperiment = getExperiment;
exports.createExperiment = createExperiment;
exports.stopExperiment = stopExperiment;
exports.analyzeExperiment = analyzeExperiment;