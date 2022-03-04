const pg = require('pg');
const { validationResult } = require("express-validator");
const { dbQuery } = require("../db/db-query");
const { FLAGS_COL_NAMES } = require("../constants/db");
const TABLE_NAME = "flags"
const INVALID_UPDATE_MESSAGE = "No valid parameters passed to update";

function getNowString() {
  return new Date().toISOString();
}

const createInsertStatement = (newFlag) => {
  const columns = FLAGS_COL_NAMES.filter((col) => ![null, "", undefined].includes(newFlag[col]));
  const values = columns.map((col) => `'${newFlag[col]}'`);
  return `INSERT INTO ${TABLE_NAME}(${columns.join(", ")}) VALUES (${values.join(", ")}) RETURNING *`
}

const createUpdateStatement = (id, updatedFields) => {
  const now = getNowString();
  if (updatedFields.status !== undefined) updatedFields["last_toggle"] = now;

  const edits = [];
  Object.keys(updatedFields).forEach((fieldName) => {
    if (FLAGS_COL_NAMES.includes(fieldName)) {
      edits.push(`${fieldName} = '${updatedFields[fieldName]}'`);
    }
  });
  if (edits.length === 0) throw new Error(INVALID_UPDATE_MESSAGE);
  updatedFields["date_edited"] = now;

  return `UPDATE ${TABLE_NAME} SET ${edits.join(", ")} WHERE id = ${id} RETURNING *`;
}

const createDeleteStatement = (id) => {
  return `DELETE FROM ${TABLE_NAME} WHERE id = ${id} RETURNING *`;
}

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

const getAllFlags = async (req, res, next) => {
  const result = await dbQuery("SELECT * FROM flags");
  res.send(result.rows);
};

const createFlag = async (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    const newFlag = createNewFlagObj(req.body);
    const queryString = createInsertStatement(newFlag);
    try {
      const result = await dbQuery(queryString);
      const savedFlag = result.rows[0]
      res.status(200).send(savedFlag);
    } catch (e) {
      res.status(500).send("Error inserting into flags table");
    }
  } else {
    return next(new HttpError("The name field is empty.", 400))
  }
};

const editFlag = async (req, res, next) => {
  const id = req.params.id;
  try {
    const queryString = createUpdateStatement(id, req.body);
    const result = await dbQuery(queryString);
    const updatedFlag = result.rows[0];
    res.status(200).send(updatedFlag);
  } catch (e) {
    if (e.message === INVALID_UPDATE_MESSAGE) {
      const errObj = {
        message: INVALID_UPDATE_MESSAGE,
        data: req.body
      }
      res.status(400).send(errObj);
    } else {
      res.status(500).send(e)
    }
  }
};

const deleteFlag = async (req, res, next) => {
  const id = req.params.id;
  const queryString = createDeleteStatement(id);
  try {
    const result = await dbQuery(queryString);
    if (result.rows.length === 0) throw new Error(`Flag with the id of ${id} doesn't exist`);

    const deletedFlagName = result.rows[0].name;
    res.status(200).send(`Flag '${deletedFlagName}' with id = ${id} successfully deleted`);
  } catch (e) {
    res.status(400).send(e.message)
  }
};

exports.getAllFlags = getAllFlags;
exports.createFlag = createFlag;
exports.editFlag = editFlag;
exports.deleteFlag = deleteFlag;
