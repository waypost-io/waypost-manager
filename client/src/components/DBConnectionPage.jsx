import React, { useState, useEffect } from 'react';
import DBConnectionForm from "./DBConnectionForm"
import apiClient from "../lib/ApiClient";

const DBConnectionPage = () => {
  const [dbDetails, setDbDetails] = useState({ database: "PostgreSQL1"});

  const removeDBConnection = async (e) => {
    e.preventDefault();
    await apiClient.removeDBConnection(() => {
      setDbDetails({});
    })
    // console.log("Connection removed");
  }

  useEffect(() => {
    // connect to DB here if we already have credentials?
    // option to use saved credentials?
    // how do we get the credentials into the state if it's already in our DB?
    // apiClient.getDBInfo()??
  }, [])

  return (
    <div>
      <h1>Database Connection</h1>
      {dbDetails.database &&
        <p>You are connected to {dbDetails.database}
          <button onClick={removeDBConnection}>Remove Connection</button>
        </p>
      }
      {!dbDetails.database && <DBConnectionForm />}
    </div>
  )
}

export default DBConnectionPage;
