const { dbQuery } = require("./db-query");
const { eventDbQuery } = require("./event-db-query");

async function insertConnection({ user, host, password, database, port }) {
  const insertQuery = `INSERT INTO connection (pg_user, pg_host, pg_port, pg_database, pg_password) VALUES ('${user}', '${host}', '${port}', '${database}', '${password}');`;

  const result = await dbQuery(insertQuery);
  return result.rows[0];
}

async function deleteConnection() {
  const deleteQuery = `DELETE FROM connection;`;

  const result = await dbQuery(deleteQuery);
  return result;
}

async function testEventQuery() {
  const testQuery = "SELECT;";

  const result = await eventDbQuery(testQuery);
  return result.rows;
}

module.exports.insertConnection = insertConnection;
module.exports.deleteConnection = deleteConnection;
module.exports.testEventQuery = testEventQuery;
