import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFlags, toggleExperiment, editFlag } from '../actions/flagActions';
import { useParams } from "react-router-dom";
import ExperimentInfo from "./ExperimentInfo";
import apiClient from "../lib/ApiClient";

const FlagDetailsPage = () => {
  const dispatch = useDispatch();
  const { flagId } = useParams();
  const flagData = useSelector(state => state.find(flag => flag.id === Number(flagId)));
  // console.log("Flag: ", flagData);
  const [flagFetched, setFlagFetched] = useState(false);
  const [exptsFetched, setExptsFetched] = useState(false);
  const [exptData, setExptData] = useState(undefined);
  const [isEditing, setIsEditing] = useState(false);
  const [ newDescription, setNewDescription ] = useState('');
  const [ newPercent, setNewPercent ] = useState(0);

  useEffect(() => {
    if (!flagFetched) {
      dispatch(fetchFlags());
      setFlagFetched(true);
    }
  }, [dispatch, flagId, flagFetched]);

  useEffect(() => {
    apiClient.getExperiments(flagId, (data) => {
      setExptsFetched(true);
      setExptData(data);
    });
  }, [exptsFetched, flagId]);

  const handleEditFlag = () => {
    setIsEditing(true);
  };

  const handleSaveEdits = () => {
    // Validate inputs (percent must be between 0-100)
    console.log(newDescription);
    console.log(newPercent);
    // Call apiClient to make PUT request
    setIsEditing(false);
  };

  const handleCreateExperiment = (e) => {
    dispatch(toggleExperiment(flagId, true))
    setExptsFetched(false);
  };

  const handleStopExperiment = () => {
    dispatch(toggleExperiment(flagId, false));
  };

  if (!flagData) return null;
  return (
    <div className="py-5 px-8 w-full">
      <div className="flex justify-between items-center border-b border-b-primary-oxfordblue mb-5">
        <h1 className="font-bold text-xl text-primary-violet">
          {flagData.name}
        </h1>
        <div>
          {!isEditing ? (
            <button className="btn bg-primary-turquoise" onClick={handleEditFlag}>
              Edit
            </button>
          ) : (
            <button className="btn bg-primary-turquoise" onClick={handleSaveEdits}>
              Save Changes
            </button>
          )}
          {flagData.is_experiment ? (
            <>
              <button
                className="btn bg-primary-violet"
                onClick={handleStopExperiment}
              >
                Stop Experiment
              </button>
            </>
          ) : (
            <button
              className="btn bg-primary-turquoise"
              onClick={handleCreateExperiment}
            >
              Create an experiment
            </button>
          )}
        </div>
      </div>
      {!isEditing ? (
        <>
          <p>{flagData.description}</p>
          <p>
            Current Status:{" "}
            <span className="text-primary-violet font-bold">
              {flagData.status ? "On" : "Off"}
            </span>
          </p>
          <p>
            Rollout percentage:{" "}
            <span className="text-primary-violet font-bold">
              {flagData.percentage_split}%
            </span>
          </p>
        </>
      ) : (
        <form>
          <label htmlFor="new-description">Description: </label>
          <textarea id="new-description" type="textarea" rows="3" cols="30" value={newDescription} onChange={(e) => setNewDescription(e.target.value)} className="block border border-primary-oxfordblue rounded-lg px-2"  />
          <div className="mt-2.5 flex items-center">
            <label className="mr-2.5">Status: </label>
            <label className="toggle">
            <input
              type="checkbox"
              defaultChecked={flagData.status ? true : false}
              // onChange={handleToggle(id)}
            />
            <span className="slider round"></span>
            </label>
          </div>
          <div  className="mt-2.5">
            <label htmlFor="new-percent">Percent of Users Exposed: </label>
            <input id="new-percent" type="number" max={100} min={0} size="3" className="border border-primary-oxfordblue rounded-lg px-2" value={newPercent} onChange={(e) => setNewPercent(e.target.value)} /> %
          </div>
        </form>
      )}
      {exptData &&
        exptData.map((expt) => {
          return <ExperimentInfo key={expt.id} {...expt} />;
        })}
    </div>
  );
};

export default FlagDetailsPage;
