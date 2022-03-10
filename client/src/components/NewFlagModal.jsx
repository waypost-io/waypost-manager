import React, { useState } from 'react';
import apiClient from '../lib/ApiClient';

const NewFlagModal = ({ flags, setFlags, modalOpen, setModalOpen }) => {
  const [ name, setName ] = useState('');
  const [ description, setDescription ] = useState('');
  const [ status, setStatus ] = useState(false);

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const resetForm = () => {
    setModalOpen(false);
    setName('');
    setDescription('');
    setStatus(false);
  }

  const addNewFlag = (newFlag) => {
    setFlags([...flags, newFlag]);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.length === 0) return;
    apiClient.createFlag({ name, description, status }, (data) => {
      resetForm();
      addNewFlag(data);
    });
  };

  return (
    <div className={`overlay ${modalOpen ? "" : "hidden"}`}>
      <div className="new-flag-modal">
        <i className="x-icon icon close-modal" onClick={handleCloseModal}></i>
        <h2>New Feature Flag</h2>
        <form className="new-flag-form">
          <div>
            <label htmlFor="flag-title">Name:</label>
            <input id="flag-title" type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </div><div>
            <label htmlFor="flag-description">Description:</label>
            <input id="flag-description" type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div>
            <label htmlFor="flag-active">Active?</label>
            <input id="flag-active" type="checkbox" checked={status} onChange={(e) => setStatus(e.target.checked)} />
          </div>
          <button type="submit" className="submit-new-flag-btn" onClick={handleSubmit}>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default NewFlagModal;