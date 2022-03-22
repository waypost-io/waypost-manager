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

const fetchAllAssignments = async (req, res, next) => {
  try {
    const result = await cAssignmentTable.getAllRows();
    res.status(200).send(transformAssignmentData(result));
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

// receives { user123: true, user234: false, etc.}
const createAssignmentsOnFlag = async (req, res, next) => {
  const flagId = req.params.id;
  const newAssignments = req.body;
  const insertRows = [];

  Object.keys(newAssignments).forEach((key) => {
    const obj = { user_id: key, status: newAssignments[key], flag_id: flagId };
    insertRows.push(new Promise((resolve, reject) => {
      resolve(cAssignmentTable.insertRow(obj));
    }));
  });

  try {
    const results = await Promise.all(insertRows)
    res.status(200).send(transformAssignmentData(results));
  } catch (e) {
    res.status(500).send("Error inserting new assignments.")
  }
}
// receives an array of userIds: ["user1", "12345", "user2020"]
const deleteAssignmentsOnFlag = async (req, res, next) => {
  const flagId = req.params.id;
  const usersToDeleteOnFlag = req.body;
  const deleteRows = [];

  usersToDeleteOnFlag.forEach((userId) => {
    const obj = { user_id: userId, flag_id: flagId };
    deleteRows.push(new Promise((resolve, reject) => {
      resolve(cAssignmentTable.deleteRow(obj));
    }));
  });

  try {
    await Promise.all(deleteRows);
    res.status(200).send({ flag_id: flagId, userIds });
  } catch (e) {
    res.status(500).send(`Error deleting users ${usersToDeleteOnFlag} on flagId: ${flagId}`);
  }
}

exports.fetchAssignmentsOnFlag = fetchAssignmentsOnFlag;
exports.fetchAllAssignments = fetchAllAssignments;
exports.createAssignmentsOnFlag = createAssignmentsOnFlag;
exports.deleteAssignmentsOnFlag = deleteAssignmentsOnFlag;
exports.setAssignmentsOnEachFlag = setAssignmentsOnEachFlag;
