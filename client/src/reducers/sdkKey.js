export default function sdkKey(state = '', action) {
  switch (action.type) {
    case "KEY_FETCHED_SUCCESS": {
      return action.key;
    }
    case "KEY_CREATED_SUCCESS": {
      return action.key;
    }
    case "NO_EXISTING_KEY": {
      return "";
    }
    default: {
      return state;
    }
  }
}
