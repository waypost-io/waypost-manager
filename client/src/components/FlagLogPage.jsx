import React, { useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { fetchLog } from '../actions/logActions';

const LogItem = ({ id, flag_id, event_type, timestamp }) => {
  return (
    <tr>
      <td className="font-bold">{flag_id}</td>
      <td>{event_type}</td>
      <td>{timestamp}</td>
    </tr>
  );
};


const FlagLogPage = () => {
  const logItems = useSelector(state => state.flagLog);
  console.log(logItems);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchLog());
  }, [dispatch]);

  return (
    <div className="w-full p-12">
      <h2 className="text-3xl font-bold text-primary-violet">Event Log</h2>
      <table className="w-full shadow-md mt-5">
          <thead className="bg-primary-black text-primary-offwhite">
            <tr>
              <th>Flag Name</th>
              <th>Event Type</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody >
            {logItems && logItems.map(event => <LogItem key={event.id} {...event} />)}
          </tbody>
        </table>
    </div>
  );
};

export default FlagLogPage;