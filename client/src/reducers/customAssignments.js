export default function customAssignments(state = {}, action) {
  switch (action.type) {
    case "FETCHED_ALL_C_ASSIGNMENTS": {
      return action.allAssignments;
    }
    case "FETCHED_ASSIGNMENTS_ON_FLAG": {
      const newState = JSON.parse(JSON.stringify(state));
      newState[action.flagId] = action.assignments
      return newState;
    }
    case "DELETED_ASSIGNMENTS_ON_FLAG": {
      const newState = JSON.parse(JSON.stringify(state));
      const oldAssignmentsOnFlag = newState[action.flagId];
      const newAssignmentsOnFlag = {};
      Object.keys(oldAssignmentsOnFlag).forEach((userId) => {
        if (!action.deletedAssignments.includes(userId)) {
          newAssignmentsOnFlag[userId] = oldAssignmentsOnFlag[userId];
        }
      })
      newState[action.flagId] = newAssignmentsOnFlag;
      return newState;
    }
    case "CREATED_ASSIGNMENTS_ON_FLAG": {
      const newState = JSON.parse(JSON.stringify(state));
      const assignmentsOnFlag = newState[action.flagId];
      Object.keys(action.newAssignments).forEach((userId) => {
        assignmentsOnFlag[userId] = action.newAssignments[userId];
      });
      return newState;
    }
    default: {
      return state;
    }
  }
}
