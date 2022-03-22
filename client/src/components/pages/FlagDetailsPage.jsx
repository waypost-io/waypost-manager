import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFlags, toggleFlag, editFlag } from "../../actions/flagActions";
import { fetchExperiments, editExperiment } from "../../actions/exptActions";
import { fetchAssignmentsOnFlag } from "../../actions/cAssignmentActions";
import { fetchMetrics } from "../../actions/metricActions";
import { useParams, useNavigate } from "react-router-dom";
import EditFlagForm from "../forms/EditFlagForm";
import ExperimentInfo from "../experiments/ExperimentInfo";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';

const FlagDetailsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { flagId } = useParams();
  const flagData = useSelector((state) =>
    state.flags.find((flag) => flag.id === +flagId)
  );
  const exptData = useSelector((state) => state.experiments);
  const metricData = useSelector((state) => state.metrics);
  const cAssignmentData = useSelector((state) => state.customAssignments[flagId]);
  console.log("custom assignments on flag", cAssignmentData);
  const [alwaysOn, setAlwaysOn] = useState([]);
  const [alwaysOff, setAlwaysOff] = useState([]);
  const [showCAssignments, setShowCAssignments] = useState(false);
  const [cAssignmentsFetched, setCAssignmentsFetched] = useState(false);
  const [flagFetched, setFlagFetched] = useState(false);
  const [exptsFetched, setExptsFetched] = useState(false);
  const [metricsFetched, setMetricsFetched] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!cAssignmentsFetched) {
      dispatch(fetchAssignmentsOnFlag(flagId));
      setCAssignmentsFetched(true);
    }
  }, [dispatch, cAssignmentsFetched])

  useEffect(() => {
    if (cAssignmentData) {
      setAlwaysOn(Object.keys(cAssignmentData).filter((userId) => cAssignmentData[userId]))
      setAlwaysOff(Object.keys(cAssignmentData).filter((userId) => !cAssignmentData[userId]))
    }
  }, [dispatch, cAssignmentData])

  useEffect(() => {
    if (!flagFetched) {
      dispatch(fetchFlags());
      setFlagFetched(true);
    }
  }, [dispatch, flagId, flagFetched]);

  useEffect(() => {
    if (!metricsFetched) {
      dispatch(fetchMetrics());
      setMetricsFetched(true);
    }
  }, [dispatch, metricsFetched]);

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

  const handleStopExperiment = (e) => {
    e.preventDefault();
    const runningExptId = exptData.find(expt => expt.date_ended === null).id;
    dispatch(editFlag(flagId, { is_experiment: false}));
    dispatch(editExperiment(runningExptId, { date_ended: true}));
  };

  const handleToggle = (id) => {
    return (e) => {
      dispatch(toggleFlag(id, e.target.checked));
    };
  };

  if (!flagData || !exptData || !metricData) return null;
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
              className="btn bg-slate hover:bg-slateDark m-5"
              onClick={handleEditFlag}
            >
              Edit Flag
            </button>
          )}
          {flagData.is_experiment ? (
            <>
              <button
                className="btn bg-primary-violet hover:bg-primaryDark-violet m-5"
                onClick={handleStopExperiment}
              >
                Stop Experiment
              </button>
            </>
          ) : (
            <button
              className="btn bg-primary-turquoise hover:bg-primaryDark-turquoise m-5"
              onClick={handleCreateExperiment}
            >
              Create an experiment
            </button>
          )}
        </div>
      </div>
      {!isEditing ? (
        <div className="p-3 m-2">
          {flagData.name && (
            <div>
              <div className="inline-block w-1/2 text-right pr-10">Name:</div>
              <span className="font-bold">{flagData.name}</span>
            </div>
          )}
          {flagData.description && (
            <div>
              <div className="inline-block w-1/2 text-right pr-10">Description:</div>
              <span className="font-bold">{flagData.description}</span>
            </div>
          )}
          <div>
            <div className="inline-block w-1/2 text-right pr-10">Current Status:</div>
            <span className="font-bold">{flagData.status ? "On" : "Off"}</span>
          </div>
          <div>
            <div className="inline-block w-1/2 text-right pr-10">Rollout percentage:</div>
            <span className="font-bold">{flagData.percentage_split}%</span>
          </div>
          {cAssignmentData &&
          <div>
            {!showCAssignments ? (
              <button
                type="button"
                className="inline-block w-1/2 text-right pr-10 text-primary-oxfordblue ml-6 hover:text-primary-violet"
                onClick={() => setShowCAssignments(true)}
              >
                Show Custom Assignments <FontAwesomeIcon icon={faCaretDown} />
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="inline-block w-1/2 text-right pr-10 text-primary-oxfordblue ml-6 hover:text-primary-violet"
                  onClick={() => setShowCAssignments(false)}
                >
                  Hide Custom Assignments <FontAwesomeIcon icon={faCaretUp} />
                </button>
                <div className="inline-block w-1/2 text-right pr-10">Always on for user IDs:</div>
                <span className="font-bold">{alwaysOn.join(", ")}</span>
                <div className="inline-block w-1/2 text-right pr-10">Always off for user IDs:</div>
                <span className="font-bold">{alwaysOff.join(", ")}</span>
              </>
            )}

          </div>}
        </div>
      ) : (
        <EditFlagForm setIsEditing={setIsEditing} />
      )}
      {exptData &&
        exptData.map((expt) => {
          return <ExperimentInfo key={expt.id} allMetrics={metricData} data={expt} />;
        })}
    </div>
  );
};

export default FlagDetailsPage;
