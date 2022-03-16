import React, { useState } from "react";
import { editExperiment } from "../actions/exptActions";
import { useDispatch } from "react-redux";


const EditExperiment = ({ id, name, description, duration, date_started, date_ended, setIsEditing }) => {
  const dispatch = useDispatch();
  const [newName, setNewName] = useState(name);
  const [newDescription, setNewDescription] = useState(description);
  const [newDuration, setNewDuration] = useState(duration);
  const inputCSS = "border border-primary-oxfordblue rounded-lg px-2";

  const startDate = new Date(date_started).toLocaleDateString("en-US");

  const submitEdits = (e) => {
    e.preventDefault();
    const edits = { name: newName, description: newDescription, duration: newDuration };
    dispatch(editExperiment(id, edits));
    setIsEditing(false);
  }
  return (
    <>
      <div className="flex justify-between items-center w-full">
        <h2 className="text-primary-violet text-lg">Experiment from {startDate} to Present</h2>
        <div className="flex justify-between items-center">
          <button className="bg-primary-turquoise text-primary-offwhite rounded-lg py-1.5 px-6 ml-2" type="submit" onClick={submitEdits}>Submit</button>
          <button className="bg-slate text-primary-offwhite rounded-lg py-1.5 px-6 ml-2" type="button" onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      </div>
      <p>ID: <span className="font-bold">{id}</span></p>
      <p>Name: <input className={inputCSS} value={newName} onChange={(e) => setNewName(e.target.value)}/></p>
      <p>Duration: <input className={inputCSS} type="number" value={newDuration} onChange={(e) => setNewDuration(e.target.value)}/> days</p>
      <p>Description: <input className={inputCSS} value={newDescription} onChange={(e) => setNewDescription(e.target.value)}/></p>
    </>
  )
}

export default EditExperiment;
