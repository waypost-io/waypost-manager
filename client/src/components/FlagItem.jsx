import React from 'react';

const FlagItem = ({ id, name, description, active, handleToggle, handleDeleteFlag }) => {
  return (
    <div className="flag-item">
      <span>{name}</span>
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