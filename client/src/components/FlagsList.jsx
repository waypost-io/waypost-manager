import React, { useState, useEffect } from 'react';
import apiClient from '../lib/ApiClient';
import FlagItem from './FlagItem';

const FlagsList = ({ setModalOpen }) => {
  const [ flags, setFlags ] = useState([]);

  const handleToggle = (id) => {
    return (e) => {
      apiClient.toggleFlag(id, e.target.checked, () => {
        const updatedFlags = flags.map(flag => {
          if (flag.id === id) {
            return { ...flag, active: e.target.checked };
          } else {
            return flag;
          }
        });
        setFlags(updatedFlags);
      });
    };
  };

  const handleDeleteFlag = (id) => {
    return (e) => {
      e.preventDefault();
      alert("Are you sure you want to delete this?");
      apiClient.deleteFlag(id, () => {
        console.log('deleted');
      });
    };
  };

  useEffect(() => {
    apiClient.getFlags((data) => setFlags(data));
  }, []);

  return (
    <div className="flags-list-container">
      <div className="flags-list-header">
        <h2 >Feature Flags</h2>
        <button className="create-flag-btn" type="button" onClick={() => setModalOpen(true)}>Create New</button>
      </div>
      {flags.map(flag => <FlagItem key={flag.id} {...flag} handleToggle={handleToggle} handleDeleteFlag={handleDeleteFlag} />)}
    </div>
  );
};

export default FlagsList;