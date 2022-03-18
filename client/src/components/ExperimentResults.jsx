import React from 'react';
import Chart from "react-apexcharts";
import { useDispatch } from "react-redux";
import { updateStats } from '../actions/exptActions';

const ExperimentResults = ({ id }) => {
  const dispatch = useDispatch();

  const handleRefreshResults = () => {
    dispatch(updateStats(id));
  };

  return (
    <div>
      <div>
        <h3 className="text-xl font-bold text-center">Results</h3>
        <button onClick={handleRefreshResults} className="btn bg-primary-violet">Refresh Results</button>
      </div>

    </div>
  );
};

export default ExperimentResults;