import React from "react";

const MetricCheckbox = ({ name, id, selected, handleClick }) => {
  const bgColor = selected ? "violet" : "offwhite";
  const txtColor = selected ? "offwhite" : "black";
  const borderColor = selected ? "border-primary-violet" : "border-slate";

  return (
    <>
      <input className="invisible" type="checkbox" name="metric" id={name} value={id} required />
      <label onClick={handleClick} className={`border ${borderColor} shadow-md bg-primary-${bgColor} text-primary-${txtColor} font-bold rounded-lg py-1 px-2 hover:cursor-pointer`} htmlFor={name}>
        <div>{name}</div>
      </label>
    </>
  )
}

export default MetricCheckbox;
