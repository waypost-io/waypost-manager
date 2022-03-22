import React, { useState } from "react";
import EditExperimentForm from "../forms/EditExperimentForm";
import ExposuresChart from "./ExposuresChart";
import ExperimentResults from "./ExperimentResults";

const ExperimentInfo = ({ data, allMetrics }) => {
  const { id, name, description, duration, date_started, date_ended, metrics } =
    data;
  const [isEditing, setIsEditing] = useState(false);
  const startDate = new Date(date_started).toLocaleDateString("en-US");
  const endDate = date_ended
    ? new Date(date_ended).toLocaleDateString("en-US")
    : "Present";
  const metricsNames = metrics
    .map((metric) => {
      return allMetrics.find((m) => m.id === metric.metric_id).name;
    })
    .join(", ");

  return (
    <div className="rounded p-5 mt-3 mb-16 shadow-xl border-2 border-slate">
      {!isEditing ? (
        <div className="flex flex-col items-center">
          <div className="flex justify-between items-center w-full">
            <h2 className="text-primary-violet text-lg">
              Experiment from <span className="font-bold">{startDate}</span> to <span className="font-bold">{endDate}</span>
            </h2>
            {!date_ended && (
              <button
                className="bg-slate hover:bg-slateDark text-primary-offwhite rounded-lg py-1.5 px-6 ml-2"
                type="button"
                onClick={() => setIsEditing(true)}
              >
                Edit Experiment
              </button>
            )}
          </div>
          <div className="w-full p-8 m-5 border-b border-b-slateLight">
            <div>
              <div className="inline-block w-1/2 text-right pr-10">ID:</div>
              <span className="font-bold">{id}</span>
            </div>
            {name && (
              <div>
                <div className="inline-block w-1/2 text-right pr-10">Name:</div>
                <span className="font-bold">{name}</span>
              </div>
            )}
            <div>
              <div className="inline-block w-1/2 text-right pr-10">Duration:</div>
              <span className="font-bold">{duration + " days"}</span>
            </div>
            {description && (
              <div>
                <div className="inline-block w-1/2 text-right pr-10">Description:</div>
                <span className="font-bold">{description}</span>
              </div>
            )}
            <div>
              <div className="inline-block w-1/2 text-right pr-10">Metrics measured:</div>
              <span className="font-bold">{metricsNames}</span>
            </div>
          </div>
          <ExposuresChart id={id} />
          <ExperimentResults id={id} />
        </div>
      ) : (
        <EditExperimentForm
          setIsEditing={setIsEditing}
          allMetrics={allMetrics}
          {...data}
        />
      )}
    </div>
  );
};

export default ExperimentInfo;
