import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchLog } from "../actions/logActions";

const LogItem = ({ id, flag_name, event_type, timestamp }) => {
  const eventDate = new Date(timestamp);

  return (
    <tr>
      <td>{flag_name}</td>
      <td>{event_type}</td>
      <td>{eventDate.toLocaleString()}</td>
    </tr>
  );
};

const FlagLogPage = () => {
  const logItems = useSelector((state) => state.flagLog);
  const flagNames = logItems
    .map((event) => event.flag_name)
    .filter((elem, idx, arr) => arr.indexOf(elem) === idx);
  const [filteredFlag, setFilteredFlag] = useState("all");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchLog());
  }, [dispatch]);

  const handleSelect = (e) => {
    setFilteredFlag(e.target.value);
  };

  if (!logItems) return null;

  return (
    <div className="w-full p-12">
      <h2 className="text-3xl font-bold text-primary-violet">Event Log</h2>
      <div>
        <span className="mr-5">Filter for events by flag name:</span>
        <select
          onChange={handleSelect}
          className="border border-slate rounded p-2 my-3"
        >
          <option value="all">All Flags</option>
          {flagNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>
      <table className="w-full shadow-md mt-5">
        <thead className="bg-primary-black text-primary-offwhite">
          <tr>
            <th>Flag Name</th>
            <th>Event Type</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {logItems
            .filter((event) => {
              if (filteredFlag !== "all") {
                return event.flag_name === filteredFlag;
              } else {
                return true;
              }
            })
            .map((event) => (
              <LogItem key={event.id} {...event} />
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default FlagLogPage;
