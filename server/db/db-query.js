const { Client } = require("pg");
require("dotenv").config();

const logQuery = (statement, parameters) => {
  let timeStamp = new Date();
  let formattedTimeStamp = timeStamp.toString().substring(4, 24);
  console.log(formattedTimeStamp, statement, parameters);
};

module.exports = {
  async dbQuery(statement, ...parameters) {
    let client = new Client({
      database: process.env.DB,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    await client.connect();

    logQuery(statement, parameters);
    let result = await client.query(statement, parameters);
    await client.end();

    return result;
  },

  // connection to the user event database. Merge this function with the code above once I have a clearer picture of the process
  async dbServerQuery(statement, ...parameters) {
    let client = new Client({
      pgUser: "placeholder",
      pgHost: "placeholder",
      pgPassword: "placeholder",
      pgDatabase: "placeholder",
      pgPort: "placeholder",
    });

    await client.connect();

    logQuery(statement, parameters);
    let result = await client.query(statement, parameters);
    await client.end();

    return result;
  },
};
