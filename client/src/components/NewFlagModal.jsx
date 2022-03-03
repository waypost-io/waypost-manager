import React, { useState } from 'react';
import apiClient from '../lib/ApiClient';

const NewFlagModal = ({ modalOpen, setModalOpen }) => {
  const [ name, setName ] = useState('');
  const [ status, setStatus ] = useState(false);

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const resetForm = () => {
    setModalOpen(false);
    setName('');
    setStatus(false);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.length === 0) return;
    apiClient.createFlag({ name, status }, () =>  resetForm());
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