const PGTable = require("../db/PGTable");
const { dbQuery } = require("../db/db-query");
const { eventDbQuery } = require("../db/event-db-query");
const { EXPOSURES_TABLE_NAME, EXPERIMENTS_TABLE_NAME } = require('../constants/db');
const { createPlaceholdersArr } = require('../utils');

const experimentsTable = new PGTable(EXPERIMENTS_TABLE_NAME);
const exposuresTable = new PGTable(EXPOSURES_TABLE_NAME);
experimentsTable.init();
exposuresTable.init();

const missingExposureData = async (dateStr) => {
  const result = await exposuresTable.query(`SELECT COUNT(1) FROM exposures WHERE date = $1`, [ dateStr ]);
  return (result.rows[0].count === '0');
};

const getActiveExperiments = async () => {
  const result = await experimentsTable.query('SELECT id FROM experiments WHERE date_ended IS NULL');
  return result.rows.map(row => row.id);
};

const getNDaysAgoString = (today, numDays) => {
  return `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${(today.getDate() - numDays).toString().padStart(2, '0')}`;
};

const getExptQuery = async () => {
  const query = "SELECT expt_table_query FROM connection";
  return (await dbQuery(query)).rows[0]['expt_table_query'];
};

const countExposures = async (exptIds, dateStr) => {
  try {
    const exptQuery = await getExptQuery();
    const idPlaceholders = createPlaceholdersArr(exptIds);
    const datePlaceholder = `$${exptIds.length + 1}`;
    const countExposuresQuery = `
      SELECT experiment_id,
        treatment,
        COUNT(user_id) AS num_users
      FROM (${exptQuery}) AS expt_table
      WHERE experiment_id IN (${idPlaceholders})
        AND DATE(timestamp) <= ${datePlaceholder}
      GROUP BY 1, 2;
    `;
    const params = [ ...exptIds, dateStr ];
    const queryResult = await eventDbQuery(countExposuresQuery, ...params);
    return queryResult.rows;
  } catch (err) {
    console.log(err);
    return;
  }
};

const updateExposures = async (exposureData, dateStr) => {
  try {
    // Insert into exposures table
    const formattedData = exposureData.map(row => `(${row.experiment_id}, '${row.treatment ? 'test' : 'control'}', ${row.num_users}, '${dateStr}')`).join(', ');

    const insertQuery = `
      INSERT INTO exposures (experiment_id, variant, num_users, date)
      VALUES ${formattedData};
    `;
    await exposuresTable.query(insertQuery);
  } catch (err) {
    console.log(err);
    return;
  }
};

const runExposuresPipeline = async (dateStr) => {
  const experiments = await getActiveExperiments();
  const data = await countExposures(experiments, dateStr);
  if (data) {
    if (data.length === 0) {
      console.log(`No exposures available for ${dateStr}`);
      return;
    }
    updateExposures(data, dateStr);
  }
  else {
    console.log(`Error with getting data for ${dateStr}`);
  }
};

const backfillExposures = async (numDays = 7) => {
  // Creates array of dates in SQL format from numDays (or 7) days ago through yesterday
  const last7Days = Array(numDays).fill().map((_, i) => i + 1).map(num => getNDaysAgoString(new Date(), num));

  for (let i = 0; i < last7Days.length; i++) {
    const dateStr = last7Days[i];
    const missing = await missingExposureData(dateStr);
    if (missing) {
      await runExposuresPipeline(dateStr);
    }
  }
};

exports.getExptQuery = getExptQuery;
exports.getActiveExperiments = getActiveExperiments;
exports.backfillExposures = backfillExposures;