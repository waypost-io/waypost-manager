export default function experiments(state = [], action) {
  switch (action.type) {
    case "FETCH_EXPERIMENTS_SUCCESS": {
      return action.experiments;
    }
    default: {
      return state;
    }
  }
}