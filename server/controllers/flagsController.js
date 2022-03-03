const pg = require('pg');
const { validationResult } = require("express-validator");
const { dbQuery } = require("../db/db-query");
const { FLAGS_COL_NAMES } = require("../constants/db");

const createFlagInsertStatement = (newFlag) => {
  const columns = FLAGS_COL_NAMES.filter((col) => ![null, "", undefined].includes(newFlag[col]));
  const values = columns.map((col) => `'${newFlag[col]}'`);
  return `INSERT INTO flags(${columns.join(", ")}) VALUES (${values.join(", ")})`
}

const getAllFlags = async (req, res, next) => {
  const result = await dbQuery("SELECT * FROM flags");
  res.send(result.rows);
};

const createFlag = async (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    const today = new Date().toISOString()
    const newFlag = {
      name: req.body.name,
      description: req.body.description || "",
      status: req.body.status || false,
      date_created: today,
      date_edited: today,
      last_toggle: today,
    }

    const queryString = createFlagInsertStatement(newFlag);
    try {
      const result = await dbQuery(queryString);
      res.status(200).send(newFlag);
    } catch (e) {
      res.status(500).send("Error inserting into flags table");
    }
  } else {
    return next(new HttpError("The name field is empty.", 400))
  }
};

const editFlag = (req, res, next) => {
  res.send("editFlag");
};

const deleteFlag = (req, res, next) => {
  res.send("deleteFlag");
};

exports.getAllFlags = getAllFlags;
exports.createFlag = createFlag;
exports.editFlag = editFlag;
exports.deleteFlag = deleteFlag;
