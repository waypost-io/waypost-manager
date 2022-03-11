import React, { useState } from 'react';
import FlagsList from './FlagsList';
import NewFlagModal from './NewFlagModal';
import DBModal from './DBModal.jsx'

const FlagDashboard = ({ flags, setFlags }) => {
  const [ flagModalOpen, setFlagModalOpen ] = useState(false);

  return (
    <>
      <FlagsList flags={flags} setFlags={setFlags} setModalOpen={setFlagModalOpen} />
      <NewFlagModal flags={flags} setFlags={setFlags} modalOpen={flagModalOpen} setModalOpen={setFlagModalOpen} />
    </>
  );
};

export default FlagDashboard;
