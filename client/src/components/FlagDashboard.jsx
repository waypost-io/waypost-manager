import React, { useState } from 'react';
import FlagsList from './FlagsList';
import NewFlagModal from './NewFlagModal';
import DBModal from './DBModal.jsx'

const FlagDashboard = ({ flags, setFlags, dbName, setDbName }) => {
  const [ flagModalOpen, setFlagModalOpen ] = useState(false);
  const [ dbModalOpen, setDbModalOpen ] = useState(false);

  return (
    <>
      <FlagsList flags={flags} setFlags={setFlags} setFlagModalOpen={setFlagModalOpen} setDbModalOpen={setDbModalOpen} dbName={dbName} setDbName={setDbName}/>
      <NewFlagModal flags={flags} setFlags={setFlags} modalOpen={flagModalOpen} setModalOpen={setFlagModalOpen} />
      <DBModal modalOpen={dbModalOpen} setModalOpen={setDbModalOpen} setDbName={setDbName}/>
    </>
  );
};

export default FlagDashboard;
