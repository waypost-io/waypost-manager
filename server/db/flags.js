const { dbQuery } = require("./db-query");

async function getFlagsForWebhook() {
  const query =
    "SELECT name, status, app_id, percentage_split, is_deleted FROM flags;";

  const result = await dbQuery(query);

  if (result.rows[0] === undefined) {
    return undefined;
  }

  return result.rows;
}

module.exports.getFlagsForWebhook = getFlagsForWebhook;
