import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { connectDB } from "../../actions/dbActions";

const LABEL_CSS = "inline-block w-1/3 text-right mr-5";
const INPUT_ELEM_CSS = "border border-slate rounded-lg p-2";

const DBModal = ({ modalOpen, setModalOpen }) => {
  const dispatch = useDispatch();
  const [user, setUser] = useState("");
  const [host, setHost] = useState("");
  const [password, setPassword] = useState("");
  const [database, setDatabase] = useState("");
  const [port, setPort] = useState("");
  const [query, setQuery] = useState("");

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const validateForm = (dbObj) => {
    let errMessage = "";
    if (Object.values(dbObj).some((val) => val === "")) {
      return "All fields must be filled in.";
    }

    if (!/^[a-z\d.-]+$/i.test(dbObj.pg_host)) {
      errMessage += "-Invalid host name.\n";
    }

    const port = Number(dbObj.pg_port);
    if (
      Number.isNaN(port) ||
      port < 0 ||
      port > 65535 ||
      port !== Math.floor(port)
    ) {
      errMessage +=
        "-Invalid port number. Must be an integer between 0 and 65535.\n";
    }

    if (dbObj.expt_table_query[dbObj.expt_table_query.length - 1] === ";") {
      errMessage += "-Semicolons not allowed, please remove and try again.\n";
    }
    return errMessage;
  };

  const resetForm = () => {
    setModalOpen(false);
    setUser("");
    setHost("");
    setPassword("");
    setDatabase("");
    setPort("");
    setQuery("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setQuery(query.trim());
    const dbObj = {
      pg_user: user,
      pg_host: host,
      pg_password: password,
      pg_database: database,
      pg_port: port,
      expt_table_query: query,
    };
    const errMessage = validateForm(dbObj);
    if (errMessage.length > 0) {
      alert(errMessage);
      return;
    }

    let success = await dispatch(connectDB(dbObj));

    if (success) resetForm();
  };

  return (
    <div className={`overlay ${modalOpen ? "" : "hidden"}`}>
      <div className="db-modal flex flex-col items-center bg-primary-offwhite relative rounded-xl mx-auto my-12 p-5">
        <i className="x-icon icon close-modal" onClick={handleCloseModal}></i>
        <h2 className="font-bold text-xl text-primary-violet m-5">
          Database Connection
        </h2>
        <form className="database-form">
          <div className="mt-2.5">
            <label htmlFor="user" className={LABEL_CSS}>
              Username:{" "}
            </label>
            <input
              id="user"
              type="text"
              className={INPUT_ELEM_CSS}
              value={user}
              onChange={(e) => setUser(e.target.value)}
            />
          </div>
          <div className="mt-2.5">
            <label htmlFor="host" className={LABEL_CSS}>
              Host:{" "}
            </label>
            <input
              id="host"
              type="text"
              className={INPUT_ELEM_CSS}
              value={host}
              onChange={(e) => setHost(e.target.value)}
            />
          </div>
          <div className="mt-2.5">
            <label htmlFor="password" className={LABEL_CSS}>
              Password:{" "}
            </label>
            <input
              id="password"
              type="password"
              className={INPUT_ELEM_CSS}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mt-2.5">
            <label htmlFor="database" className={LABEL_CSS}>
              Database:{" "}
            </label>
            <input
              id="database"
              type="text"
              className={INPUT_ELEM_CSS}
              value={database}
              onChange={(e) => setDatabase(e.target.value)}
            />
          </div>
          <div className="mt-2.5">
            <label htmlFor="port" className={LABEL_CSS}>
              Port:{" "}
            </label>
            <input
              id="port"
              type="text"
              className={INPUT_ELEM_CSS}
              value={port}
              onChange={(e) => setPort(e.target.value)}
            />
          </div>
          <div className="mt-2.5 flex items-center">
            <label htmlFor="query" className={LABEL_CSS}>
              <p>Query to retrieve experiment data:</p>
              <p className="text-sm italic">
                Do not include semicolon. Query should result in{" "}
                <code>experiment_id</code>, <code>user_id</code>,{" "}
                <code>timestamp</code>, and <code>treatment</code> columns
              </p>
            </label>
            <textarea
              id="query"
              rows={6}
              cols={35}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border border-slate rounded-lg p-2"
            />
          </div>
        </form>
        <button
          type="submit"
          className="btn bg-primary-violet hover:bg-primaryDark-violet my-4"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default DBModal;
