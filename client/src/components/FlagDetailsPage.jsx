import React from "react";
import { useParams } from "react-router-dom";
import ExperimentInfo from "./ExperimentInfo";
import apiClient from "../lib/ApiClient";

const FlagDetailsPage = ({ flags, setFlags }) => {
  const { flagId } = useParams();
  const flagData = flags.find((flag) => flag.id === Number(flagId));

  const setFlagExptStatus = (status) => {
    let updatedFlags = flags.map(flag => {
      if (flag.id === Number(flagId)) {
        return { ...flag, is_experiment: status };
      } else {
        return { ...flag };
      }
    });
    console.log(updatedFlags);
    setFlags(updatedFlags);
  };

  const handleCreateExperiment = (e) => {
    apiClient.createExperiment(flagId, () => setFlagExptStatus(true));
  };

  const handleStopExperiment = () => {
    setFlagExptStatus(false);
  };

  return (
    <div className="flag-details-container">
      <h1>{flagData.name}</h1>
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
