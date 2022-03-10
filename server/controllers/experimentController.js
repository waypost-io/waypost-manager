const PGTable = require("../db/PGTable");
const { updateExperimentEndDate } = require("../db/experiments.js");
const { EXPERIMENTS_TABLE_NAME } = require("../constants/db");
const { getNowString } = require("../utils");

const experimentsTable = new PGTable(EXPERIMENTS_TABLE_NAME);
experimentsTable.init();

const createExperiment = async (flagId) => {
  const newExpt = await experimentsTable.insertRow({ flag_id: flagId });
  return newExpt.id;
};

const stopExperiment = (flagId) => {
  updateExperimentEndDate(flagId);
}

exports.createExperiment = createExperiment;
exports.stopExperiment = stopExperiment;