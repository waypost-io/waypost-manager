const pg = require("pg");
const { validationResult } = require("express-validator");
const PGTable = require("../db/PGTable");
const { FLAG_TABLE_NAME } = require("../constants/db");
const { getNowString } = require("../utils");
const { sendWebhook } = require("../lib/sendWebhook.js");
const { getFlagsForWebhook } = require("../db/flags.js");
const {
  createExperiment,
  stopExperiment,
} = require("./experimentController.js");
// const { status } = require("./streamController");

const flagTable = new PGTable(FLAG_TABLE_NAME);
flagTable.init();

const createNewFlagObj = ({
  name,
  description,
  percentage_split,
  status,
  is_experiment,
  app_id,
}) => {
  const now = getNowString();
  return {
    name: name,
    app_id: app_id || null,
    description: description || "",
    percentage_split: percentage_split || 100,
    status: status || false,
    is_experiment: is_experiment || false,
    date_created: now,
    is_deleted: false,
  };
};

// const createUpdateFlagObj = (fieldsToUpdate) => {
//   const now = getNowString();
//
//   if (fieldsToUpdate.status !== undefined) fieldsToUpdate["last_toggle"] = now;
//   fieldsToUpdate["date_edited"] = now;
//
//   return fieldsToUpdate;
// }

const getAllFlags = async (req, res, next) => {
  try {
    let data;

    if (req.query.prov) {
      data = await getFlagsForWebhook();
    } else {
      data = await flagTable.getAllRows();

      if (!data) {
        throw new Error(
          `Data could not be retreived from the ${flagTable.tableName} table`
        );
      }
    }

    res.status(200).send(data);
  } catch (e) {
    res.status(500).send(e.message);
  }
};

const setFlagsOnReq = async (req, res, next) => {
  const data = await getFlagsForWebhook();
  req.flags = data;
  next();
};

const getFlag = async (req, res, next) => {
  const id = req.params.id;
  try {
    const data = await flagTable.getRow(id);
    if (!data) {
      throw new Error(
        `This flag could not be retreived from the ${flagTable.tableName} table`
      );
    }
    res.status(200).send(data);
  } catch (e) {
    res.status(500).send(e.message);
  }
};

const createFlag = async (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    const newFlag = createNewFlagObj(req.body);

    try {
      const savedFlag = await flagTable.insertRow(newFlag);
      req.update = true;
      res.status(200).send(savedFlag);
      next();
    } catch (e) {
      res.status(500).send("Error inserting into flags table");
    }
  } else {
    return next(new HttpError("The name field is empty.", 400));
  }
};

const editFlag = async (req, res, next) => {
  // figure out how to validate this
  const id = req.params.id;
  const now = getNowString();
  const updatedFields = req.body;
  if (updatedFields.is_experiment) {
    createExperiment(id);
  } else if (updatedFields.is_experiment === false) {
    stopExperiment(id);
  }

  try {
    const updatedFlag = await flagTable.editRow(updatedFields, { id });
    req.update = true;

    res.status(200).send(updatedFlag);
    next();
  } catch (e) {
    res.status(500).send(e);
  }
};

const deleteFlag = async (req, res, next) => {
  const id = req.params.id;
  try {
    const result = await flagTable.deleteRow(id);
    if (result.rows.length === 0)
      throw new Error(`Flag with the id of ${id} doesn't exist`);

    const deletedFlagName = result.rows[0].name;
    req.update = true;

    res
      .status(200)
      .send(`Flag '${deletedFlagName}' with id = ${id} successfully deleted`);
    next();
  } catch (e) {
    res.status(400).send(e.message);
  }
};

const sendFlagsWebhook = async (req, res, next) => {
  try {
    await sendWebhook(req.flags);
    res.status(200).send("Webhook sent");
  } catch (err) {
    console.log(err);
    console.log("Could not send webhook");
  }
};

exports.getAllFlags = getAllFlags;
exports.createFlag = createFlag;
exports.editFlag = editFlag;
exports.deleteFlag = deleteFlag;
exports.getFlag = getFlag;
exports.setFlagsOnReq = setFlagsOnReq;
exports.sendFlagsWebhook = sendFlagsWebhook;
