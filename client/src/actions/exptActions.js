import apiClient from '../lib/ApiClient';

export function fetchExperiments(flagId) {
  return function(dispatch) {
    apiClient.getExperiments(flagId, data => dispatch(fetchExperimentsSuccess(data)))
  }
}

export function fetchExperimentsSuccess(experiments) {
  return { type: "FETCH_EXPERIMENTS_SUCCESS", experiments };
}

export function createExperiment(exptObj) {
  return function(dispatch) {
    apiClient.createExperiment(exptObj, data => dispatch(createExperimentSuccess(data)));
  }
}

export function createExperimentSuccess(newExpt) {
  return { type: "CREATE_EXPERIMENT_SUCCESS", newExpt };
}
