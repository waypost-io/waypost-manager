import React, { useState } from 'react';
import apiClient from '../lib/ApiClient';

const NewFlagModal = ({ modalOpen, setModalOpen }) => {
  const [ title, setTitle ] = useState('');
  const [ active, setActive ] = useState(false);

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const resetForm = () => {
    setModalOpen(false);
    setTitle('');
    setActive(false);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.length === 0) return;
    apiClient.createFlag({ title, active }, () =>  resetForm());
  };

  return (
    <div className={`overlay ${modalOpen ? "" : "hidden"}`}>
      <div className="new-flag-modal">
        <i className="x-icon icon close-modal" onClick={handleCloseModal}></i>
        <h2>New Feature Flag</h2>
        <form className="new-flag-form">
          <div>
            <label htmlFor="flag-title">Title:</label>
            <input id="flag-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <label htmlFor="flag-active">Active?</label>
            <input id="flag-active" type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
          </div>
          <button type="submit" className="submit-new-flag-btn" onClick={handleSubmit}>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default NewFlagModal;