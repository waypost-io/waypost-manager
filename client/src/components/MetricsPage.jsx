import React, { useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import MetricItem from './MetricItem';
import { fetchMetrics } from '../actions/metricActions';

const MetricsPage = () => {
  const dispatch = useDispatch();
  const metrics = useSelector(state => state.metrics);
  useEffect(() => {
    dispatch(fetchMetrics());
  }, [dispatch]);
  console.log(metrics);

  return (
    <div className="w-full py-2.5 px-12">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-primary-violet">Metrics</h2>
        <button
          className="btn bg-primary-turquoise"
          type="button"
          onClick={() => {}}
        >
          Create New
        </button>
      </div>
      {metrics.length > 0 &&
        metrics.map(metric => <MetricItem key={metric.id} {...metric} />)
      }
    </div>
  );
};

export default MetricsPage;