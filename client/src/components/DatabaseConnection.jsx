import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faLockOpen } from "@fortawesome/free-solid-svg-icons";
import { disconnectDB } from "../actions/dbActions";

const DatabaseConnection = ({ setDbModalOpen }) => {
  const dispatch = useDispatch();
  const dbName = useSelector((state) => state.dbName);

  const removeDBConnection = () => {
    if (window.confirm("Are you sure you want to disconnect?")) {
      dispatch(disconnectDB());
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    if (dbName === "") {
      setDbModalOpen(true);
    } else {
      removeDBConnection();
    }
  };

  return (
    <div className="text-sm">
      <span>
        {dbName === ""
          ? "Not connected to your database"
          : `Currently connected to ${dbName} `}
      </span>
      <div className="inline-block relative">
        <button
          className="btn peer text-lg hover:text-primary-violet"
          type="button"
          onClick={handleClick}
        >
          {dbName === "" ? (
            <FontAwesomeIcon icon={faLockOpen} />
          ) : (
            <FontAwesomeIcon icon={faLock} />
          )}
        </button>
        <span className="text-primary-violet font-bold absolute bottom-9 right-px hidden peer-hover:block">
          {dbName === "" ? "Connect" : "Disconnect"}
        </span>
      </div>
    </div>
  );
};

export default DatabaseConnection;
