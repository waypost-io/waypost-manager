import React, { useState } from 'react';
import EditExperiment from "./EditExperiment";

const ExperimentInfo = ({ data }) => {
  const { id, name, description, duration, date_started, date_ended } = data;
  const [isEditing, setIsEditing] = useState(false);
  const startDate = new Date(date_started).toLocaleDateString("en-US");
  const endDate = date_ended ? new Date(date_ended).toLocaleDateString("en-US") : "Present";

  return (
    <div className="border border-dashed border-primary-oxfordblue rounded p-5 my-4">
      {!isEditing ? (
        <>
          <div className="flex justify-between items-center w-full">
            <h2 className="text-primary-violet text-lg">Experiment from {startDate} to {endDate}</h2>
            {!date_ended && <button className="bg-primary-turquoise text-primary-offwhite rounded-lg py-1.5 px-6 ml-2" type="button" onClick={() => setIsEditing(true)}>Edit Experiment</button>}
          </div>
          <p>ID: <span className="font-bold">{id}</span></p>
          <p>Name: <span className="font-bold">{name}</span></p>
          <p>Duration: <span className="font-bold">{duration + " days"}</span></p>
          <p>Description: <span className="font-bold">{description}</span></p>
          <p>Details about experiment analysis, charts and stats go here</p>
        </>
    ) : (
      <>
        <EditExperiment setIsEditing={setIsEditing} {...data}/>
      </>
    )
      }

    </div>
  );
};

export default ExperimentInfo;
