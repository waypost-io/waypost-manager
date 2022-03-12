export default function dbName(state = '', action) {
  switch (action.type) {
    case "DB_CONNECTED": {
      return action.name;
    }
    case "DB_DISCONNECTED": {
      return "";
    }
    default: {
      return state;
    }
  }
}