import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFlags, toggleFlag, toggleExperiment } from "../actions/flagActions";
import { fetchExperiments } from "../actions/exptActions";
import { useParams, useNavigate } from "react-router-dom";
import EditFlagForm from "./EditFlagForm";
import ExperimentInfo from "./ExperimentInfo";

const FlagDetailsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { flagId } = useParams();
  const flagData = useSelector((state) =>
    state.flags.find((flag) => flag.id === +flagId)
  );
  const exptData = useSelector((state) => state.experiments);
  const [flagFetched, setFlagFetched] = useState(false);
  const [exptsFetched, setExptsFetched] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!flagFetched) {
      dispatch(fetchFlags());
      setFlagFetched(true);
    }
  }, [dispatch, flagId, flagFetched]);

  useEffect(() => {
    if (!exptsFetched) {
      dispatch(fetchExperiments(flagId));
      setExptsFetched(true);
    }
  }, [dispatch, flagId, exptsFetched]);

  const handleEditFlag = () => {
    setIsEditing(true);
  };

  const handleCreateExperiment = (e) => {
    e.preventDefault();
    let path = `/flags/${flagId}/create_experiment`;
    navigate(path);
  };

  const handleStopExperiment = () => {
    dispatch(toggleExperiment(flagId, false));
  };

  const handleToggle = (id) => {
    return (e) => {
      dispatch(toggleFlag(id, e.target.checked));
    };
  };

  if (!flagData) return null;
  return (
    <div className="py-5 px-8 w-full">
      <div className="flex justify-between items-center border-b border-b-primary-oxfordblue mb-5">
        <div className="flex items-center">
          <h1 className="inline font-bold text-xl text-primary-violet">
            {flagData.name}
          </h1>
          <label className="toggle mx-5">
            <input
              type="checkbox"
              defaultChecked={flagData.status ? true : false}
              onChange={handleToggle(flagId)}
            />
            <span className="slider round"></span>
          </label>
        </div>
        <div>
          {!isEditing && (
            <button
              className="btn bg-primary-turquoise"
              onClick={handleEditFlag}
            >
              Edit
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
        <EditFlagForm setIsEditing={setIsEditing} />
      )}
      {exptData &&
        exptData.map((expt) => {
          return <ExperimentInfo key={expt.id} {...expt} />;
        })}
    </div>
  );
};

export default FlagDetailsPage;
