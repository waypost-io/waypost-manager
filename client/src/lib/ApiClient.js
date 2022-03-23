import axios from "axios";

function logError(errorResponse) {
  const response = errorResponse.response;

  if (response && response.data && response.data.error) {
    // eslint-disable-next-line no-console
    console.error(`HTTP Error: ${response.data.error}`);
  } else {
    // eslint-disable-next-line no-console
    console.error("Error: ", errorResponse);
  }
}

function unwrapData(response) {
  return response.data;
}

axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
axios.defaults.headers.common["Accept"] = "application/json";

const apiClient = {
  getFlags: function (callback) {
    return axios
      .get('/api/flags')
      .then(unwrapData)
      .then(callback)
      .catch(logError);
  },
  getFlag: function(id, callback) {
    return axios
      .get(`/api/flags/${id}`)
      .then(unwrapData)
      .then(callback)
      .catch(logError);
  },
  toggleFlag: function(id, status, callback) {
    return axios
      .put(`/api/flags/${id}`, { status })
      .then(unwrapData)
      .then(callback)
      .catch(logError);
  },
  deleteFlag: function(id, callback) {
    return axios
      .delete(`/api/flags/${id}`)
      .then(unwrapData)
      .then(callback)
      .catch(logError);
  },
  createFlag: function(flagObj, callback) {
    return axios
      .post('/api/flags', flagObj)
      .then(unwrapData)
      .then(callback)
      .catch(logError);
  },
  editFlag: function(id, updatedFields, callback) {
    return axios
      .put(`/api/flags/${id}`, updatedFields)
      .then(unwrapData)
      .then(callback)
      .catch(logError);
  },
  getExperiments: function(id, callback) {
    return axios
      .get(`/api/experiments/${id}`)
      .then(unwrapData)
      .then(callback)
      .catch(logError);
  },
  getMetrics: function(callback) {
    return axios
      .get('/api/metrics')
      .then(unwrapData)
      .then(callback)
      .catch(logError);
  },
  createMetric: function(metricObj, callback) {
    return axios
      .post('/api/metrics', metricObj)
      .then(unwrapData)
      .then(callback)
      .catch(logError);
  },
  editMetric: function(id, updatedFields, callback) {
    return axios
      .put(`/api/metrics/${id}`, updatedFields)
      .then(unwrapData)
      .then(callback)
      .catch(logError);
  },
  deleteMetric: function(id, callback) {
    return axios
      .delete(`/api/metrics/${id}`)
      .then(unwrapData)
      .then(callback)
      .catch(logError);
  },
  connectToDB: function(dbObj, callback) {
    return axios
      .post('/api/connection', dbObj)
      .then(unwrapData)
      .then(callback)
      .catch(logError)
  },
  removeDBConnection: function(callback) {
    return axios
      .delete('/api/connection')
      .then(unwrapData)
      .then(callback)
      .catch(logError)
  },
  checkDBConnection: function(callback) {
    return axios
      .get('/api/connection')
      .then(unwrapData)
      .then(callback)
      .catch(logError)
  },
  createExperiment: function(obj, callback) {
    return axios
      .post('/api/experiments', obj)
      .then(unwrapData)
      .then(callback)
      .catch(logError)
  },
  editExperiment: function(id, obj, callback) {
    return axios
      .put(`/api/experiments/${id}`, obj)
      .then(unwrapData)
      .then(callback)
      .catch(logError)
  },
  getExperiment: function(id, callback) {
    return axios
      .get(`/api/experiments/${id}`)
      .then(unwrapData)
      .then(callback)
      .catch(logError)
  },
  fetchExperiments: function(flagId, callback) {
    return axios
      .get(`/api/flags/${flagId}/experiments`)
      .then(unwrapData)
      .then(callback)
      .catch(logError)
  },
  fetchSdkKey: function(callback) {
    return axios
      .get('api/sdkKey')
      .then(unwrapData)
      .then(callback)
      .catch(logError)
  },
  createSdkKey: function(callback) {
    return axios
      .post('api/sdkKey')
      .then(unwrapData)
      .then(callback)
      .catch(logError)
  },
  updateStats: function(exptId, callback) {
    return axios
      .put(`/api/experiments/${exptId}/analysis`)
      .then(unwrapData)
      .then(callback)
      .catch(logError)
  },
  fetchLog: function(callback) {
    return axios
      .get('/api/log')
      .then(unwrapData)
      .then(callback)
      .catch(logError)
  },
  fetchAllAssignments: function(callback) {
    return axios
      .get('/api/custom-assignments')
      .then(unwrapData)
      .then(callback)
      .catch(logError)
  },
  fetchAssignmentsOnFlag: function(id, callback) {
    return axios
      .get(`/api/flags/${id}/custom-assignments`)
      .then(unwrapData)
      .then(callback)
      .catch(logError)
  },
  createAssignmentsOnFlag: function(flagId, newAssignments, callback) {
    return axios
      .post(`/api/flags/${flagId}/custom-assignments`, newAssignments)
      .then(unwrapData)
      .then(callback)
      .catch(logError)
  },
  deleteAssignmentsOnFlag: function(flagId, userIds, callback) {
    return axios
      .delete(`/api/flags/${flagId}/custom-assignments`, {data: userIds})
      .then(unwrapData)
      .then(callback)
      .catch(logError)
  }
};

export default apiClient;
