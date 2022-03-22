import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDatabase } from "@fortawesome/free-solid-svg-icons";
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
      <div className="inline-block relative">
        <button
          className={`btn peer w-60 text-lg border border-primary-offwhite ${dbName === "" ? "after:content-['Not_Connected'] hover:after:content-['Connect']" : "after:content-['Connected'] hover:after:content-['Disconnect']"} hover:text-primary-turquoise hover:border-primary-turquoise`}
          type="button"
          onClick={handleClick}
        >
          <FontAwesomeIcon icon={faDatabase} className="mr-2" />
        </button>

      </div>
    </div>
  );
};

export default DatabaseConnection;
