import apiClient from '../lib/ApiClient';

export function fetchFlags() {
  return function(dispatch) {
    apiClient.getFlags(data => dispatch(fetchFlagsSuccess(data)));
  }
}

export function fetchFlagsSuccess(flags) {
  return { type: "FETCH_FLAGS_SUCCESS", flags };
}

export function toggleFlag(id, status) {
  return function(dispatch) {
    apiClient.toggleFlag(id, status, data => {
      dispatch(toggleFlagSuccess(data));
    });
  }
}

export function toggleFlagSuccess(flag) {
  return { type: "TOGGLE_FLAG_SUCCESS", flag };
}

export function deleteFlag(id) {
  return function(dispatch) {
    apiClient.deleteFlag(id, () => {
      dispatch(deleteFlagSuccess(id));
    })
  }
};

export function deleteFlagSuccess(id) {
  return { type: "DELETE_FLAG_SUCCESS", id: id };
}