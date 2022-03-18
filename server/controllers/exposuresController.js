const PGTable = require("../db/PGTable");
const { EXPERIMENTS_TABLE_NAME, EXPERIMENT_METRICS_TABLE_NAME, EXPOSURES_TABLE_NAME, GET_EXPT_METRICS_QUERY, GET_EXPOSURES_ON_EXPT } = require("../constants/db");
const { backfillExposures } = require('../lib/experimentExposures');

const experimentsTable = new PGTable(EXPERIMENTS_TABLE_NAME);
experimentsTable.init();

const backfillData = async (req, res, next) => {
  try {
    const result = await experimentsTable.query("SELECT CURRENT_DATE - MIN(date_started) AS date_diff FROM experiments WHERE date_ended IS NULL");
    const dayDiff = result.rows[0]['date_diff'];
    await backfillExposures(dayDiff);
    res.status(200).send("Successfully updated");
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
};

const getExposures = () => {

};

exports.backfillData = backfillData;
exports.getExposures = getExposures;


