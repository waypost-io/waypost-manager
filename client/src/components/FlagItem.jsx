import React from 'react';
import { useNavigate } from "react-router-dom";

const FlagItem = ({ id, name, description, active, handleToggle, handleDeleteFlag }) => {
  const navigate = useNavigate();

  const handleSelectFlag = (e) => {
    e.preventDefault();
    navigate(`/flags/${id}`);
  };

  return (
    <div className="flag-item">
      <a className="flag-name" href={`/flags/${id}`} onClick={handleSelectFlag}>{name}</a>
      <div className="flag-controls">
        <label className="toggle">
          <input type="checkbox" defaultChecked={active ? true : false} onChange={handleToggle(id)} />
          <span className="slider round"></span>
        </label>
        <button type="button" className="delete-button" onClick={handleDeleteFlag(id)}>Delete</button>
      </div>
    </div>
  );
};

export default FlagItem;