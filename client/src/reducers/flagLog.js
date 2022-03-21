export default function flagLog(state = [], action) {
  switch (action.type) {
    case "LOG_FETCHED_SUCCESS": {
      return action.data;
    }
    default: {
      return state;
    }
  }
}
