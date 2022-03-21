const PGTable = require("../db/PGTable");
const { KEYS_TABLE_NAME } = require("../constants/db");
const { v4: uuidv4 } = require('uuid');
const { sendWebhook } = require("../lib/sendWebhook.js");

const keysTable = new PGTable(KEYS_TABLE_NAME);
keysTable.init();

const createKey = async (req, res, next) => {
  const key = uuidv4();
  try {
    await keysTable.insertRow({ sdk_key: key });
    res.status(200).send(key);
    req.sdk_key = key;
    next();
  } catch (err) {
    res.status(500).send("Error saving new key");
  }

}

const fetchKey = async (req, res, next) => {
  try {
    const result = await keysTable.getAllRows();
    if (result[0]) {
      res.status(200).send(result[0].sdk_key);
    } else {
      res.status(200).send(undefined);
    }
  } catch (err) {
    res.status(500).send("Error connecting to database")
  }
}

const removeKeys = async (req, res, next) => {
  try {
    await keysTable.deleteAllRows();
    next();
  } catch (err) {
    res.status(500).send("Error connecting to database")
  }
}

const sendSdkWebhook = async (req, res, next) => {
  try {
    await sendWebhook("/key", {key: req.sdk_key});
    console.log("SDK key webhook sent");
  } catch (err) {
    console.log("Could not send SDK key webhook");
  }
};

exports.createKey = createKey;
exports.fetchKey = fetchKey;
exports.removeKeys = removeKeys;
exports.sendSdkWebhook = sendSdkWebhook;
