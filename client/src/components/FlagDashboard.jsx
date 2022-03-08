import React, { useState } from 'react';
import FlagsList from './FlagsList';
import NewFlagModal from './NewFlagModal';

const FlagDashboard = ({ flags, setFlags }) => {
  const [ modalOpen, setModalOpen ] = useState(false);

  return (
    <>
      <FlagsList flags={flags} setFlags={setFlags} setModalOpen={setModalOpen} />
      <NewFlagModal flags={flags} setFlags={setFlags} modalOpen={modalOpen} setModalOpen={setModalOpen} />
    </>
  );
};

export default FlagDashboard;