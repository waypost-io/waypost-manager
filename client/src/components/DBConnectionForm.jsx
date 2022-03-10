import React, { useState } from 'react';
import apiClient from "../lib/ApiClient";

const DBConnectionForm = () => {
  const [user, setUser] = useState("");
  const [host, setHost] = useState("");
  const [password, setPassword] = useState("");
  const [database, setDatabase] = useState("");
  const [port, setPort] = useState("");

  const resetForm = () => {
    setUser("")
    setHost("")
    setPassword("")
    setDatabase("")
    setPort("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    apiClient.connectToDB({ user, host, password, database, port}, () => {
      resetForm();
    })
  }

  return (
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
  )
}

export default DBConnectionForm;
