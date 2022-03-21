import apiClient from '../lib/ApiClient';

export function fetchLog() {
  return function(dispatch) {
    apiClient.fetchLog(data =>  dispatch(fetchLogSuccess(data)));
  }
}

export function fetchLogSuccess(data) {
  return { type: "LOG_FETCHED_SUCCESS", data }
}