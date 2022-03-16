import React, { useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { createMetric } from '../actions/metricActions';

const NewMetricForm = () => {
  const { id } = useParams();
  const isNew = id === 'new';
  console.log("is new: ", isNew);
  // origMetric will be undefined for "Create New"
  const origMetric = useSelector(state => state.metrics.find(metric => metric.id === Number(id)));
  const [ name, setName ] = useState(origMetric ? origMetric.name : '');
  const [ type, setType ] = useState(origMetric ? origMetric.type : '');
  const [ query, setQuery ] = useState(origMetric ? origMetric.query_string : '');
  const dbName = useSelector(state => state.dbName);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onTypeSelection = (e) => {
    setType(e.target.value);
  };

  const resetForm = () => {
    setName('');
    setType('');
    setQuery('');
  }

  const validateInputs = () => {
    if (!dbName) {
      alert("Please set up your database connection first before creating a metric.");
      return false;
    }
    setQuery(query.trim());
    if (name.length === 0 || type === '' || query === '') {
      alert("Please check your inputs and try again.");
      return false;
    }
    if (query[query.length - 1] === ';') {
      alert("Semicolons not allowed, please remove and try again.");
      return false;
    }
    return true;
  };

  const handleCancel = (e) => {
    navigate('/metrics');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (validateInputs()) {
      const success = await dispatch(createMetric({ name, type, query_string: query }));
      if (success) {
        resetForm();
        navigate('/metrics');
      }
    }
  };

  return (
  <div className="w-full py-2.5 px-12">
    <h2 className="text-3xl font-bold text-primary-violet my-3">{isNew ? "New Metric" : "Edit Metric"}</h2>
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
        <button onClick={handleCancel} className="btn bg-slate">Cancel</button>
      </div>
    </form>
  </div>
  );
};

export default NewMetricForm;