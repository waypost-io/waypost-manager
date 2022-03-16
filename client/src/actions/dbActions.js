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
    return apiClient.connectToDB(dbObj, (data) => {
      if (data.connected && data.ok) {
        dispatch(connectDBSuccess(dbObj.pg_database));
        return true;
      } else  {
        alert(`Adding connection failed: ${data.error_message}`);
        return false;
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
