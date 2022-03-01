import React, { useState, useEffect } from 'react';
import apiClient from '../lib/ApiClient';
import FlagItem from './FlagItem';

const FlagsList = () => {
  const [ flags, setFlags ] = useState([]);

  useEffect(() => {
    apiClient.getFlags((data) => setFlags(data));
  }, []);

  return (
    <div>
      {flags.map(flag => <FlagItem key={flag.id} id={flag.id} />)}
    </div>
  );
};

export default FlagsList;