const { dbQuery } = require("./db-query");

async function getFlagsForWebhook() {
  const query =
    "SELECT id, name, status, percentage_split, hash_offset, is_experiment FROM flags WHERE is_deleted=false;";

  const result = await dbQuery(query);

  if (result.rows[0] === undefined) {
    return undefined;
  }

  return result.rows;
}

module.exports.getFlagsForWebhook = getFlagsForWebhook;
