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

exports.getExperimentsForFlag = getExperimentsForFlag;
