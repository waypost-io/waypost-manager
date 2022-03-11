import apiClient from '../lib/ApiClient';

export function fetchFlags() {
  return function(dispatch) {
    apiClient.getFlags(data => dispatch(fetchFlagsSuccess(data.flags)));
  }
}

export function fetchFlagsSuccess(flags) {
  return { type: "FETCH_FLAGS_SUCCESS", flags };
}