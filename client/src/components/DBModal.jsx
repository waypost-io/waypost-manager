import React, { useState } from 'react';
import { useDispatch } from "react-redux";
import { connectDB } from '../actions/dbActions';

const DBModal = ({ modalOpen, setModalOpen, setDbName }) => {
  const dispatch = useDispatch();
  const [user, setUser] = useState("");
  const [host, setHost] = useState("");
  const [password, setPassword] = useState("");
  const [database, setDatabase] = useState("");
  const [port, setPort] = useState("");

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const validateForm = (dbObj) => {
    if (Object.values(dbObj).some(val => val === "")) {
      return "All fields must be filled in."
    }

    if (!/^[a-z\d.-]+$/i.test(dbObj.host)) {
      return "Invalid host name";
    }

    const port = Number(dbObj.port);
    if (Number.isNaN(port) || port < 0 || port > 65535 || port !== Math.floor(port)) {
      return "Invalid port number. Must be an integer between 0 and 65535"
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
      return;
    }

    dispatch(connectDB(dbObj));
    resetForm();
  }

  return (
    <div className={`overlay ${modalOpen ? "" : "hidden"}`}>
      <div className="new-flag-modal">
        <i className="x-icon icon close-modal" onClick={handleCloseModal}></i>
        <h2 className="font-bold text-xl text-primary-violet">Database Connection</h2>
        <form className="database-form">
          <div className="mt-2.5">
            <label htmlFor="user" className="mr-5">Username: </label>
            <input id="user" type="text" className="border border-primary-oxfordblue rounded-lg px-2" value={user} onChange={(e) => setUser(e.target.value)} />
          </div>
          <div className="mt-2.5">
            <label htmlFor="host" className="mr-5">Host: </label>
            <input id="host" type="text" className="border border-primary-oxfordblue rounded-lg px-2" value={host} onChange={(e) => setHost(e.target.value)} />
          </div>
          <div className="mt-2.5">
            <label htmlFor="password" className="mr-5">Password: </label>
            <input id="password" type="text" className="border border-primary-oxfordblue rounded-lg px-2" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="mt-2.5">
            <label htmlFor="database" className="mr-5">Database: </label>
            <input id="database" type="text" className="border border-primary-oxfordblue rounded-lg px-2" value={database} onChange={(e) => setDatabase(e.target.value)} />
          </div>
          <div className="mt-2.5">
            <label htmlFor="port" className="mr-5">Port: </label>
            <input id="port" type="text" className="border border-primary-oxfordblue rounded-lg px-2" value={port} onChange={(e) => setPort(e.target.value)} />
          </div>
          <button type="submit" className="btn bg-primary-violet" onClick={handleSubmit}>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default DBModal;
