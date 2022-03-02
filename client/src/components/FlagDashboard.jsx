import React, { useState } from 'react';
import SideNav from './SideNav';
import FlagsList from './FlagsList';
import NewFlagModal from './NewFlagModal';

const FlagDashboard = () => {
  const [ modalOpen, setModalOpen ] = useState(false);

  return (
    <>
      <main className="flag-dashboard">
        <SideNav />
        <FlagsList setModalOpen={setModalOpen} />
        <NewFlagModal modalOpen={modalOpen} setModalOpen={setModalOpen} />
      </main>
    </>
  );
};

export default FlagDashboard;