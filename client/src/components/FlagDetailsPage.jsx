import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ExperimentInfo from "./ExperimentInfo";
import apiClient from "../lib/ApiClient";

const FlagDetailsPage = () => {
  const { flagId } = useParams();
  const [ flagFetched, setFlagFetched ] = useState(false);
  const [ flagData, setFlagData ] = useState(undefined);
  const [ exptsFetched, setExptsFetched ] = useState(false);
  const [ exptData, setExptData ] = useState(undefined);

  useEffect(() => {
    if (!flagFetched) {
      apiClient.getFlag(flagId, (data) => {
        setFlagData(data);
        setFlagFetched(true);
      });
    }
  }, [flagId, flagFetched]);

  useEffect(() => {
    apiClient.getExperiments(flagId, (data) => {
      setExptsFetched(true);
      setExptData(data);
    });
  }, [exptsFetched, flagId]);

  const setFlagExptStatus = (status) => {
    setFlagData({ ...flagData, is_experiment: status });
  };

  const handleCreateExperiment = (e) => {
    apiClient.toggleExperiment(flagId, true, () => setFlagExptStatus(true));
    setExptsFetched(false);
  };

  const handleStopExperiment = () => {
    apiClient.toggleExperiment(flagId, false, () => setFlagExptStatus(false));
  };

  if (!flagData) return null;
  return (
    <div className="flag-details-container">
      <h1>{flagData.name}</h1>
      <p>{flagData.description}</p>
      <p>Current Status: <span className="accent-text">{flagData.status ? "On" : "Off"}</span></p>
      <p>Rollout percentage: <span className="accent-text">{flagData.percentage_split}%</span></p>
      {flagData.is_experiment ? (
        <>
          <button className="btn red-btn" onClick={handleStopExperiment}>Stop Experiment</button>
        </>
      ) :
        <button className="btn" onClick={handleCreateExperiment}>
          Create an experiment
        </button>
      }
      {exptData && exptData.map(expt => {
        return <ExperimentInfo key={expt.id} { ...expt } />
      })}
    </div>
  );
};

export default FlagDetailsPage;
