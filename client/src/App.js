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
import NewExperimentPage from './components/NewExperimentPage';
import NewMetricForm from './components/NewMetricForm';
import SdkKeyPage from './components/SdkKeyPage';

function App() {
  const dispatch = useDispatch();
  const [ dbModalOpen, setDbModalOpen ] = useState(false);

  useEffect(() => {
    dispatch(fetchFlags());
    dispatch(checkDBConnection());
  }, [dispatch]);

  return (
    <>
      <BrowserRouter>
        <Header setDbModalOpen={setDbModalOpen} />
        <main className="flex w-full h-full">
          <SideNav />
          <Routes>
            <Route exact path="/" element={<FlagDashboard />} />
            <Route path="/flags/:flagId" element={<FlagDetailsPage />} />
            <Route path="/flags/:flagId/create_experiment" element={<NewExperimentPage />} />
            <Route path="/metrics" element={<MetricsPage />} />
            <Route path="/edit_metric/:id" element={<NewMetricForm />} />
            <Route path="/sdkKey" element={<SdkKeyPage />} />
          </Routes>
        </main>
        <DBModal modalOpen={dbModalOpen} setModalOpen={setDbModalOpen} />
      </BrowserRouter>
    </>
  );
}

export default App;
