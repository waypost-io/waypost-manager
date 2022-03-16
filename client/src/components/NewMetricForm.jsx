import React, { useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { createMetric } from '../actions/metricActions';

const NewMetricForm = ({ setIsEditing }) => {
  const dbName = useSelector(state => state.dbName);
  const [ name, setName ] = useState('');
  const [ type, setType ] = useState('');
  const [ query, setQuery ] = useState('');
  const dispatch = useDispatch();

  const onTypeSelection = (e) => {
    setType(e.target.value);
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (!dbName) {
      alert("Please set up your database connection first before creating a metric.");
      return;
    }
    dispatch(createMetric({ name, type, query_string: query }));
    setName('');
    setType('');
    setQuery('');
    setIsEditing(false);
  };

  return (
  <div>
    <h2 className="text-xl font-bold border-b border-b-primary-black">New Metric</h2>
    <form className="flex flex-col items-center">
      <div>
        <div className="mt-2.5">
          <label htmlFor="metric-name" className="inline-block w-1/3 text-right mr-5">Name: </label>
          <input id="metric-name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="border border-slate rounded-lg p-2"/>
        </div>
        <div className="mt-2.5 flex items-center">
          <label className="inline-block w-1/3 text-right mr-5">Type: </label>
            <ul className="inline-block">
              <li>
                <input type="radio" id="binomial" name="metric-type" value="binomial" checked={type === "binomial"} onChange={onTypeSelection} />
                <label htmlFor="binomial" className="inline-block pl-2">Binomial</label>
              </li>
              <li>
                <input type="radio" id="count" name="metric-type" value="count" checked={type === "count"} onChange={onTypeSelection} />
                <label htmlFor="count" className="inline-block pl-2">Count</label>
              </li>
              <li>
                <input type="radio" id="duration" name="metric-type" value="duration" checked={type === "duration"} onChange={onTypeSelection} />
                <label htmlFor="duration" className="inline-block pl-2">Duration</label>
              </li>
              <li>
                <input type="radio" id="revenue" name="metric-type" value="revenue" checked={type === "revenue"} onChange={onTypeSelection} />
                <label htmlFor="revenue" className="inline-block pl-2">Revenue</label>
              </li>
            </ul>
          </div>
          <div className="mt-2.5 flex items-center">
            <label htmlFor="metric-query" className="inline-block w-1/3 text-center mr-5">
              <p>Query to retrieve data:</p>
              <p className="text-sm italic">Do not include semicolon. Query should result in <code>user_id</code>, <code>timestamp</code>, and <code>value</code> columns</p>
            </label>
            <textarea id="metric-query" rows={6} cols={35} value={query} onChange={(e) => setQuery(e.target.value)} className="border border-slate rounded-lg p-2" />
          </div>
        </div>
      <div>
        <button onClick={handleSave} className="btn bg-primary-turquoise">Save Changes</button>
        <button onClick={() => setIsEditing(false)} className="btn bg-slate">Cancel</button>
      </div>
    </form>
  </div>
  );
};

export default NewMetricForm;