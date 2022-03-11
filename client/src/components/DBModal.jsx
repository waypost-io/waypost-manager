import React, { useState } from 'react';
import apiClient from '../lib/ApiClient';

const DBModal = ({ modalOpen, setModalOpen, setDbName }) => {
  const [user, setUser] = useState("");
  const [host, setHost] = useState("");
  const [password, setPassword] = useState("");
  const [database, setDatabase] = useState("");
  const [port, setPort] = useState("");

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const validateForm = (dbObj) => {
    Object.keys(dbObj).forEach((key) => {
      if (dbObj[key].trim() === "") {
        return "All fields must be filled in."
      }
    })

    if (!dbObj.host.test(/^[a-z\d.-]+$/i)) {
      return "Invalid host name";
    }

    if (Number(dbObj.port) < 0 || Number(dbObj.port) > 65535) {
      return "Invalid port number. Must be a number between 0 and 65535"
    }
  }

  const resetForm = () => {
    setModalOpen(false);
    setUser("")
    setHost("")
    setPassword("")
    setDatabase("")
    setPort("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dbObj = { user, host, password, database, port };
    const invalidPropMessage = validateForm(dbObj);
    if (invalidPropMessage) {
      alert(invalidPropMessage);
      return
    }

    apiClient.connectToDB(dbObj, () => {
      setDbName(database);
      resetForm();
    })
  }

  return (
    <div className={`overlay ${modalOpen ? "" : "hidden"}`}>
      <div className="new-flag-modal">
        <i className="x-icon icon close-modal" onClick={handleCloseModal}></i>
        <h2>Database Connection</h2>
        <form className="database-form">
          <div>
            <label htmlFor="user">Username: </label>
            <input id="user" type="text" value={user} onChange={(e) => setUser(e.target.value)} />
          </div>
          <div>
            <label htmlFor="host">Host: </label>
            <input id="host" type="text" value={host} onChange={(e) => setHost(e.target.value)} />
          </div>
          <div>
            <label htmlFor="password">Password: </label>
            <input id="password" type="text" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div>
            <label htmlFor="database">Database: </label>
            <input id="database" type="text" value={database} onChange={(e) => setDatabase(e.target.value)} />
          </div>
          <div>
            <label htmlFor="port">Port: </label>
            <input id="port" type="text" value={port} onChange={(e) => setPort(e.target.value)} />
          </div>
          <button type="submit" className="submit-db-connection" onClick={handleSubmit}>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default DBModal;
