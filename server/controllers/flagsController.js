const PGTable = require("../db/PGTable");
const { FLAG_TABLE_NAME } = require("../constants/db");
const { getNowString } = require("../utils");
const { sendWebhook } = require("../lib/sendWebhook.js");

const flagTable = new PGTable(FLAG_TABLE_NAME);
flagTable.init();

const GET_FLAGS_FOR_WEBHOOK = `
  SELECT id, name, status, percentage_split, hash_offset, is_experiment
  FROM flags
  WHERE is_deleted = FALSE
`;

const createNewFlagObj = ({
  name,
  description,
  percentage_split,
  status,
  is_experiment,
}) => {
  const hash_offset = Math.floor(Math.random() * 100);
  const now = getNowString();
  return {
    name: name,
    description: description || "",
    percentage_split: percentage_split || 100,
    status: status || false,
    is_experiment: is_experiment || false,
    date_created: now,
    is_deleted: false,
    hash_offset,
  };
};

const getFlagsForWebhook = async () => {
  const result = await flagTable.query(GET_FLAGS_FOR_WEBHOOK);
  return result.rows[0] === undefined ? [] : result.rows;
}

const getAllFlags = async (req, res, next) => {
  if (req.query.prov) {
    next();
    return;
  }

  try {
    const data = await flagTable.getAllRowsNotDeleted();

    if (!data) {
      throw new Error(
        `Data could not be retreived from the ${flagTable.tableName} table`
      );
    }

    res.status(200).send(data);
  } catch (e) {
    res.status(500).send(e.message);
  }
};

const sendFlagsOnReq = (req, res, next) => {
  res.status(200).send(req.flags);
}

const setFlagsOnReq = async (req, res, next) => {
  const data = await getFlagsForWebhook()
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
  const newFlag = createNewFlagObj(req.body);

  try {
    const savedFlag = await flagTable.insertRow(newFlag);

    req.eventType = "FLAG_CREATED";
    req.flagId = savedFlag.id;

    res.status(200).send(savedFlag);
    next();
  } catch (e) {
    res.status(500).send("Error inserting into flags table");
  }
};

const editFlag = async (req, res, next) => {
  const id = req.params.id;
  const now = getNowString();
  const updatedFields = req.body;
  if (Object.keys(updatedFields).includes("status")) {
    req.eventType = "FLAG_TOGGLED";
  } else {
    req.eventType = "FLAG_EDITED";
  }

  try {
    const updatedFlag = await flagTable.editRow(updatedFields, { id });

    res.status(200).send(updatedFlag);
    next();
  } catch (e) {
    res.status(500).send(e);
  }
};

const deleteFlag = async (req, res, next) => {
  const id = req.params.id;

  try {
    const result = await flagTable.editRow({ is_deleted: true }, { id });

    if (!result) throw new Error(`Flag with the id of ${id} doesn't exist`);

    const deletedFlagName = result.name;
    req.eventType = "FLAG_DELETED";

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
    await sendWebhook("/flags", req.flags);
    console.log("flag webhook sent");
  } catch (err) {
    console.log(err.message);
  }
  if (req.query.prov) return;
  next();
};

exports.getAllFlags = getAllFlags;
exports.createFlag = createFlag;
exports.editFlag = editFlag;
exports.deleteFlag = deleteFlag;
exports.getFlag = getFlag;
exports.setFlagsOnReq = setFlagsOnReq;
exports.sendFlagsWebhook = sendFlagsWebhook;
exports.sendFlagsOnReq = sendFlagsOnReq;
