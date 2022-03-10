const { validationResult } = require("express-validator");
const {
  insertConnection,
  deleteConnection,
  testEventQuery,
} = require("../db/connection.js");
const { verifyConnection } = require("../db/event-db-query.js");

const createConnection = async (req, res, next) => {
  // TODO: create validator
  //const errors = validationResult(req);

  try {
    // Verify that the connection works
    await verifyConnection(req.body);

    // Save the connection to the database
    await insertConnection(req.body);

    res.status(200).send("Connection added");
  } catch (e) {
    console.log(e);

    if (e.routine === "auth_failed") {
      res.status(500).send("Authentication failed");
    } else {
      res.status(500).send("Insert to database failed");
    }
  }
};

const removeConnection = async (req, res, next) => {
  try {
    await deleteConnection();
    res.status(200).send("Connection removed");
  } catch (e) {
    res.status(500).send(e, "Error deleting from connection table");
  }
};

const testConnection = async (req, res, next) => {
  // NOTE: this is not a great way to do this becuase is just assumes that the db is not connected no matter the error
  try {
    await testEventQuery();
    res.status(200).send("Database connected");
  } catch (err) {
    res.status(500).send("Database not connected");
  }
};

module.exports.createConnection = createConnection;
module.exports.removeConnection = removeConnection;
module.exports.testConnection = testConnection;
