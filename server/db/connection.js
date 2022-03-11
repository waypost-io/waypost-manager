const { dbQuery } = require("./db-query");
const { eventDbQuery } = require("./event-db-query");

async function insertConnection({ user, host, password, database, port }) {
  const insertQuery =
    "INSERT INTO connection (pg_user, pg_host, pg_port, pg_database, pg_password) VALUES ( $1, $2, $3, $4, $5);";

  const result = await dbQuery(
    insertQuery,
    user,
    host,
    port,
    database,
    password
  );
  return result.rows[0];
}

async function deleteConnection() {
  const deleteQuery = `DELETE FROM connection;`;

  const result = await dbQuery(deleteQuery);
  return result;
}

async function getDatabaseName() {
  const databaseNameQuery = "SELECT pg_database FROM connection;";

  const result = await dbQuery(databaseNameQuery);

  if (result.rows[0] === undefined) {
    return undefined;
  }

  return result.rows[0]["pg_database"];
}

module.exports.insertConnection = insertConnection;
module.exports.deleteConnection = deleteConnection;
module.exports.getDatabaseName = getDatabaseName;
