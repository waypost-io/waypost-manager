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
    <div className="py-5 px-8 w-full">
      <h1 className="font-bold text-xl">{flagData.name}</h1>
      <p>{flagData.description}</p>
      <p>Current Status: <span className="text-primary-violet font-bold">{flagData.status ? "On" : "Off"}</span></p>
      <p>Rollout percentage: <span className="text-primary-violet font-bold">{flagData.percentage_split}%</span></p>
      {flagData.is_experiment ? (
        <>
          <button className="btn bg-primary-violet" onClick={handleStopExperiment}>Stop Experiment</button>
        </>
      ) :
        <button className="btn bg-primary-turquoise" onClick={handleCreateExperiment}>
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
