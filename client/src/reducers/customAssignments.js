export default function customAssignments(state = {}, action) {
  switch (action.type) {
    case "FETCHED_ALL_ASSIGNMENTS_SUCCESS": {
      return action.allAssignments;
    }
    case "FETCHED_ASSIGNMENTS_ON_FLAG_SUCCESS": {
      const newState = JSON.parse(JSON.stringify(state));
      newState[action.flagId] = action.assignments[action.flagId];
      return newState;
    }
    case "DELETED_ASSIGNMENTS_ON_FLAG_SUCCESS": {
      const newState = JSON.parse(JSON.stringify(state));
      const oldAssignmentsOnFlag = newState[action.flagId];
      const newAssignmentsOnFlag = {};
      Object.keys(oldAssignmentsOnFlag).forEach((userId) => {
        if (!action.userIds.includes(userId)) {
          newAssignmentsOnFlag[userId] = oldAssignmentsOnFlag[userId];
        }
      })
      newState[action.flagId] = newAssignmentsOnFlag;
      return newState;
    }
    case "CREATED_ASSIGNMENTS_SUCCESS": {
      const newState = JSON.parse(JSON.stringify(state));
      Object.keys(action.newAssignments).forEach((flagId) => {
        if (newState[flagId]) {
          Object.assign(newState[flagId], action.newAssignments[flagId]);
        } else {
          newState[flagId] = action.newAssignments[flagId];
        }
      })
      return newState;
    }
    default: {
      return state;
    }
  }
}
