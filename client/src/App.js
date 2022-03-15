import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchFlags } from './actions/flagActions';
import { checkDBConnection } from './actions/dbActions';
import './App.css';
import FlagDashboard from './components/FlagDashboard';
import SideNav from './components/SideNav';
import FlagDetailsPage from './components/FlagDetailsPage';
import MetricsPage from './components/MetricsPage';
import Header from './components/Header';
import DBModal from './components/DBModal';

function App() {
  const dispatch = useDispatch();
  const [ dbModalOpen, setDbModalOpen ] = useState(false);

  useEffect(() => {
    dispatch(fetchFlags());
    dispatch(checkDBConnection());
  }, [dispatch]);

  return (
    <>
      <Header setDbModalOpen={setDbModalOpen} />
      <main className="flex w-full h-full">
        <SideNav />
        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<FlagDashboard />} />
            <Route path="/flags/:flagId" element={<FlagDetailsPage />} />
            <Route path="/metrics" element={<MetricsPage />} />
          </Routes>
        </BrowserRouter>
      </main>
      <DBModal modalOpen={dbModalOpen} setModalOpen={setDbModalOpen} />
    </>
  );
}

export default App;
