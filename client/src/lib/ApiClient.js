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

let DUMMY_DATA = [
  { id: 1, title: "Offer Banner", active: true },
  { id: 2, title: "Free Trial", active: true },
  { id: 3, title: "Show Recommendations", active: false }
];

const apiClient = {
  // TEMPORARY FUNCS
  getFlags: function (callback) {
    callback(DUMMY_DATA);
  },
  toggleFlag: function(id, status, callback) {
    callback(DUMMY_DATA);
  },
  deleteFlag: function(id, callback) {
    callback();
  },
  createFlag: function(flagObj, callback) {
    DUMMY_DATA.push({ id: Math.floor(Math.random() * 100), ...flagObj });
    console.log(DUMMY_DATA);
    callback();
  }
  // getFlags: function (callback) {
  //   return axios
  //     .get('/api/flags')
  //     .then(unwrapData)
  //     .then(callback)
  //     .catch(logError);
  // },
  // toggleFlag: function(id, status, callback) {
  //   return axios
  //     .put(`/api/flags/${id}`, { active: status })
  //     .then(unwrapData)
  //     .then(callback)
  //     .catch(logError);
  // },
  // deleteFlag: function(id, callback) {
   //  return axios
  //     .delete(`/api/flags/${id}`)
  //     .then(unwrapData)
  //     .then(callback)
  //     .catch(logError);
  // },
  // createFlag: function(flagObj, callback) {
  //   return axios
  //     .post('/api/flags')
  //     .then(unwrapData)
  //     .then(callback)
  //     .catch(logError);
  // }
};

export default apiClient;