import React from "react";
import { useNavigate } from "react-router-dom";

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
    <div className="flex justify-between p-5 border-b border-b-primary-oxfordblue">
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
          className="text-primary-oxfordblue text-xs ml-2.5 bg-transparent hover:text-primary-violet"
          onClick={handleDeleteFlag(id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default FlagItem;
