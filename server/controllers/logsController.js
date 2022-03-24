const PGTable = require("../db/PGTable");
const { FLAG_EVENTS_TABLE_NAME } = require("../constants/db");
const { getNowString } = require("../utils");

const flagEventsTable = new PGTable(FLAG_EVENTS_TABLE_NAME);
flagEventsTable.init();

const GET_LOGS_QUERY = `
  SELECT fe.*,
    f.name AS flag_name
  FROM flag_events fe
  JOIN flags f
    ON fe.flag_id = f.id
  ORDER BY fe.timestamp DESC
`;

const logEvent = async (req, res, next) => {
  try {
    const event = {
      flag_id: req.params.id || req.flagId,
      event_type: req.eventType,
      timestamp: getNowString(),
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
    const result = await flagEventsTable.query(GET_LOGS_QUERY);
    res.status(200).send(result.rows);
  } catch (err) {
    console.log(err.message);
    res.status(500);
  }
};

exports.logEvent = logEvent;
exports.getLog = getLog;
