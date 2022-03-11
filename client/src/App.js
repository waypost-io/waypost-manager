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

  useEffect(() => {
    apiClient.getFlags((data) => setFlags(data));
  }, []);

  return (
    <>
      <Header />
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
