import React, { useState } from 'react';
import Chart from "react-apexcharts";
import { useSelector, useDispatch } from "react-redux";
import { updateStats } from '../actions/exptActions';

const ExperimentResults = ({ id }) => {
  const metrics = useSelector((state) => state.experiments.find(expt => expt.id === id).metrics);
  console.log(metrics);
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
      {metrics.length > 0 && (
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
            {metrics.map(metric => {
              return (
                <tr key={metric.metric_id} className="border">
                  <td>{metric.name}</td>
                  <td>{metric.mean_control.toFixed(2)}</td>
                  <td>{metric.mean_test.toFixed(2)}</td>
                  <td>{metric.p_value.toFixed(4)}</td>
                  <td>
                    {metric.interval_start ? (
                      <div>
                        Chart: {(metric.interval_start * 100).toFixed(1)}% to {(metric.interval_end * 100).toFixed(1)}%
                      </div>
                    ) : (
                      <p>No interval for binomial metrics</p>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      {metrics.length === 0 && <p>No results yet. Click "Refresh Results" when ready.</p>}
    </div>
  );
};

export default ExperimentResults;