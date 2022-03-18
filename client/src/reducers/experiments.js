export default function experiments(state = [], action) {
  switch (action.type) {
    case "FETCH_EXPERIMENTS_SUCCESS": {
      return [...action.experiments];
    }
    case "CREATE_EXPERIMENT_SUCCESS": {
      return [action.newExpt, ...state];
    }
    case "EDIT_EXPERIMENT_SUCCESS": {
      let newState = [...state];
      const indexOfEdited = newState.findIndex((expt) => (
        expt.id === action.editedExpt.id
      ));
      const exposures = newState[indexOfEdited].exposures;
      newState[indexOfEdited] = action.editedExpt;
      newState[indexOfEdited].exposures = exposures;

      return newState;
    }
    default: {
      return state;
    }
  }
}
