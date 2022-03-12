export default function flags(state = [], action) {
  switch (action.type) {
    case "FETCH_FLAGS_SUCCESS": {
      return action.flags;
    }
    case "TOGGLE_FLAG_SUCCESS": {
      return state.map(flag => {
        if (flag.id === action.flag.id) {
          return action.flag;
        } else {
          return flag;
        }
      });
    }
    case "DELETE_FLAG_SUCCESS": {
      return state.filter((flag) => flag.id !== action.id);
    }
    case "CREATE_FLAG_SUCCESS": {
      return [...state, action.flag];
    }
    case "EDIT_FLAG_SUCCESS": {
      return state;
    }
    default: {
      return state;
    }
  }
}