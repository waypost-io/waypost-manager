import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchFlags } from './actions/flagActions';
import { checkDBConnection } from './actions/dbActions';
import './App.css';
import FlagDashboard from './components/FlagDashboard';
import SideNav from './components/SideNav';
import FlagDetailsPage from './components/FlagDetailsPage';
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
      <DBModal modalOpen={dbModalOpen} setModalOpen={setDbModalOpen} />
      <main className="flex w-full h-full">
        <SideNav />
        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<FlagDashboard />} />
            <Route path="/flags/:flagId" element={<FlagDetailsPage />} />
          </Routes>
        </BrowserRouter>
      </main>
    </>
  );
}

export default App;
