import React from 'react';
import { useSelector, useDispatch } from "react-redux";
import { updateStats } from '../actions/exptActions';
import MetricResultRow from './MetricResultRow';

const ExperimentResults = ({ id }) => {
  const metrics = useSelector((state) => state.experiments.find(expt => expt.id === id).metrics);
  console.log(metrics);
  const hasResult = metrics.find(metric => metric.p_value !== null);
  const dispatch = useDispatch();

  const handleRefreshResults = () => {
    dispatch(updateStats(id));
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-center">Results</h3>
        <button onClick={handleRefreshResults} className="btn bg-primary-violet">Refresh Results</button>
      </div>
      {hasResult && (
        <table className="w-full border border-primary-slate">
          <thead>
            <tr>
              <th>Metric</th>
              <th>Control Group Avg</th>
              <th>Test Group Avg</th>
              <th>P-Value</th>
              <th>Percent Difference Confidence Interval</th>
            </tr>
          </thead>
          <tbody >
            {metrics.map(metric => <MetricResultRow key={metric.metric_id} { ...metric } />)}
          </tbody>
        </table>
      )}
      {!hasResult && <p>No results to see yet! Click <span className="italic">Refresh Results</span> after there is sufficient sample size and the experiment has been running for enough time.</p>}
    </div>
  );
};

export default ExperimentResults;