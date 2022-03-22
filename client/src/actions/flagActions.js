import apiClient from '../lib/ApiClient';

export function fetchFlags() {
  return function(dispatch) {
    apiClient.getFlags(data => dispatch(fetchFlagsSuccess(data)));
  }
}

export function fetchFlagsSuccess(flags) {
  return { type: "FETCH_FLAGS_SUCCESS", flags };
}

export function fetchFlag(id) {
  return function(dispatch) {
    apiClient.getFlag(id, data => dispatch(fetchFlagSuccess(data)));
  }
}

export function fetchFlagSuccess(flag) {
  return { type: "FETCH_FLAG_SUCCESS", flag };
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

export function createFlag(name, description, status, percentage_split) {
  return function(dispatch) {
    apiClient.createFlag({ name, description, status, percentage_split }, (data) => {
      dispatch(createFlagSuccess(data));
    })
  }
}

export function createFlagSuccess(flag) {
  return { type: "CREATE_FLAG_SUCCESS", flag };
}

export function editFlag(id, updatedFields) {
  return function(dispatch) {
    apiClient.editFlag(id, updatedFields, (data) => {
      dispatch(editFlagSuccess(data));
    });
  }
}

export function editFlagSuccess(flag) {
  return { type: "EDIT_FLAG_SUCCESS", flag };
}
