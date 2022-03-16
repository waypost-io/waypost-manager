const { Client } = require("pg");
const { dbQuery } = require("./db-query");

const logQuery = (statement, parameters) => {
  const timeStamp = new Date();
  const formattedTimeStamp = timeStamp.toString().substring(4, 24);
  console.log(formattedTimeStamp, statement, parameters);
};

const eventDbQuery = async (statement, ...parameters) => {
  const selectQuery = `SELECT * FROM connection;`;
  const queryResult = await dbQuery(selectQuery);
  const credentials = queryResult.rows[0];

  const client = new Client({
    user: credentials.pg_user,
    host: credentials.pg_host,
    password: credentials.pg_password,
    database: credentials.pg_database,
    port: credentials.pg_port,
  });

  await client.connect();

  logQuery(statement, parameters);
  const result = await client.query(statement, parameters);

  await client.end();

  return result;
}

const verifyConnection = async (credentials) => {
  const client = new Client({
    user: credentials.pg_user,
    host: credentials.pg_host,
    password: credentials.pg_password,
    database: credentials.pg_database,
    port: credentials.pg_port,
  });

  await client.connect();

  console.log(
    `Connection to host: ${credentials.pg_host} database: ${credentials.pg_database} successfully verified.`
  );

  await client.end();
}

const verifyQueryString = async (queryString, requiredCols, errMessage) => {
  const queryResult = await eventDbQuery(`SELECT * FROM (${queryString}) AS provided_query WHERE FALSE;`)
  const tableCols = queryResult.fields.map(field => field.name);
  for (let i = 0; i < requiredCols.length; i++) {
    if (!tableCols.includes(requiredCols[i])) {
      throw new Error(errMessage);
    }
  };
}

module.exports.eventDbQuery = eventDbQuery;
module.exports.verifyConnection = verifyConnection;
module.exports.verifyQueryString = verifyQueryString;
