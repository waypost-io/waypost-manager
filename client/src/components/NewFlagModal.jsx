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
        <h2 className="font-bold text-xl text-primary-violet">New Feature Flag</h2>
        <form className="new-flag-form">
          <div className="mt-2.5">
            <label htmlFor="flag-title" className="mr-5">Name:</label>
            <input id="flag-title" type="text" className="border border-primary-oxfordblue rounded-lg px-2" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="mt-2.5">
            <label htmlFor="flag-description" className="mr-5">Description:</label>
            <input id="flag-description" type="text" className="border border-primary-oxfordblue rounded-lg px-2" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="mt-2.5">
            <label htmlFor="flag-active" className="mr-5">Active?</label>
            <input id="flag-active" type="checkbox" checked={status} onChange={(e) => setStatus(e.target.checked)} />
          </div>
          <button type="submit" className="btn bg-primary-violet" onClick={handleSubmit}>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default NewFlagModal;