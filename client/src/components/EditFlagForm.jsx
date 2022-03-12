import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { editFlag } from "../actions/flagActions";

const EditFlagForm = () => {
  const dispatch = useDispatch();
  const { flagId } = useParams();
  const flagData = useSelector((state) =>
    state.flags.find((flag) => flag.id === +flagId)
  );

  const [newName, setNewName] = useState(flagData ? flagData.name : "");
  const [newDescription, setNewDescription] = useState(
    flagData ? flagData.description : ""
  );
  const [newPercent, setNewPercent] = useState(
    flagData ? flagData.percentage_split : 100
  );

  const handleSaveEdits = ({ setIsEditing }) => {
    if (
      newName.length === 0 ||
      isNaN(Number(newPercent)) ||
      newPercent < 0 ||
      newPercent > 100
    ) {
      window.alert("Please check your inputs again.");
      return;
    }

    dispatch(
      editFlag(flagId, {
        name: newName,
        description: newDescription,
        percentage_split: newPercent,
      })
    );
    setIsEditing(false);
  };

  return (
    <form>
      <div>
        <label htmlFor="new-name" className="mr-2.5">
          Name:{" "}
        </label>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="border border-primary-oxfordblue rounded-lg px-2"
        />
      </div>
      <div className="mt-2.5">
        <label htmlFor="new-description">Description: </label>
        <textarea
          id="new-description"
          type="textarea"
          rows="3"
          cols="30"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          className="block border border-primary-oxfordblue rounded-lg px-2"
        />
      </div>
      <div className="mt-2.5 flex items-center">
        <label className="mr-2.5">Status: </label>
        <label className="toggle">
          <input
            type="checkbox"
            defaultChecked={flagData.status ? true : false}
            // onChange={handleToggle(id)}
          />
          <span className="slider round"></span>
        </label>
      </div>
      <div className="mt-2.5">
        <label htmlFor="new-percent">Percent of Users Exposed: </label>
        <input
          id="new-percent"
          type="number"
          max={100}
          min={0}
          size="3"
          className="border border-primary-oxfordblue rounded-lg px-2"
          value={newPercent}
          onChange={(e) => setNewPercent(e.target.value)}
        />{" "}
        %
      </div>
      <button className="btn bg-primary-turquoise" onClick={handleSaveEdits}>
        Save Changes
      </button>
    </form>
  );
};

export default EditFlagForm;
