const { dbQuery } = require('./db-query.js');

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