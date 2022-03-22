const PGTable = require("../db/PGTable");
const { CA_TABLE_NAME } = require("../constants/db");

const cAssignmentTable = new PGTable(CA_TABLE_NAME);
cAssignmentTable.init();

// transformAssignmentData
// receives array like: (this is for one flag, but works if there's more than one flag too)
// [
//    { id: 2, user_id: 'abcdefg010', flag_id: 1, status: true },
//    { id: 3, user_id: 'a098vuj', flag_id: 1, status: false },
//    { id: 4, user_id: '12345', flag_id: 1, status: true }
// ]
// outputs object like:
// { '1': { '12345': true, abcdefg010: true, a098vuj: false } }

const transformAssignmentData = (assignmentsArr) => {
  const obj = {};
  assignmentsArr.forEach(a => {
    if (!obj[a.flag_id]) {
      obj[a.flag_id] = {};
    }
    obj[a.flag_id][a.user_id] = a.status
  });
  return obj;
}

const fetchAssignmentsOnFlag = async (req, res, next) => {
  const flagId = req.params.id;
  try {
    const result = await cAssignmentTable.getRowsWhere({ flag_id: flagId });
    const assignments = transformAssignmentData(result);
    res.status(200).send(assignments);
  } catch (e) {
    res.status(500).send("Error fetching custom assignment data")
  }
}

const setAssignmentsOnEachFlag = async (req, res, next) => {
  try {
    const result = await cAssignmentTable.getAllRows();
    const assignments = transformAssignmentData(result);

    req.flags.forEach(flag => {
      flag.custom_assignments = assignments[flag.id];
      delete flag.id;
    });

    next();
  } catch (e) {
    res.status(500).send("Error fetching custom assignment data")
  }
}

const createAssignments = async (req, res, next) => {
  const flagId = req.params.id;
}

const deleteAssignments = async (req, res, next) => {
  const id = req.params.id;
}

exports.fetchAssignmentsOnFlag = fetchAssignmentsOnFlag;
exports.createAssignments = createAssignments;
exports.deleteAssignments = deleteAssignments;
exports.setAssignmentsOnEachFlag = setAssignmentsOnEachFlag;
