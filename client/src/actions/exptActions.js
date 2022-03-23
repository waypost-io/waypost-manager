import apiClient from '../lib/ApiClient';

export function fetchExperiments(flagId) {
  return function(dispatch) {
    apiClient.fetchExperiments(flagId, data => dispatch(fetchExperimentsSuccess(data)))
  }
}

export function fetchExperimentsSuccess(experiments) {
  return { type: "FETCH_EXPERIMENTS_SUCCESS", experiments };
}

export function createExperiment(exptObj) {
  return function(dispatch) {
    apiClient.createExperiment(exptObj, data => {
      dispatch(createExperimentSuccess(data))
    });
  }
}

export function createExperimentSuccess(newExpt) {
  return { type: "CREATE_EXPERIMENT_SUCCESS", newExpt };
}

export function editExperiment(exptId, updatedFields) {
  return function(dispatch) {
    return apiClient.editExperiment(exptId, updatedFields, data => {
      dispatch(updateStatsSuccess(data.stats));
      dispatch(editExperimentSuccess(data.updatedExpt));
      return "Not connected to database, please connect and then try again for up to date results."
      // return data.error_message
    });
  }
}

export function editExperimentSuccess(editedExpt) {
  return { type: "EDIT_EXPERIMENT_SUCCESS", editedExpt };
}

export function updateStats(id) {
  return function(dispatch) {
    apiClient.updateStats(id, data => {
      dispatch(updateStatsSuccess(data));
    });
  }
}

export function updateStatsSuccess(metrics) {
  return { type: "UPDATE_STATS_SUCCESS", metrics };
}
