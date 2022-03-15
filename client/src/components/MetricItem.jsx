import React from 'react';
import { useDispatch } from "react-redux";
import { editMetric, deleteMetric } from '../actions/metricActions';

const MetricsItem = ({ id, name, query_string, type }) => {
  const dispatch = useDispatch();

  const handleEditMetric = () => {
    const updates = {};
    dispatch(editMetric(id, updates));
  };

  const handleDeleteMetric = () => {
    dispatch(deleteMetric(id));
  };

  return (
    <div className="flex justify-between items-center border border-primary-black rounded my-5 p-5">
      <div>
        <p className="text-lg font-bold">{name}</p>
        <p>Type: {type}</p>
      </div>
      <div>
        <button onClick={handleEditMetric} className="border border-primary-violet text-primary-black rounded py-2 px-5 hover:text-primary-violet mr-2">Edit</button>
        <button onClick={handleDeleteMetric} className="border border-primary-violet text-primary-black rounded py-2 px-5 hover:text-primary-violet">Delete</button>
      </div>
    </div>
  );
}

export default MetricsItem;