const cron = require('node-cron');
const PGTable = require("../db/PGTable");
const { dbQuery } = require("../db/db-query");
const { eventDbQuery } = require("../db/event-db-query");
const { EXPOSURES_TABLE_NAME, EXPERIMENTS_TABLE_NAME } = require('../constants/db');

const experimentsTable = new PGTable(EXPERIMENTS_TABLE_NAME);
const exposuresTable = new PGTable(EXPOSURES_TABLE_NAME);
experimentsTable.init();
exposuresTable.init();

// Get all experiments
const getActiveExperiments = async () => {
  const result = await experimentsTable.query('SELECT id FROM experiments WHERE date_ended IS NULL');
  return result.rows.map(row => row.id);
}

const getYesterdayString = (today) => {
  return `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${(today.getDate() - 1).toString().padStart(2, '0')}`;
};

const updateExposures = async (exptIds) => {
  try {
    const exptQuery = "SELECT * FROM experiments";
    const countExposuresQuery = `
      SELECT experiment_id,
        variation_id,
        COUNT(user_id) AS num_users
      FROM ${exptQuery} AS expt_table
      WHERE experiment_id IN $1
        AND DATE(timestamp) = '$2'
      GROUP BY 1, 2;
    `;
    const ids = `(${exptIds.join(', ')})`;
    const latest_date = getYesterdayString(new Date());
    const params = [ids, latest_date];
    // Need the query for their experiments table first
    // const exposureData = await eventDbQuery(countExposuresQuery, params);
    // Dummy data:
    const exposureData = [{ experiment_id: 1, variation_id: 0, num_users: 100 }, { experiment_id: 1, variation_id: 1, num_users: 101 }, { experiment_id: 2, variation_id: 0, num_users: 50 },  { experiment_id: 2, variation_id: 1, num_users: 51 }];
    // Insert into exposures table
    const formattedData = exposureData.map(row => `(${row.experiment_id}, ${row.variation_id}, ${row.num_users}, '${latest_date}')`).join(', ');
    console.log(formattedData);
    const insertQuery = `
      INSERT INTO exposures (experiment_id, variant, num_users, date)
      VALUES ${formattedData};
    `;
    await exposuresTable.query(insertQuery);
    console.log("Successfully inserted data into exposures table");
  } catch (err) {
    console.log(err.message);
    return;
  }
};

// Runs once immediately for testing purposes
(async () => {
  const experiments = await getActiveExperiments();
  updateExposures(experiments);
})();
/*
crontab syntax:
A single asterisk means the task will be run for every instance of that unit of time
  * * * * * *
  | | | | | |
  | | | | | day of week
  | | | | month
  | | | day of month
  | | hour
  | minute
  second ( optional )

For once daily at 3am, use '0 3 * * *'
*/
// cron.schedule('0 3 * * *', async () => {
//   const experiments = await getActiveExperiments();
//   updateExposures(experiments);
// });
