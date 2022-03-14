import apiClient from '../lib/ApiClient';

export function fetchExperiments(flagId) {
  return function(dispatch) {
    apiClient.getExperiments(flagId, data => dispatch(fetchExperimentsSuccess(data)))
  }
}

export function fetchExperimentsSuccess(experiments) {
  return { type: "FETCH_EXPERIMENTS_SUCCESS", experiments };
}