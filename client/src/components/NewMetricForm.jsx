import React, { useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { createMetric, editMetric } from '../actions/metricActions';

const LABEL_CSS = "inline-block w-1/3 text-center mr-5";
const INPUT_ELEM_CSS = "border border-slate rounded-lg p-2";

const NewMetricForm = () => {
  const { id } = useParams();
  const isNew = id === 'new';
  // origMetric will be undefined for "Create New"
  const origMetric = useSelector(state => state.metrics.find(metric => metric.id === Number(id)));
  const [ name, setName ] = useState(origMetric ? origMetric.name : '');
  const [ type, setType ] = useState(origMetric ? origMetric.type : '');
  const [ query, setQuery ] = useState(origMetric ? origMetric.query_string : '');
  const metrics = useSelector(state => state.metrics);
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
    const existingNames = metrics.filter(metric => metric.id !== Number(id)).map(metric => metric.name);
    if (existingNames.includes(name)) {
      alert("Name must be unique");
      return false;
    }
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
    let success;
    setQuery(query.trim());
    if (validateInputs()) {
      const fields = { name, type, query_string: query };
      if (isNew) {
        success = await dispatch(createMetric(fields));
      } else {
        success = await dispatch(editMetric(id, fields));
      }

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
          <label htmlFor="metric-name" className={LABEL_CSS}>Name: </label>
          <input id="metric-name" type="text" value={name} onChange={(e) => setName(e.target.value)} className={INPUT_ELEM_CSS} />
        </div>
        <div className="mt-2.5 flex items-center">
          <label className={LABEL_CSS}>Type: </label>
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
            <label htmlFor="metric-query" className={LABEL_CSS}>
              <p>Query to retrieve data:</p>
              <p className="text-sm italic">Do not include semicolon.</p>
              <p className="text-sm italic">If the metric is a <span className="font-bold">Binomial</span> type, the query should result in <code>user_id</code> and <code>timestamp</code> columns.</p>
              <p className="text-sm italic">The query should result in <code>user_id</code>, <code>timestamp</code>, and <code>value</code> columns for all other types.</p>
            </label>
            <textarea id="metric-query" rows={6} cols={35} value={query} onChange={(e) => setQuery(e.target.value)} className={INPUT_ELEM_CSS} />
          </div>
        </div>
      <div>
        <button onClick={handleSave} className="btn bg-primary-turquoise hover:bg-primaryDark-turquoise  m-4">Save Changes</button>
        <button onClick={handleCancel} className="btn bg-slate hover:bg-slateDark m-4">Cancel</button>
      </div>
    </form>
  </div>
  );
};

export default NewMetricForm;
