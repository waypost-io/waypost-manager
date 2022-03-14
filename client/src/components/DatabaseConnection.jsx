import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { disconnectDB } from '../actions/dbActions';

const DatabaseConnection = ({ setDbModalOpen }) => {
  const dispatch = useDispatch();
  const dbName = useSelector(state => state.dbName);

  const removeDBConnection = async (e) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to disconnect?")) {
      dispatch(disconnectDB());
    }
  }

  return (
    <div className="database-connection text-sm">
      <label htmlFor="database-connection">
        {dbName === "" ? "Not Connected " : `Currently connected to ${dbName} `}
      </label>
      {dbName === "" ?
        <button className="bg-primary-turquoise text-primary-offwhite rounded-lg py-2.5 px-6 ml-2" type="button" onClick={() => setDbModalOpen(true)}>
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
