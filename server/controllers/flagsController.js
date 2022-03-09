const pg = require('pg');
const { validationResult } = require("express-validator");
const PGTable = require("../db/PGTable");
const { FLAG_TABLE_NAME } = require("../constants/db");
const { getNowString } = require("../utils");

const flagTable = new PGTable(FLAG_TABLE_NAME);
flagTable.init();

const createNewFlagObj = ({ name, description, status }) => {
  const now = getNowString();
  return {
    name: name,
    description: description || "",
    status: status || false,
    date_created: now,
    date_edited: now,
    last_toggle: now,
  }
}

const createUpdateFlagObj = (fieldsToUpdate) => {
  const now = getNowString();

  if (fieldsToUpdate.status !== undefined) fieldsToUpdate["last_toggle"] = now;
  fieldsToUpdate["date_edited"] = now;

  return fieldsToUpdate;
}

const getAllFlags = async (req, res, next) => {
  try {
    const data = await flagTable.getAllRows();
    if (!data) {
      throw new Error(`Data could not be retreived from the ${flagTable.tableName} table`);
    }
    res.status(200).send(data);
  } catch (e) {
    res.status(500).send(e.message)
  }
};

const getFlag = async (req, res, next) => {
  const id = req.params.id;
  try {
    const data = await flagTable.getRow(id);
    if (!data) {
      throw new Error(`This flag could not be retreived from the ${flagTable.tableName} table`);
    }
    res.status(200).send(data);
  } catch (e) {
    res.status(500).send(e.message)
  }
};

const createFlag = async (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    const newFlag = createNewFlagObj(req.body);

    try {
      const savedFlag = await flagTable.insertRow(newFlag);
      res.status(200).send(savedFlag);
    } catch (e) {
      res.status(500).send("Error inserting into flags table");
    }

  } else {
    return next(new HttpError("The name field is empty.", 400))
  }
};

const editFlag = async (req, res, next) => {
  // figure out how to validate this
  const id = req.params.id;
  const now = getNowString();
  const updatedFields = createUpdateFlagObj(req.body);

  try {
    const updatedFlag = await flagTable.editRow(id, updatedFields);
    res.status(200).send(updatedFlag);
  } catch (e) {
    res.status(500).send(e);
  }
};

const deleteFlag = async (req, res, next) => {
  const id = req.params.id;
  try {
    const result = await flagTable.deleteRow(id);
    if (result.rows.length === 0) throw new Error(`Flag with the id of ${id} doesn't exist`);

    const deletedFlagName = result.rows[0].name;
    // change id to getting it from result?
    res.status(200).send(`Flag '${deletedFlagName}' with id = ${id} successfully deleted`);
  } catch (e) {
    res.status(400).send(e.message)
  }
};

exports.getAllFlags = getAllFlags;
exports.createFlag = createFlag;
exports.editFlag = editFlag;
exports.deleteFlag = deleteFlag;
exports.getFlag = getFlag;
