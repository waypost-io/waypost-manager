const PGTable = require("../db/PGTable");
const { getExperimentsForFlag, updateExperimentEndDate } = require("../db/experiments.js");
const { EXPERIMENTS_TABLE_NAME } = require("../constants/db");
const { getNowString } = require("../utils");

const experimentsTable = new PGTable(EXPERIMENTS_TABLE_NAME);
experimentsTable.init();

const getExperiments = async (req, res, next) => {
  const flagId = req.params.flagId;
  try {
    const experiments = await getExperimentsForFlag(flagId);
    res.status(200).send(experiments);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message)
  }
};

const createExperiment = async (flagId) => {
  const newExpt = await experimentsTable.insertRow({ flag_id: flagId });
  return newExpt.id;
};

const stopExperiment = (flagId) => {
  updateExperimentEndDate(flagId);
}

exports.getExperiments = getExperiments;
exports.createExperiment = createExperiment;
exports.stopExperiment = stopExperiment;