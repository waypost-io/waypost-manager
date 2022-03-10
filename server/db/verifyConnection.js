const { Client } = require("pg");
const { dbServerQuery } = require("./db-query");

// send an initial query to the db server and make sure that it does not throw an error
module.exports = {
  async verifyConnection({ user, host, password, database, port }) {
    let client = new Client({
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
