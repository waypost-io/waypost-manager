export default function experiments(state = [], action) {
  switch (action.type) {
    case "FETCH_EXPERIMENTS_SUCCESS": {
      return action.experiments;
    }
    case "CREATE_EXPERIMENT_SUCCESS": {
      return [...state, action.newExpt];
    }
    default: {
      return state;
    }
  }
}
