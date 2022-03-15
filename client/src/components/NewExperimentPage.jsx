import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchFlags } from "../actions/flagActions";
import NewExperimentForm from './NewExperimentForm';

const NewExperimentPage = () => {
  const dispatch = useDispatch();
  const { flagId } = useParams();
  const flagData = useSelector((state) =>
    state.flags.find((flag) => flag.id === +flagId)
  );
  const [flagFetched, setFlagFetched] = useState(false);

  useEffect(() => {
    if (!flagFetched) {
      dispatch(fetchFlags());
      setFlagFetched(true);
    }
  }, [dispatch, flagId, flagFetched]);

  if (!flagData) return null;
  return (
    <div>
      <h1>Create an Experiment</h1>
      <h3>This experiment will be on <strong>{`${flagData.name}`}</strong></h3>
      <NewExperimentForm />
    </div>
  );
};

export default NewExperimentPage;
