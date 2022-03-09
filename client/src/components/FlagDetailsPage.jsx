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
    apiClient.createExperiment(flagId, () => setFlagExptStatus(true));
  };

  const handleStopExperiment = () => {
    setFlagExptStatus(false);
  };

  if (!flagData) return null;
  console.log(flagData);
  return (
    <div className="flag-details-container">
      <h1>{flagData.name}</h1>
      <p>{flagData.description}</p>
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
