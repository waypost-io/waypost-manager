import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchFlags } from "../../actions/flagActions";
import { fetchMetrics } from "../../actions/metricActions";
import NewExperimentForm from '../forms/NewExperimentForm';

const NewExperimentPage = () => {
  const dispatch = useDispatch();
  const { flagId } = useParams();
  const flagData = useSelector((state) =>
    state.flags.find((flag) => flag.id === +flagId)
  );
  const [flagFetched, setFlagFetched] = useState(false);
  const metrics = useSelector((state) => state.metrics);
  const [metricsFetched, setMetricsFetched] = useState(false);

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
  }, [dispatch, metrics, metricsFetched]);

  if (!flagData || !metrics) return null;
  return (
    <div className="ml-5 my-5 w-full text-center">
      <h1 className="text-xl font-bold text-primary-violet">Create an Experiment</h1>
      <h3>This experiment will be on <strong>{`${flagData.name}`}</strong></h3>
      <NewExperimentForm metrics={metrics}/>
    </div>
  );
};

export default NewExperimentPage;
