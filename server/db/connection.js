const { dbQuery } = require("./db-query");

async function insertConnection({ user, host, password, database, port }) {
  const insertQuery = `INSERT INTO connection (pg_user, pg_host, pg_port, pg_database, pg_password) VALUES ('${user}', '${host}', '${port}', '${database}', '${password}');`;

  const result = await dbQuery(insertQuery);
  return result.rows[0];
}

async function getConnection() {
  const selectQuery = `SELECT TOP (1) FROM connection`;

  const result = await dbQuery(selectQuery);
  return result;
}

async function deleteConnection() {
  const deleteQuery = `DELETE TOP (1) FROM connection;`;

  const result = await dbQuery(deleteQuery);
  return result;
}

module.exports.insertConnection = insertConnection;
module.exports.getConnection = getConnection;
module.exports.deleteConnection = deleteConnection;
