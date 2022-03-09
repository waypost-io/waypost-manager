const pg = require("pg");
const { validationResult } = require("express-validator");
const { insertConnection, deleteConnection } = require("../db/connection.js");

const createConnection = async (req, res, next) => {
  // TODO: create validator
  //const errors = validationResult(req);
  try {
    await insertConnection(req.body);
    res.status(200).send("Connection added");
  } catch (e) {
    res.status(500).send("Error inserting into connection table");
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

module.exports.createConnection = createConnection;
module.exports.removeConnection = removeConnection;
