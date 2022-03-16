const { Client } = require("pg");
require("dotenv").config();

const logQuery = (statement, parameters) => {
  const timeStamp = new Date();
  const formattedTimeStamp = timeStamp.toString().substring(4, 24);
  console.log(formattedTimeStamp, statement, parameters);
};

module.exports = {
  async dbQuery(statement, ...parameters) {
    try {
      const client = new Client({
        user: process.env.DB_USER,
        host: "localhost",
        password: process.env.DB_PASSWORD,
        database: process.env.DB,
        port: 5432,
      });

      await client.connect();

      logQuery(statement, parameters);
      const result = await client.query(statement, parameters);
      await client.end();

      return result;
    } catch (err) {
      // console.log(err.message);
      throw new Error(err.message);
    }
  },
};
