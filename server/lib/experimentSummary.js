const ttest = require('ttest');
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

const getExptMetrics = async (exptIds) => {
  const placeholders = createPlaceholdersArr(exptIds);
  const query = `
    SELECT experiment_id, metric_id FROM experiment_metrics
    WHERE experiment_id IN (${placeholders})
  `
  const result = await dbQuery(query, ...exptIds);
  return result.rows;
};

const getNDaysAgoString = (today, numDays) => {
  return `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${(today.getDate() - numDays).toString().padStart(2, '0')}`;
};

const getExptQuery = async () => {
  const query = "SELECT expt_table_query FROM connection";
  return (await dbQuery(query)).rows[0]['expt_table_query'];
};

const getMetricData = async (metricId) => {
  const query = "SELECT * FROM metrics WHERE id = $1"
  return (await dbQuery(query, metricId)).rows[0];
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

const calcContinuousMetric = async (exptId, metricId, exptQuery, metricQuery) => {
  const query = `
    WITH exposures AS (
      SELECT * FROM (${exptQuery}) AS exposure_table
      WHERE experiment_id = $1
    )
    SELECT e.treatment,
      AVG(m.value) AS mean,
      COUNT(e.user_id) AS num_users,
      STDDEV(m.value) AS std_dev
    FROM exposures e
    LEFT JOIN (${metricQuery}) m
      ON e.user_id = m.user_id
    GROUP BY 1
    ORDER BY 1
  `;
  result = await eventDbQuery(query, exptId);
  const [ controlGroup, testGroup ] = result.rows;

  const stat = ttest(
    { mean: +testGroup.mean, variance: (+testGroup.std_dev) ** 2, size: +testGroup.num_users },
    { mean: +controlGroup.mean, variance: (+controlGroup.std_dev) ** 2, size: +controlGroup.num_users }
  );
  const pValue = stat.pValue();
  confInterval = stat.confidence();
  confIntervalPcnt = confInterval.map(num => num / +controlGroup.mean);

  // Insert into experiment_metrics table
  const insertStatement = `
    UPDATE experiment_metrics
    SET mean_control = $1, mean_test = $2,
      interval_start = $3, interval_end = $4,
      p_value = $5
    WHERE experiment_id = $6 AND metric_id = $7
  `;
  await dbQuery(insertStatement, +controlGroup.mean, +testGroup.mean, confIntervalPcnt[0], confIntervalPcnt[1], pValue, exptId, metricId);
};

const calcDiscreteMetric = async (exptId, metricId, exptQuery, metricQuery) => {
  // For binomial type
  const query = `
  WITH exposures AS (
    SELECT * FROM (${exptQuery}) AS exposure_table
    WHERE experiment_id = $1
  )
  SELECT e.treatment,
    COUNT(m.user_id) AS total,
    COUNT(e.user_id) AS num_users,
    1.0 * COUNT(m.user_id) / COUNT(e.user_id) AS rate_per_user
  FROM exposures e
  LEFT JOIN (${metricQuery}) m
    ON e.user_id = m.user_id
  GROUP BY 1
  ORDER BY 1
  `;
  // result = await eventDbQuery(query, exptId);
  // console.log(result.rows);
};

// Does one experiment, one metric at a time
const updateStats = async (exptMetric) => {
  const { experiment_id: exptId, metric_id: metricId } = exptMetric;
  const exptQuery = await getExptQuery();
  const { query_string: metricQuery, type: metricType } = await getMetricData(metricId);
  if (metricType === 'binomial') {
    calcDiscreteMetric(exptId, metricId, exptQuery, metricQuery);
  } else {
    calcContinuousMetric(exptId, metricId, exptQuery, metricQuery);
  }
};

const runAnalytics = async () => {
  const experiments = await getActiveExperiments();
  const exptMetrics = await getExptMetrics(experiments);
  exptMetrics.forEach(combo => {
    updateStats(combo);
  });
};

runAnalytics();

exports.backfillExposures = backfillExposures;
exports.runAnalytics = runAnalytics;