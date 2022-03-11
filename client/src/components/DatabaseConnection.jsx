import React from 'react';
import apiClient from "../lib/ApiClient";

const DatabaseConnection = ({ dbName, setDbName, setDbModalOpen }) => {

  const removeDBConnection = async (e) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to disconnect?")) {
      await apiClient.removeDBConnection(() => {
        setDbName("");
      })
    }
  }

  return (
    <div className="database-connection">
      <label htmlFor="database-connection">
        {dbName === "" ? "Not Connected " : `Currently connected to ${dbName} `}
      </label>
      {dbName === "" ?
        <button className="btn bg-primary-turquoise" type="button" onClick={() => setDbModalOpen(true)}>
          Connect to Database
        </button>
        :
        <button className="btn bg-primary-turquoise" type="button" onClick={removeDBConnection}>
          Disconnect
        </button>
      }
    </div>
  )
}

export default DatabaseConnection;
