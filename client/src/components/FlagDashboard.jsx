import React, { useState } from 'react';
import SideNav from './SideNav';
import FlagsList from './FlagsList';
import NewFlagModal from './NewFlagModal';

const FlagDashboard = () => {
  const [flags, setFlags] = useState([]);
  const [ modalOpen, setModalOpen ] = useState(false);

  return (
    <>
      <main className="flag-dashboard">
        <SideNav />
        <FlagsList flags={flags} setFlags={setFlags} setModalOpen={setModalOpen} />
        <NewFlagModal flags={flags} setFlags={setFlags} modalOpen={modalOpen} setModalOpen={setModalOpen} />
      </main>
    </>
  );
};

export default FlagDashboard;