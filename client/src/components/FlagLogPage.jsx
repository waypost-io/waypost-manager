import React, { useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { fetchLog } from '../actions/logActions';

const LogItem = () => {
  return (
    <div className="flex justify-between p-5 border-b border-b-primary-oxfordblue">

    </div>
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
      {logItems && logItems.map(event => <LogItem {...event} />)}
    </div>
  );
};

export default FlagLogPage;