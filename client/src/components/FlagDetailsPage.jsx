import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ExperimentInfo from "./ExperimentInfo";
import apiClient from "../lib/ApiClient";

const FlagDetailsPage = () => {
  const { flagId } = useParams();
  const [ flagFetched, setFlagFetched ] = useState(false);
  const [ flagData, setFlagData ] = useState(undefined);

  useEffect(() => {
    if (!flagFetched) {
      apiClient.getFlag(flagId, (data) => {
        setFlagData(data);
        setFlagFetched(true);
      });
    }
  }, [flagId, flagFetched]);

  const setFlagExptStatus = (status) => {
    setFlagData({ ...flagData, is_experiment: status });
  };

  const handleCreateExperiment = (e) => {
    apiClient.toggleExperiment(flagId, true, () => setFlagExptStatus(true));
  };

  const handleStopExperiment = () => {
    apiClient.toggleExperiment(flagId, false, () => setFlagExptStatus(false));
  };

  if (!flagData) return null;
  console.log(flagData);
  return (
    <div className="flag-details-container">
      <h1>{flagData.name}</h1>
      <p>{flagData.description}</p>
      <p>Current Status: <span className="accent-text">{flagData.status ? "On" : "Off"}</span></p>
      <p>Rollout percentage: <span className="accent-text">{flagData.percentage_split}%</span></p>
      {flagData.is_experiment ? (
        <>
          <ExperimentInfo />
          <button className="btn red-btn" onClick={handleStopExperiment}>Stop Experiment</button>
        </>
      ) :
        <button className="btn" onClick={handleCreateExperiment}>
          Create an experiment
        </button>
      }
    </div>
  );
};

export default FlagDetailsPage;
