// Use this code as an example for how to query the waypost database
const Pg = require("./db/pg");

const postgres = new Pg();

const getFlags = async () => {
  const allFlags = await postgres.allFlags();
  return allFlags;
};

const testResult = getFlags().then((data) => console.log(data));
