import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleFlag, deleteFlag } from '../actions/flagActions';
import FlagItem from "./FlagItem";

const FlagsList = ({ setModalOpen }) => {
  const dispatch = useDispatch();
  const flags = useSelector(state => state.flags);

  const handleToggle = (id) => {
    return (e) => {
      dispatch(toggleFlag(id, e.target.checked));
    };
  };

  const handleDeleteFlag = (id) => {
    return (e) => {
      e.preventDefault();
      if (window.confirm("Are you sure you want to delete this?")) {
        dispatch(deleteFlag(id));
      }
    };
  };

  return (
    <div className="w-full py-2.5 px-12">
      <div className="flex justify-between items-center my-3">
        <h2 className="text-3xl font-bold text-primary-violet">Feature Flags</h2>
        <button
          className="btn bg-primary-turquoise my-4"
          type="button"
          onClick={() => setModalOpen(true)}
        >
          Create New
        </button>
      </div>
      {flags.length > 0 &&
        flags
          .sort((a, b) => a.id - b.id)
          .map((flag) => {
            return (
              <FlagItem
                key={flag.id}
                id={flag.id}
                name={flag.name}
                description={flag.description}
                active={flag.status}
                handleToggle={handleToggle}
                handleDeleteFlag={handleDeleteFlag}
              />
            );
          })}
    </div>
  );
};

export default FlagsList;
