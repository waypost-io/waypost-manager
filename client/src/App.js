import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import FlagDashboard from './components/FlagDashboard';
import SideNav from './components/SideNav';
import FlagDetailsPage from './components/FlagDetailsPage';
import Header from './components/Header';
import apiClient from "./lib/ApiClient";

function App() {
  const [flags, setFlags] = useState([]);
  const [dbName, setDbName] = useState("");

  useEffect(() => {
    apiClient.getFlags((data) => setFlags(data));
    apiClient.checkDBConnection((data) => {
      if (data.connected) {
        setDbName(data.database);
      } else {
        setDbName("")
      }
    })
  }, []);

  return (
<<<<<<< HEAD
    <>
      <Header />
      <main className="flag-dashboard">
        <SideNav />
        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<FlagDashboard flags={flags} setFlags={setFlags} />} />
            <Route path="/flags/:flagId" element={<FlagDetailsPage flags={flags} setFlags={setFlags} />} />
          </Routes>
        </BrowserRouter>
      </main>
    </>
=======
    <main className="flag-dashboard">
      <SideNav />
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<FlagDashboard flags={flags} setFlags={setFlags} dbName={dbName} setDbName={setDbName}/>} />
          <Route path="/flags/:flagId" element={<FlagDetailsPage flags={flags} setFlags={setFlags} dbName={dbName} setDbName={setDbName}/>} />
        </Routes>
      </BrowserRouter>
    </main>
>>>>>>> e936998 (Added connection to DB and DB-form to FlagList. Created FlagsHeader component)
  );
}

export default App;
