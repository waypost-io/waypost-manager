import apiClient from '../lib/ApiClient';

export function disconnectDB() {
  return function(dispatch) {
    apiClient.removeDBConnection(() => dispatch(disconnectDBSuccess()));
  }
}

export function disconnectDBSuccess() {
  return { type: "DB_DISCONNECTED" }
}

export function connectDB(dbObj) {
  return function(dispatch) {
    apiClient.connectToDB(dbObj, (data) => {
      if (data.connected) {
        dispatch(connectDBSuccess(dbObj.database));
      } else {
        alert("The connection didn't work, please check your inputs and try again");
      }
    })
  }
}

export function connectDBSuccess(name) {
  return { type: "DB_CONNECTED", name: name }
}

export function checkDBConnection() {
  return function(dispatch) {
    apiClient.checkDBConnection((data) => {
      if (data.connected) {
        dispatch(connectDBSuccess(data.database));
      } else {
        dispatch(disconnectDBSuccess());
      }
    })
  }
}