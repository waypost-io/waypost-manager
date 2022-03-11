import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchFlags } from './actions/flagActions';
import './App.css';
import FlagDashboard from './components/FlagDashboard';
import SideNav from './components/SideNav';
import FlagDetailsPage from './components/FlagDetailsPage';
import Header from './components/Header';
import DBModal from './components/DBModal';
import apiClient from "./lib/ApiClient";

function App() {
  const dispatch = useDispatch();
  const flags = useSelector(state => state);
  const [dbName, setDbName] = useState("");
  const [ dbModalOpen, setDbModalOpen ] = useState(false);

  useEffect(() => {
    dispatch(fetchFlags());
    apiClient.checkDBConnection((data) => {
      if (data.connected) {
        setDbName(data.database);
      } else {
        setDbName("")
      }
    })
  }, [dispatch]);

  return (
    <>
      <Header setDbModalOpen={setDbModalOpen} dbName={dbName} setDbName={setDbName}/>
      <DBModal modalOpen={dbModalOpen} setModalOpen={setDbModalOpen} setDbName={setDbName}/>
      <main className="flex w-full h-full">
        <SideNav />
        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<FlagDashboard flags={flags} />} />
            <Route path="/flags/:flagId" element={<FlagDetailsPage flags={flags} />} />
          </Routes>
        </BrowserRouter>
      </main>
    </>
  );
}

export default App;
