import React, { useState } from 'react';
import Chart from "react-apexcharts";
import { useSelector, useDispatch } from "react-redux";
import { updateStats } from '../actions/exptActions';

const ExperimentResults = ({ id }) => {
  const [ results, setResults ] = useState();
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
      {results && (
          <div>

          </div>
        )}
        {!results && <p>No results yet. Click "Refresh Results" when ready.</p>}
    </div>
  );
};

export default ExperimentResults;