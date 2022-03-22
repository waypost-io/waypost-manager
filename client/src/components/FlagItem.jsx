import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';

const FlagItem = ({
  id,
  name,
  description,
  active,
  handleToggle,
  handleDeleteFlag,
}) => {
  const navigate = useNavigate();

  const handleSelectFlag = (e) => {
    e.preventDefault();
    navigate(`/flags/${id}`);
  };

  return (
    <div className="flex justify-between items-center p-5 border-b border-b-primary-oxfordblue">
      <a className="font-bold" href={`/flags/${id}`} onClick={handleSelectFlag}>
        {name}
      </a>
      <div className="flex">
        <label className="toggle">
          <input
            type="checkbox"
            defaultChecked={active ? true : false}
            onChange={handleToggle(id)}
          />
          <span className="slider round"></span>
        </label>
        <button
          type="button"
          className="text-primary-oxfordblue ml-6 bg-transparent hover:text-primary-violet"
          onClick={handleDeleteFlag(id)}
        >
          <FontAwesomeIcon icon={faTrashCan} />
        </button>
      </div>
    </div>
  );
};

export default FlagItem;
