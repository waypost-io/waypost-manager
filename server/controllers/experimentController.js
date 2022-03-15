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
    const hash_offset = Math.floor(Math.random() * 100);
    const exptObj = {
      flag_id: req.body.flagId,
      duration: req.body.duration,
      metric_ids: `{${req.body.metricIds.join(', ')}}`,
      name: req.body.name || '',
      description: req.body.description || '',
      hash_offset
    };

    const newExpt = await experimentsTable.insertRow(exptObj);
    res.status(200).send(newExpt);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message)
  }
};

const editExperiment = async (req, res, next) => {
  const id = req.params.id;
  try {
    const updatedFields = req.body;
    const updatedExpt = await experimentsTable.editRow(updatedFields, { id: id });
    res.status(200).send(updatedExpt);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message)
  }
};

const analyzeExperiment = async (req, res, next) => {
  const id = req.params.id;
  res.status(200).send("Todo");
};

exports.getExperimentsForFlag = getExperimentsForFlag;
exports.getExperiment = getExperiment;
exports.createExperiment = createExperiment;
exports.editExperiment = editExperiment;
exports.analyzeExperiment = analyzeExperiment;