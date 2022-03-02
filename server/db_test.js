// Use this code as an example for how to query the waypost database
const Pg = require("./db/pg");

const postgres = new Pg();

const getFlags = async () => {
  try {
    const allFlags = await postgres.allFlags();
    console.log(allFlags);
  } catch (error) {
    console.log(error);
  }
};

getFlags();
