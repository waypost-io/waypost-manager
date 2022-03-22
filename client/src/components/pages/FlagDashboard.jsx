import React, { useState } from 'react';
import FlagsList from '../FlagsList';
import NewFlagModal from '../NewFlagModal';

const FlagDashboard = () => {
  const [ flagModalOpen, setFlagModalOpen ] = useState(false);

  return (
    <>
      <FlagsList setModalOpen={setFlagModalOpen} />
      <NewFlagModal modalOpen={flagModalOpen} setModalOpen={setFlagModalOpen} />
    </>
  );
};

export default FlagDashboard;
