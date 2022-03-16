const { validationResult } = require("express-validator");
const { verifyQueryString, verifyConnection } = require("../db/event-db-query");
const { REQUIRED_EVENT_DB_COLS, CONNECTION_TABLE_NAME } = require("../constants/db");
const PGTable = require("../db/PGTable");

const connectionTable = new PGTable(CONNECTION_TABLE_NAME);
connectionTable.init()


const createConnection = async (req, res, next) => {
  // TODO: create validator
  //const errors = validationResult(req);

  try {
    await verifyConnection(req.body);
  } catch (err) {
    console.log(err);
    res.status(200).send({ connected: false, error_message: "Could not connect to DB, invalid credentials." });
    return;
  }

  try {
    console.log(req.body);
    await connectionTable.insertRow(req.body);
  } catch (err) {
    console.log(err);
    res.status(500).send("Insert to database failed");
    return;
  }

  try {
    let errMessage = "Desired columns not returned by query string."
    await verifyQueryString(req.body.expt_table_query, REQUIRED_EVENT_DB_COLS, errMessage)
    res.status(200).send({ connected: true, ok: true });
  } catch (err) {
    console.log(err);
    connectionTable.deleteAllRows();
    res.status(200).send({ connected: true, ok: false, error_message: err.message });
    return
  }
};

const removeConnection = async (req, res, next) => {
  try {
    await connectionTable.deleteAllRows();
    res.status(200).send("Connection removed");
  } catch (e) {
    res.status(500).send("Error deleting from connection table");
  }
};

const testConnection = async (req, res, next) => {
  // NOTE: this is not a great way to do this becuase is just assumes that the db is not connected no matter the error
  try {
    const result = await connectionTable.query("SELECT pg_database FROM connection");

    if (result.rows[0] === undefined) {
      res.status(200).send({ connected: false });
    } else {
      res.status(200).send({ connected: true, database: result.rows[0]["pg_database"] });
    }
  } catch (err) {
    console.log(err);
    res.status(500);
  }
};

module.exports.createConnection = createConnection;
module.exports.removeConnection = removeConnection;
module.exports.testConnection = testConnection;
