import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import FlagDashboard from './components/FlagDashboard';
import SideNav from './components/SideNav';
import FlagDetailsPage from './components/FlagDetailsPage';
import Header from './components/Header';
import DBModal from './components/DBModal';
import apiClient from "./lib/ApiClient";

function App() {
  const [flags, setFlags] = useState([]);
  const [dbName, setDbName] = useState("");
  const [ dbModalOpen, setDbModalOpen ] = useState(false);

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
    <>
      <Header setDbModalOpen={setDbModalOpen} dbName={dbName} setDbName={setDbName}/>
      <DBModal modalOpen={dbModalOpen} setModalOpen={setDbModalOpen} setDbName={setDbName}/>
      <main className="flex w-full h-full">
        <SideNav />
        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<FlagDashboard flags={flags} setFlags={setFlags} />} />
            <Route path="/flags/:flagId" element={<FlagDetailsPage flags={flags} setFlags={setFlags} />} />
          </Routes>
        </BrowserRouter>
      </main>
    </>
  );
}

export default App;
