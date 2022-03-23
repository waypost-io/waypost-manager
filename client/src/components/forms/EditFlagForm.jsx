import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { editFlag } from "../../actions/flagActions";
import { deleteAssignmentsOnFlag, addAssignmentsToFlag } from "../../actions/cAssignmentActions";

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
  const [status, setStatus] = useState(false);


  const handleSelection = (e) => {
    e.preventDefault();
    setStatus(e.target.value === "true");
  }

  const userInAssignments = (userId, obj) => {
    const allUsers = obj.on.concat(obj.off);
    return allUsers.includes(userId);
  }

  const handleAdd = (e) => {
    e.preventDefault();
    // if user currently on screen, don't do anything, user can only have one
    // custom assignment per flag
    if (userInAssignments(userToAdd, existingAssignments)) {
      alert("A user cannot have multiple assignments on the same flag");
      setUserToAdd("");
      return
    }
    // if user is in database with same status but was deleted
    // don't add them and remove user from instruction to be deleted
    const statusKey = status ? "on" : "off";
    if (customAssignments[statusKey].includes(userToAdd)) {
      setDeletedAssignments(deletedAssignments.filter(userId => (
        userId !== userToAdd
      )));
    } else {
      const obj = {};
      obj[userToAdd] = status;
      setNewAssignments({...newAssignments, ...obj});
    }

    const newEA = JSON.parse(JSON.stringify(existingAssignments));
    status ? newEA.on.push(userToAdd) : newEA.off.push(userToAdd)
    setExistingAssignments(newEA);
    setUserToAdd("");
  }

  const handleDelete = (e) => {
    e.preventDefault();
    // if custom assignment of user doesn't exist, you can't delete it
    if (!userInAssignments(userToDelete, existingAssignments)) {
      alert("You cannot delete a user who isn't assigned. Check your spelling and please try again");
      return
    }
    // If the user to delete was just added, just remove the add
    if (Object.keys(newAssignments).includes(userToDelete)) {
      const obj = {};
      Object.keys(newAssignments).forEach((userId) => {
        if (userId !== userToDelete) obj[userId] = newAssignments[userId];
      })
      setNewAssignments(obj);
    } else { // otherwise add them to list of users to delete
      setDeletedAssignments([userToDelete, ...deletedAssignments]);
    }

    const newEA = JSON.parse(JSON.stringify(existingAssignments));
    newEA.on = newEA.on.filter((id) => id !== userToDelete);
    newEA.off = newEA.off.filter((id) => id !== userToDelete);
    setExistingAssignments(newEA);
    setUserToDelete("")
  }

  const handleSaveEdits = async (e) => {
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

    if (deletedAssignments.length > 0) {
      await dispatch(deleteAssignmentsOnFlag(flagId, deletedAssignments));
    }

    if (Object.keys(newAssignments).length > 0) {
      dispatch(addAssignmentsToFlag(flagId, newAssignments));
    }

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
          <button className="underline underline-offset-4 mx-2 text-primary-violet hover:text-primaryDark-violet" type="button" onClick={handleDelete}>
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
          <select className="mx-2 border border-black rounded-lg p-2 bg-primary-offwhite" value={status} onChange={handleSelection}>
            <option value={"true"} >Always On</option>
            <option value={"false"} >Always Off</option>
          </select>
          <button className="underline underline-offset-4 mx-1 text-primary-violet hover:text-primaryDark-violet" type="button" onClick={handleAdd}>
            Add
          </button>
        </div>
      </form>
      <div className="mt-8">
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
