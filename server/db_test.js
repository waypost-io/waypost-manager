const Pg = require("./db/pg");

const postgres = new Pg();

async function getFlags() {
  const allFlags = await postgres.allFlags();
  return allFlags;
}

console.log("this logs");
console.log(getFlags());
