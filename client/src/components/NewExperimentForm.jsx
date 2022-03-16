import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { editFlag } from "../actions/flagActions";
import { createExperiment } from "../actions/exptActions";
import MetricCheckbox from "./MetricCheckbox";

const NewExperimentForm = ({ metrics }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { flagId } = useParams();

  const [duration, setDuration] = useState(14);
  const [percentTest, setPercentTest] = useState(50);
  const [name, setName] = useState("")
  const [description, setDescription] = useState("");
  const [metricIds, setMetricIds] = useState([]);

  const backToFlag = `/flags/${flagId}`;

  const validPercent = (percent) => {
    if (percent === "e") return false;
    percent = Number(percent);
    const result = percent >= 0 && percent <= 100 && !isNaN(percentTest) && Math.floor(percent) === percent;
    return result
  }

  const validMetrics = (metricIds) => {
    const existingMetricIds = metrics.map((metric) => metric.id);
    return metricIds.every(id => existingMetricIds.includes(id));
  }

  const validateInput = () => {
    let errMessage = "";

    if (duration < 1) {
      errMessage += "- The duration has to be at least one day\n"
    }

    if (!validPercent(percentTest)) {
      errMessage += "- The percentage you're testing has to be an integer between 0-100\n"
    }

    if (description.length > 255) {
      errMessage += "- The length of the description is too long\n"
    }

    if (name.length > 50) {
      errMessage += "- The length of the name is too long (max 50 char)\n"
    }

    if (!validMetrics(metricIds)) {
      errMessage += "- Please check metrics page to make sure those you selected still exist\n"
    }

    if (metricIds.length === 0) {
      errMessage += "- Please select at least one metric. If your desired ones aren't present please visit the 'Metrics' tab and add them before starting the experiment\n"
    }

    return errMessage
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    let errMessage = validateInput();

    if (errMessage.length > 0) {
      alert(errMessage);
      return;
    }

    const exptObj = { name, flag_id: flagId, description, duration, metric_ids: metricIds };
    const flagObj = { percentage_split: percentTest, is_experiment: true };

    dispatch(editFlag(flagId, flagObj));
    dispatch(createExperiment(exptObj));
    navigate(backToFlag);
  };

  const toggleMetric = (id) => {
    if (metricIds.includes(id)) {
      setMetricIds(metricIds.filter(existingId => existingId !== id))
    } else {
      setMetricIds([...metricIds, id]);
    }
  }

  const handleCancel = (e) => {
    e.preventDefault();
    navigate(backToFlag);
  }

  return (
    <form>
      <div className="mt-2.5 flex items-center">
        <label htmlFor="name" className="inline-block w-1/3 text-right mr-5">
          Name (optional):{" "}
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-slate rounded-lg p-2"
        />
      </div>
      <div className="mt-2.5 flex items-center">
        <label htmlFor="description" className="inline-block w-1/3 text-right mr-5">Description (optional, max 255 characters): </label>
        <textarea
          id="description"
          type="textarea"
          rows="3"
          cols="30"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border border-slate rounded-lg p-2"
        />
      </div>
      <div className="mt-2.5 flex items-center">
        <label htmlFor="percent-test" className="inline-block w-1/3 text-right mr-5">Percent of Users Tested: </label>
        <input
          id="percent-test"
          type="number"
          max={100}
          min={0}
          size="3"
          className="border border-slate rounded-lg p-2"
          value={percentTest}
          onChange={(e) => setPercentTest(e.target.value)}
        />{" "}
        <span className="ml-2">%</span>
        <p className="inline-block ml-5">{validPercent(percentTest) ? `(${100-percentTest}% of users in control group)` : "Please enter an integer from 0-100"}</p>
      </div>
      <div className="mt-2.5 flex items-center">
        <label htmlFor="duration" className="inline-block w-1/3 text-right mr-5">Duration: </label>
        <input
          id="duration"
          type="number"
          min={0}
          size="3"
          className="border border-slate rounded-lg p-2"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />{" "}
        <span className="ml-2">days</span>
      </div>
      <div id="metrics">
        <h3 className="mt-2.5 font-bold text-base">Select the metrics you want to measure</h3>
        <div className="flex mt-2.5 justify-start">
        {metrics.map(({ name, id }) => (
          <MetricCheckbox key={id} name={name} id={id} handleClick={() => toggleMetric(id)} selected={metricIds.includes(id)}/>
        ))}
        </div>
      </div>
      <button className="btn bg-primary-turquoise" onClick={handleSubmit}>
        Start New Experiment
      </button>
      <button className="btn bg-slate" onClick={handleCancel}>Cancel</button>
    </form>
  );
};

export default NewExperimentForm;
