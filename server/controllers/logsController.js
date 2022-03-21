const PGTable = require("../db/PGTable");
const { FLAG_EVENTS_TABLE_NAME } = require("../constants/db");

const flagEventsTable = new PGTable(FLAG_EVENTS_TABLE_NAME);
flagEventsTable.init();

const logEvent = async (req, res, next) => {
  try {
    const event = {
      flag_id: req.params.id || req.flagId,
      event_type: req.eventType,
      timestamp: getNowString()
    };
    const savedEvent = await flagEventsTable.insertRow(event);
    res.status(200);
  } catch (err) {
    console.log(err.message);
    res.status(500);
  }
};

const getLog = async (req, res, next) => {
  try {
    const logData = await flagEventsTable.getAllRows();
    const sortedLog = logData.sort((a, b) => b.timestamp - a.timestamp);
    res.status(200).send(sortedLog);
  } catch (err) {
    console.log(err.message);
    res.status(500);
  }
};


exports.logEvent = logEvent;
exports.getLog = getLog;