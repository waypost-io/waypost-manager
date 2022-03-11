import React from 'react';

const ExperimentInfo = ({ id, date_started, date_ended }) => {
  const startDate = new Date(date_started).toLocaleDateString("en-US");
  const endDate = date_ended ? new Date(date_ended).toLocaleDateString("en-US") : "Present";

  return (
    <div>
      <h2 className="text-primary-violet mt-8">Experiment from {startDate} to {endDate}</h2>
      <p>This experiment's ID is: <span className="font-bold">{id}</span></p>
      <p>Details about experiment, charts and stats go here</p>
    </div>
  );
};

export default ExperimentInfo;