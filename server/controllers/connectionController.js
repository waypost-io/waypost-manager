const pg = require("pg");
const { validationResult } = require("express-validator");
const { insertConnection, deleteConnection } = require("../db/connection.js");

const createConnection = async (req, res, next) => {
  // TODO: create validator
  //const errors = validationResult(req);
  try {
    const newConnection = await insertConnection(req.body);
    res.status(200).send(savedFlag);
  } catch (e) {
    res.status(500).send("Error inserting into flags table");
  }
};

const removeConnection = async (req, res, next) => {
  try {
    const result = await deleteConnection();
    return result;
  } catch (e) {
    res.status(500).send("Error inserting into flags table");
  }
};
