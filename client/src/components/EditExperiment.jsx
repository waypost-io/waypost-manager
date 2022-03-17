import React, { useState } from "react";
import { editExperiment } from "../actions/exptActions";
import { useDispatch } from "react-redux";
import MetricCheckbox from "./MetricCheckbox";


const EditExperiment = ({ id, name, description, duration, date_started, date_ended, metrics, allMetrics, setIsEditing }) => {
  const dispatch = useDispatch();
  const origMetricIds = metrics.map((m) => m.metric_id);
  const [newName, setNewName] = useState(name || "");
  const [newDescription, setNewDescription] = useState(description || "");
  const [newDuration, setNewDuration] = useState(duration);
  const [newMetricIds, setNewMetricIds] = useState(origMetricIds);
  const inputCSS = "border border-primary-oxfordblue rounded-lg px-2";
  const startDate = new Date(date_started).toLocaleDateString("en-US");

  const getChangedData = () => {
    const edits = {}
    if (newName !== name) edits.name = newName;
    if (Number(newDuration) !== Number(duration)) edits.duration = newDuration;
    if (newDescription !== description) edits.description = newDescription;
    if (newMetricIds.join(", ") !== origMetricIds.join(", ")) {
      edits.metric_ids = newMetricIds;
      edits.old_metric_ids = origMetricIds;
    }
    return edits;
  }

  const validateInput = () => {
    let errMessage = "";

    if (newDuration < 1) {
      errMessage += "- The duration has to be at least one day\n"
    }

    if (newDescription.length > 255) {
      errMessage += "- The length of the description is too long\n"
    }

    if (newName.length > 50) {
      errMessage += "- The length of the name is too long (max 50 char)\n"
    }

    if (newMetricIds.length === 0) {
      errMessage += "- You must have at least one metric measured per experiment"
    }

    return errMessage
  }

  const toggleMetric = (id) => {
    if (newMetricIds.includes(id)) {
      setNewMetricIds(newMetricIds.filter(existingId => existingId !== id))
    } else {
      setNewMetricIds([...newMetricIds, id]);
    }
  }

  const submitEdits = (e) => {
    e.preventDefault();
    const edits = getChangedData();
    const errMessage = validateInput();
    if (errMessage.length > 0) {
      alert(errMessage);
      return
    }

    if (Object.keys(edits).length !== 0) {
      dispatch(editExperiment(id, edits));
    }
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
      <div className="my-5">
          <h3 className="font-bold text-base">Select the metrics you want to measure:</h3>
          <div className="flex mt-2.5 mx-3 justify-start">
          {allMetrics.map(({ id, name }) => (
            <MetricCheckbox key={id} id={id} name={name} selected={newMetricIds.includes(id)} handleClick={() => toggleMetric(id)} />
          ))}
          </div>
      </div>
      <p className="text-primary-violet">Note: if you'd like to change the rollout of this experiment, edit the rollout of this flag by hitting the "Edit" button near the top of the page</p>
    </>
  )
}

export default EditExperiment;
