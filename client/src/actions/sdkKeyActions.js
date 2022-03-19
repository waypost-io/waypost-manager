import apiClient from '../lib/ApiClient';

export function createSdkKey() {
  return function(dispatch) {
    apiClient.createSdkKey((key) => dispatch(createSdkKeySuccess(key)));
  }
}

export function createSdkKeySuccess(key) {
  return { type: "KEY_CREATED_SUCCESS", key }
}

export function fetchSdkKey() {
  return function(dispatch) {
    apiClient.fetchSdkKey((key) => {
      if (key) {
        dispatch(fetchKeySuccess(key));
      } else {
        dispatch(noExistingKey());
      }
    });
  }
}

export function fetchKeySuccess(key) {
  return { type: "KEY_FETCHED_SUCCESS", key }
}

export function noExistingKey() {
  return { type: "NO_EXISTING_KEY" }
}
