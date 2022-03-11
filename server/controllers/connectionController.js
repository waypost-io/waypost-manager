const { validationResult } = require("express-validator");
const {
  insertConnection,
  deleteConnection,
  testEventQuery,
  getDatabaseName,
} = require("../db/connection.js");
const { verifyConnection } = require("../db/event-db-query.js");

const createConnection = async (req, res, next) => {
  // TODO: create validator
  //const errors = validationResult(req);

  try {
    await verifyConnection(req.body);
  } catch (err) {
    console.log(err);
    res.status(200).send({ connected: false });
  }

  try {
    await insertConnection(req.body);
    res.status(200).send({ connected: true });
  } catch (err) {
    console.log(err);
    res.status(500).send("Insert to database failed");
  }
};

const removeConnection = async (req, res, next) => {
  try {
    await deleteConnection();
    res.status(200).send("Connection removed");
  } catch (e) {
    res.status(500).send("Error deleting from connection table");
  }
};

const testConnection = async (req, res, next) => {
  // NOTE: this is not a great way to do this becuase is just assumes that the db is not connected no matter the error
  try {
    const result = await getDatabaseName();

    if (result === undefined) {
      res.status(200).send({ connected: false });
    } else {
      res.status(200).send({ connected: true, database: result });
    }
  } catch (err) {
    console.log(err);
    res.status(500);
  }
};

module.exports.createConnection = createConnection;
module.exports.removeConnection = removeConnection;
module.exports.testConnection = testConnection;
