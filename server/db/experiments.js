const { dbQuery } = require('./db-query.js');

async function getExperimentsForFlag(flagId) {
  const query = `
    SELECT * FROM experiments
    WHERE flag_id = $1
    ORDER BY date_started DESC;
  `;
  const result = await dbQuery(query, flagId);
  return result.rows;
}

async function updateExperimentEndDate(flagId) {
  const updateQuery = `
    UPDATE experiments
    SET date_ended = CURRENT_DATE
    WHERE flag_id = $1 AND date_ended IS NULL;
  `;
  const result = await dbQuery(updateQuery, flagId);
  return result.rows[0];
}

exports.updateExperimentEndDate = updateExperimentEndDate;
exports.getExperimentsForFlag = getExperimentsForFlag;