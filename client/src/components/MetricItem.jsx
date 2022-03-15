import React from 'react';

const MetricsItem = ({ id, name, query_string, type }) => {
  return (
    <div className="flex justify-between items-center border border-primary-black rounded my-5 p-5">
      <div>
        <p className="text-lg font-bold">{name}</p>
        <p>Type: {type}</p>
      </div>
      <div>
        <button className="bg-primary-violet text-primary-offwhite rounded py-2 px-5 block mb-2">Edit</button>
        <button className="hover:text-primary-violet">Delete</button>
      </div>
    </div>
  );
}

export default MetricsItem;