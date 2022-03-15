import React from 'react';

const MetricsItem = ({ id, name, query_string, type }) => {
  return (
    <div className="border border-slate my-5 p-5">
      <p className="text-lg font-bold">{name}</p>
      <p>Type: {type}</p>
    </div>
  );
}

export default MetricsItem;