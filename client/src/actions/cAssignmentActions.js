import apiClient from '../lib/ApiClient';

export function addAssignmentsToFlag(flagId, newAssignments) {
  return function(dispatch) {
    apiClient.createAssignmentsOnFlag(flagId, newAssignments, (data) => {
      dipatch(addAssignmentsSuccess(data));
    })
  }
}

export function addAssignmentsSuccess(newAssignments) {
  return { type: "CREATED_ASSIGNMENTS_SUCCESS", newAssignments }
}

export function fetchAssignmentsOnFlag(flagId) {
  return function(dispatch) {
    apiClient.fetchAssignmentsOnFlag(flagId, (data) => {
      dispatch(fetchAssignmentsOnFlagSuccess(data))
    })
  }
}

export function fetchAssignmentsOnFlagSuccess(assignments) {
  return { type: "FETCHED_ASSIGNMENTS_ON_FLAG_SUCCESS", assignments }
}

export function fetchAllAssignments() {
  return function(dispatch) {
    apiClient.fetchAllAssignments((data) => {
      dispatch(fetchAllAssignmentsSuccess(data));
    })
  }
}

export function fetchAllAssignmentsSuccess(allAssignments) {
  return { type: "FETCHED_ALL_ASSIGNMENTS_SUCCESS", allAssignments }
}

export function deleteAssignmentsOnFlag(flagId, userIds) {
  return function(dispatch) {
    apiClient.deleteAssignmentsOnFlag(id, userIds, (data) => {
      dispatch(deleteAssignmentsOnFlagSuccess(data.flag_id, data.user_ids))
    })
  }
}

export function deleteAssignmentsOnFlagSuccess(flagId, userIds) {
  return { type: "FETCHED_ALL_ASSIGNMENTS_SUCCESS", flagId, userIds }
}
