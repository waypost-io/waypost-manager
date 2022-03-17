const { Client } = require("pg");

const logQuery = (statement, parameters) => {
  const timeStamp = new Date();
  const formattedTimeStamp = timeStamp.toString().substring(4, 24);
  console.log(formattedTimeStamp, statement, parameters);
};

const dbQuery = async (statement, ...parameters) => {
  try {
    const client = new Client({
      user: process.env.POSTGRES_USER,
      host: process.env.POSTGRES_HOST,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      port: process.env.POSTGRES_PORT,
    });

    await client.connect();

    logQuery(statement, parameters);
    const result = await client.query(statement, parameters);
    await client.end();

    return result;
  } catch (err) {
    console.log(err.message);
    throw new Error(err.message);
  }
};

exports.dbQuery = dbQuery;

