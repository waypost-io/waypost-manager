import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { editFlag } from "../../actions/flagActions";

const FIELD_DIV_CSS = "mt-2.5 flex justify-start items-center";
const LABEL_CSS = "inline-block w-1/3 text-right mr-5";
const INPUT_ELEM_CSS = "border border-slate rounded-lg p-2";

const EditFlagForm = ({ setIsEditing, customAssignments }) => {
  const dispatch = useDispatch();
  const { flagId } = useParams();
  const flagNames = useSelector((state) =>
    state.flags.map((flag) => flag.name)
  );
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
  const [newAssignments, setNewAssignments] = useState({});
  const [deletedAssignments, setDeletedAssignments] = useState([]);
  const [existingAssignments, setExistingAssignments] = useState(customAssignments);
  const [userToDelete, setUserToDelete] = useState("");
  const [userToAdd, setUserToAdd] = useState("");
  const [status, setStatus] = useState("Always On");

  const handleSelection = (e) => {
    setStatus(e.target.value)
  }

  const handleSaveEdits = (e) => {
    e.preventDefault();
    if (
      newName.length === 0 ||
      isNaN(Number(newPercent)) ||
      newPercent < 0 ||
      newPercent > 100
    ) {
      alert("Please check your inputs again.");
      return;
    }
    if (flagNames.includes(newName) && newName !== flagData.name) {
      alert("Name is already taken by another feature flag.");
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
    <div className="flex flex-col items-center border-b border-b-primary-oxfordblue py-8">
      <h2 className="font-bold text-xl text-primary-violet">Edit Flag</h2>
      <form className="w-full">
        <div className={FIELD_DIV_CSS}>
          <label htmlFor="new-name" className={LABEL_CSS}>
            Name:
          </label>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className={INPUT_ELEM_CSS}
          />
        </div>
        <div className={FIELD_DIV_CSS}>
          <label htmlFor="new-description" className={LABEL_CSS}>
            Description:
          </label>
          <textarea
            id="new-description"
            type="textarea"
            rows="3"
            cols="30"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            className={INPUT_ELEM_CSS}
          />
        </div>
        <div className={FIELD_DIV_CSS}>
          <label htmlFor="new-percent" className={LABEL_CSS}>
            Percent of Users Exposed:
          </label>
          <input
            id="new-percent"
            type="number"
            max={100}
            min={0}
            size="3"
            className={INPUT_ELEM_CSS}
            value={newPercent}
            onChange={(e) => setNewPercent(e.target.value)}
          />{" "}
          <span className="ml-2">%</span>
        </div>
        <div className={FIELD_DIV_CSS}>
          <label className={LABEL_CSS}>
            Always on for user IDs:
          </label>
          <span className="ml-2">{existingAssignments.on.join(", ")}</span>
        </div>
        <div className={FIELD_DIV_CSS}>
          <label className={LABEL_CSS}>
            Always off for user IDs:
          </label>
          <span className="ml-2">{existingAssignments.off.join(", ")}</span>
        </div>
        <div className={FIELD_DIV_CSS}>
          <label html-for="delete-custom-assignment" className={LABEL_CSS}>
            Delete a custom assignment:
          </label>
          <input
            id="delete-custom-assignment"
            type="text"
            className={INPUT_ELEM_CSS}
            value={userToDelete}
            onChange={(e) => setUserToDelete(e.target.value)}
          />
          <button className="btn bg-primary-violet hover:bg-primaryDark-violet mx-4" type="button">
            Delete
          </button>
        </div>
        <div className={FIELD_DIV_CSS}>
          <label html-for="delete-custom-assignment" className={LABEL_CSS}>
            Add a custom assignment:
          </label>
          <input
            id="delete-custom-assignment"
            type="text"
            className={INPUT_ELEM_CSS}
            value={userToAdd}
            onChange={(e) => setUserToAdd(e.target.value)}
          />
          <select className="mx-2" value={status} onChange={handleSelection}>
            <option value={true} >Always On</option>
            <option value={false} >Always Off</option>
          </select>
          <button className="btn bg-primary-turquoise hover:bg-primaryDark-turquoise mx-2" type="button">
            Add
          </button>
        </div>
      </form>
      <div>
        <button
          className="btn bg-primary-turquoise hover:bg-primaryDark-turquoise m-4"
          onClick={handleSaveEdits}
        >
          Save Changes
        </button>
        <button
          className="btn bg-slate hover:bg-slateDark m-4"
          onClick={() => setIsEditing(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditFlagForm;
