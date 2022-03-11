import React from 'react';

const ExperimentInfo = ({ id, date_started, date_ended }) => {
  const startDate = new Date(date_started).toDateString();
  const endDate = date_ended ? new Date(date_ended).toDateString() : "Present";
  return (
    <div>
      <h2 className="section-title">Experiment from {startDate} to {endDate}</h2>
      <p>This experiment's ID is: {id}</p>
      <p>Details about experiment, charts and stats go here</p>
    </div>
  );
};

export default ExperimentInfo;