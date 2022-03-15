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
    percent = Number(percent);
    return percent >= 0 && percent <= 100 && !isNaN(percentTest) && Math.floor(percent) === percent;
  }

  const validMetrics = (metricIds) => {
    const existingMetricIds = metrics.map((metric) => metric.id);
    console.log("existingMetricIds", existingMetricIds);
    console.log(metricIds);
    console.log(typeof metricIds[0]);
    return metricIds.every(id => existingMetricIds.includes(id));
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    let errMessage = ""
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
      // maybe edit this error message to something better
      errMessage += "- Please check to make sure your metrics are saved on the metrics page\n"
    }
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
      <div className="mt-2.5">
        <label htmlFor="name" className="mr-2.5">
          Name (optional):{" "}
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-primary-oxfordblue rounded-lg px-2"
        />
      </div>
      <div className="mt-2.5">
        <label htmlFor="description">Description (optional, max 255 characters): </label>
        <textarea
          id="description"
          type="textarea"
          rows="3"
          cols="30"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="block border border-primary-oxfordblue rounded-lg px-2"
        />
      </div>
      <div className="mt-2.5">
        <label htmlFor="percent-test">Percent of Users Tested: </label>
        <input
          id="percent-test"
          type="number"
          max={100}
          min={0}
          size="3"
          className="border border-primary-oxfordblue rounded-lg px-2"
          value={percentTest}
          onChange={(e) => setPercentTest(e.target.value)}
        />{" "}
        %
        <p>{validPercent(percentTest) ? `(${100-percentTest}% of users in control group)` : "Please enter an integer from 0-100"}</p>
      </div>
      <div className="mt-2.5">
        <label htmlFor="duration">Duration: </label>
        <input
          id="duration"
          type="number"
          min={0}
          size="3"
          className="border border-primary-oxfordblue rounded-lg px-2"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />{" "}
        days
      </div>
      <div id="metrics">
        <h3 className="mt-2.5 font-bold text-base">Click the metrics you want to measure</h3>
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
