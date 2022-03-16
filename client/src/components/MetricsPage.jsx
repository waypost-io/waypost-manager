import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import MetricItem from "./MetricItem";
import { fetchMetrics } from "../actions/metricActions";

const MetricsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const metrics = useSelector((state) => state.metrics);
  const dbName = useSelector((state) => state.dbName);
  const isConnected = dbName ? true : false;

  useEffect(() => {
    dispatch(fetchMetrics());
  }, [dispatch]);
  // console.log(metrics);

  const handleOpenNewMetricForm = () => {
    navigate("/edit_metric/new");
  };

  return (
    <div className="w-full py-2.5 px-12">
      {!isConnected && (
        <div className="font-bold rounded bg-secondary-pink p-5 mt-10">
          Note: Before you can create a metric, you must first set up the
          connection to your database in which your event data is stored.
        </div>
      )}
      <div className="flex justify-between items-center my-3">
        <h2 className="text-3xl font-bold text-primary-violet">Metrics</h2>
        <button
          className="btn bg-primary-turquoise"
          type="button"
          onClick={handleOpenNewMetricForm}
        >
          Create New
        </button>
      </div>
      <div>
        {metrics.length > 0 &&
          metrics.map((metric) => <MetricItem key={metric.id} {...metric} />)}
      </div>
    </div>
  );
};

export default MetricsPage;
