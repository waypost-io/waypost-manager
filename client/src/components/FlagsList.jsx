import React from "react";
import apiClient from "../lib/ApiClient";
import FlagItem from "./FlagItem";

const FlagsList = ({ flags, setFlags, setModalOpen }) => {
  const handleToggle = (id) => {
    return (e) => {
      apiClient.toggleFlag(id, e.target.checked, () => {
        const updatedFlags = flags.map((flag) => {
          if (flag.id === id) {
            return { ...flag, status: e.target.checked };
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
        setFlags(flags.filter((flag) => flag.id !== id));
      });
    };
  };

  return (
    <div className="w-full py-2.5 px-12">
      <div className="flex justify-between items-center p-5">
        <h2 className="text-xl font-bold">Feature Flags</h2>
        <button
          className="btn bg-primary-turquoise"
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
