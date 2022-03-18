const ttest = require('ttest');
const chi2test = require( '@stdlib/stats-chi2test' );
const { dbQuery } = require("../db/db-query");
const { eventDbQuery } = require("../db/event-db-query");
const { createPlaceholdersArr } = require('../utils');
const { getExptQuery, getActiveExperiments } = require('./experimentExposures');

const getExptMetrics = async (exptIds) => {
  const placeholders = createPlaceholdersArr(exptIds);
  const query = `
    SELECT experiment_id, metric_id FROM experiment_metrics
    WHERE experiment_id IN (${placeholders})
  `
  const result = await dbQuery(query, ...exptIds);
  return result.rows;
};

const getMetricData = async (metricId) => {
  const query = "SELECT * FROM metrics WHERE id = $1"
  return (await dbQuery(query, metricId)).rows[0];
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
      AND m.timestamp >= e.timestamp
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
  const confInterval = stat.confidence();
  const confIntervalPcnt = confInterval.map(num => num / +controlGroup.mean);

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
    COUNT(m.user_id) AS count,
    COUNT(e.user_id) AS num_users,
    1.0 * COUNT(m.user_id) / COUNT(e.user_id) AS rate_per_user
  FROM exposures e
  LEFT JOIN (${metricQuery}) m
    ON e.user_id = m.user_id
    AND m.timestamp >= e.timestamp
  GROUP BY 1
  ORDER BY 1
  `;
  result = await eventDbQuery(query, exptId);
  let obs = []
  result.rows.forEach(group => {
    let data = [ +group.count, +group.num_users - (+group.count) ];
    if (data[0] < 5 || data[1] < 5) {
      throw new Error("Sample size too small");
    }
    obs.push(data);
  });
  const stat = chi2test(obs);

  // Insert into experiment_metrics table
  const insertStatement = `
    UPDATE experiment_metrics
    SET mean_control = $1, mean_test = $2, p_value = $3
    WHERE experiment_id = $4 AND metric_id = $5
  `;
  const [ control, test ] = result.rows;
  await dbQuery(insertStatement, +control.rate_per_user, +test.rate_per_user, stat.pValue, exptId, metricId);
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

const runAnalytics = async (exptId) => {
  let experiments;
  if (exptId === undefined) {
    experiments = await getActiveExperiments();
  } else {
    experiments = [ exptId ];
  }
  const exptMetrics = await getExptMetrics(experiments);
  console.log(exptMetrics);
  exptMetrics.forEach(combo => {
    updateStats(combo);
  });
};

exports.runAnalytics = runAnalytics;