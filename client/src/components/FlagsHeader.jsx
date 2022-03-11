import React from 'react';
import apiClient from "../lib/ApiClient";

const FlagsHeader = ({ dbName, setDbName, setDbModalOpen, setFlagModalOpen }) => {
  const removeDBConnection = async (e) => {
    e.preventDefault();
    alert("Are you sure you want to disconnect?");
    await apiClient.removeDBConnection(() => {
      setDbName("");
    })
  }

  return (
    <div className="flags-list-header">
      <h2>Feature Flags</h2>
      <img src="assets/purple_white_logo.jpg" alt="Waypost" height="100px"/>
      <div className="dropdown-wrapper">
        <label htmlFor="dropdown">
          {dbName === "" ? "Not Connected " : `Currently connected to ${dbName} `}
        </label>
        {dbName === "" ?
          <button className="btn" type="button" onClick={() => setDbModalOpen(true)}>
            Connect to Database
          </button>
          :
          <button className="btn" type="button" onClick={removeDBConnection}>
            Remove Connection
          </button>
        }
      </div>
      <button
        className="btn"
        type="button"
        onClick={() => setFlagModalOpen(true)}
      >
        Create New
      </button>
    </div>
  )
}

export default FlagsHeader;
