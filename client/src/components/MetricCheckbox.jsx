import React from "react";

const MetricCheckbox = ({ name, id, selected, handleClick }) => {
  const bgColor = selected ? "violet" : "offwhite";
  const txtColor = selected ? "offwhite" : "black";
  return (
    <>
      <input className="invisible" type="checkbox" name="metric" id={name} value={id} required />
      <label onClick={handleClick} className={`border-2 border-black bg-primary-${bgColor} text-primary-${txtColor} font-bold rounded-lg py-1 px-2`} htmlFor={name}>
        <div>{name}</div>
      </label>
    </>
  )
}

export default MetricCheckbox;
