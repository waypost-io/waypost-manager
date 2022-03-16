import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createFlag } from "../actions/flagActions";

const NewFlagModal = ({ modalOpen, setModalOpen }) => {
  const dispatch = useDispatch();
  const flags = useSelector((state) => state.flags);
  const flagNames = flags.map((flag) => flag.name);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(false);
  const [percentage, setPercentage] = useState(100);

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const resetForm = () => {
    setModalOpen(false);
    setName("");
    setDescription("");
    setStatus(false);
    setPercentage(100);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.length === 0) return;
    if (flagNames.includes(name)) {
      alert("Name is already taken by another feature flag.");
      return;
    }
    dispatch(createFlag(name, description, status, percentage));
    resetForm();
  };

  return (
    <div className={`overlay ${modalOpen ? "" : "hidden"}`}>
      <div className="new-flag-modal">
        <i className="x-icon icon close-modal" onClick={handleCloseModal}></i>
        <h2 className="font-bold text-xl text-primary-violet mt-5">
          New Feature Flag
        </h2>
        <form className="w-full p-2">
          <div className="mt-2.5 flex items-center">
            <label
              htmlFor="flag-title"
              className="inline-block flex-1 text-right mr-5"
            >
              <p>Name</p><p className="italic">(will be used as unique identifier):</p>
            </label>
            <input
              id="flag-title"
              type="text"
              className="border flex-1 border-slate rounded-lg p-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mt-2.5 flex items-center">
            <label
              htmlFor="flag-description"
              className="inline-block flex-1 text-right mr-5"
            >
              Description:
            </label>
            <input
              id="flag-description"
              type="text"
              className="border border-slate flex-1 rounded-lg p-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="mt-2.5 flex items-center">
            <label
              htmlFor="flag-active"
              className="inline-block w-1/2 text-right mr-5"
            >
              Active?
            </label>
            <input
              id="flag-active"
              type="checkbox"
              checked={status}
              onChange={(e) => setStatus(e.target.checked)}
            />
          </div>
          <div className="mt-2.5 flex items-center">
            <label
              htmlFor="flag-percent"
              className="inline-block w-1/2 text-right mr-5"
            >
              Percent of Users Exposed
            </label>
            <input
              id="flag-percent"
              type="number"
              max={100}
              min={0}
              size="3"
              className="border border-slate flex-0 rounded-lg p-2"
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
            />
            <span className="ml-2">%</span>
          </div>
        </form>
        <button
          type="submit"
          className="btn bg-primary-violet"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default NewFlagModal;
