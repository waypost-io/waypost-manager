const { Client } = require("pg");
const { dbQuery } = require("./db-query");

const logQuery = (statement, parameters) => {
  const timeStamp = new Date();
  const formattedTimeStamp = timeStamp.toString().substring(4, 24);
  console.log(formattedTimeStamp, statement, parameters);
};

module.exports = {
  async eventDbQuery(statement, ...parameters) {
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
  },

  async verifyConnection({ user, host, password, database, port }) {
    const client = new Client({
      user,
      host,
      password,
      database,
      port,
    });

    await client.connect();

    console.log(
      `Connection to host: ${host} database: ${database} successfully verified.`
    );

    await client.end();
  },
};
