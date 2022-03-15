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
  // const metrics = useSelector((metrics) => state.metrics);
  // const [metricsFetched, setMetricsFetched] = useState(false);
  const metrics = [
    { id: 1, name: "Created Account", query_string: "", type: "binomial"},
    { id: 2, name: "Time on site", query_string: "", type: "count"}
  ]

  useEffect(() => {
    if (!flagFetched) {
      dispatch(fetchFlags());
      setFlagFetched(true);
    }
  }, [dispatch, flagId, flagFetched]);

  // useEffect(() => {
  //   if (!metricsFetched) {
  //     dispatch(fetchMetrics());
  //     setMetricsFetched(true);
  //   }
  // }, [dispatch, metrics, metricsFetched]);

  if (!flagData) return null;
  // if (!flagData || !metrics) return null;
  return (
    <div className="ml-5 mt-5 w-full">
      <h1 className="text-xl font-bold text-primary-oxfordblue">Create an Experiment</h1>
      <h3>This experiment will be on <strong>{`${flagData.name}`}</strong></h3>
      <NewExperimentForm metrics={metrics}/>
    </div>
  );
};

export default NewExperimentPage;
