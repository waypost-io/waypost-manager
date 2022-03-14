export default function experiments(state = [], action) {
  switch (action.type) {
    case "FETCH_EXPERIMENTS_SUCCESS": {
      console.log(action.experiments);
      return action.experiments;
    }
    default: {
      return state;
    }
  }
}