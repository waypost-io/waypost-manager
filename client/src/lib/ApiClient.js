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
  toggleExperiment: function(id, status, callback) {
    return axios
      .put(`/api/flags/${id}`, { is_experiment: status })
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
  }
};

export default apiClient;