import React from 'react';
import { useSelector, useDispatch } from "react-redux";
import MetricItem from './MetricItem';

const MetricsPage = () => {
  const dispatch = useDispatch();
  const metrics = useSelector(state => state.metrics);


  return (
    <div className="w-full py-2.5 px-12">
      <div className="flex justify-between items-center p-5">
        <h2 className="text-xl font-bold">Metrics</h2>
        <button
          className="btn bg-primary-turquoise"
          type="button"
          onClick={() => {}}
        >
          Create New
        </button>
      </div>
      {metrics.length > 0 &&
        metrics.map(metric => <MetricItem {...metric} />)
      }
    </div>
  );
};

export default MetricsPage;