export default function flags(state = [], action) {
  switch (action.type) {
    case "FETCH_FLAGS_SUCCESS": {
      return action.flags;
    }
    case "CREATE_FLAG_SUCCESS": {
      return state;
    }
    case "EDIT_FLAG_SUCCESS": {
      return state;
    }
    default: {
      return state;
    }
  }
}