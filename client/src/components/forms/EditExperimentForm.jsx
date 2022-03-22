import React, { useState } from "react";
import { editExperiment } from "../../actions/exptActions";
import { useDispatch } from "react-redux";
import MetricCheckbox from "../MetricCheckbox";

const FIELD_DIV_CSS = "mt-2.5 flex justify-start items-center";
const LABEL_CSS = "inline-block w-1/3 text-center mr-5";
const INPUT_ELEM_CSS = "border border-slate rounded-lg p-2";

const EditExperiment = ({
  id,
  name,
  description,
  duration,
  date_started,
  date_ended,
  metrics,
  allMetrics,
  setIsEditing,
}) => {
  const dispatch = useDispatch();
  const origMetricIds = metrics.map((m) => m.metric_id);
  const [newName, setNewName] = useState(name || "");
  const [newDescription, setNewDescription] = useState(description || "");
  const [newDuration, setNewDuration] = useState(duration);
  const [newMetricIds, setNewMetricIds] = useState(origMetricIds);
  // const inputCSS = "border border-primary-oxfordblue rounded-lg px-2";
  const startDate = new Date(date_started).toLocaleDateString("en-US");

  const getChangedData = () => {
    const edits = {};
    if (newName !== name) edits.name = newName;
    if (Number(newDuration) !== Number(duration)) edits.duration = newDuration;
    if (newDescription !== description) edits.description = newDescription;
    if (newMetricIds.join(", ") !== origMetricIds.join(", ")) {
      edits.metric_ids = newMetricIds;
      edits.old_metric_ids = origMetricIds;
    }
    return edits;
  };

  const validateInput = () => {
    let errMessage = "";

    if (newDuration < 1) {
      errMessage += "- The duration has to be at least one day\n";
    }

    if (newDescription.length > 255) {
      errMessage += "- The length of the description is too long\n";
    }

    if (newName.length > 50) {
      errMessage += "- The length of the name is too long (max 50 char)\n";
    }

    if (newMetricIds.length === 0) {
      errMessage +=
        "- You must have at least one metric measured per experiment";
    }

    return errMessage;
  };

  const toggleMetric = (id) => {
    if (newMetricIds.includes(id)) {
      setNewMetricIds(newMetricIds.filter((existingId) => existingId !== id));
    } else {
      setNewMetricIds([...newMetricIds, id]);
    }
  };

  const submitEdits = (e) => {
    e.preventDefault();
    const edits = getChangedData();
    const errMessage = validateInput();
    if (errMessage.length > 0) {
      alert(errMessage);
      return;
    }

    if (Object.keys(edits).length !== 0) {
      dispatch(editExperiment(id, edits));
    }
    setIsEditing(false);
  };
  return (
    <>
      <div className="flex justify-between items-center w-full">
        <h2 className="text-primary-violet text-lg">
          Experiment from {startDate} to Present
        </h2>
        <div className="flex justify-between items-center">
          <button
            className="bg-primary-turquoise text-primary-offwhite rounded-lg py-1.5 px-6 ml-2"
            type="submit"
            onClick={submitEdits}
          >
            Submit
          </button>
          <button
            className="bg-slate text-primary-offwhite rounded-lg py-1.5 px-6 ml-2"
            type="button"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </button>
        </div>
      </div>
      <div className={FIELD_DIV_CSS}>
        <label htmlFor="expt-name" className={LABEL_CSS}>
          Name:
        </label>
        <input
          id="expt-name"
          className={INPUT_ELEM_CSS}
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
      </div>
      <div className={FIELD_DIV_CSS}>
        <label fhtmlFor="duration" className={LABEL_CSS}>
          Duration:
        </label>
        <input
          id="duration"
          className={INPUT_ELEM_CSS}
          type="number"
          value={newDuration}
          onChange={(e) => setNewDuration(e.target.value)}
        />
        <span className="ml-2">days</span>
      </div>
      <div className={FIELD_DIV_CSS}>
        <label htmlFor="description" className={LABEL_CSS}>
          Description:
        </label>
        <input
          id="description"
          className={INPUT_ELEM_CSS}
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
        />
      </div>
      <div className="my-5">
        <h3 className="font-bold text-base text-center">
          Select the metrics you want to measure:
        </h3>
        <div className="flex mt-2.5 mx-3 justify-center">
          {allMetrics.map(({ id, name }) => (
            <MetricCheckbox
              key={id}
              id={id}
              name={name}
              selected={newMetricIds.includes(id)}
              handleClick={() => toggleMetric(id)}
            />
          ))}
        </div>
      </div>
      <p className="text-primary-violet">
        Note: if you'd like to change the rollout of this experiment, edit the
        rollout of this flag by hitting the "Edit" button near the top of the
        page
      </p>
    </>
  );
};

export default EditExperiment;
