import React from "react";
import IntervalChart from './IntervalChart';

const MetricResultRow = ({
  metric_id,
  name,
  type,
  mean_control,
  mean_test,
  p_value,
  interval_start,
  interval_end,
}) => {
  const formatNum = (type, num) => {
    if (type === "revenue") {
      return `$${num.toFixed(2)}`;
    }
    if (type === "binomial") {
      return `${(num * 100).toFixed(2)}%`;
    }
    return num.toFixed(2);
  };

  return (
    <tr key={metric_id}>
      <td className="font-bold">{name}</td>
      <td>{mean_control ? formatNum(type, mean_control) : "No data yet"}</td>
      <td>{mean_test ? formatNum(type, mean_test) : "No data yet"}</td>
      {p_value &&
        (p_value < 0.05 ? (
          <td>
            <p className="font-bold text-primary-turquoise">Significant</p>
            <p>{p_value.toFixed(4)}</p>
          </td>
        ) : (
          <td>
            <p>Not significant</p>
            <p>{p_value.toFixed(4)}</p>
          </td>
        ))}
      {p_value === undefined && (
        <td>
          <p>No data yet</p>
        </td>
      )}
      <td>
        {interval_start ? (
          <IntervalChart metric_id={metric_id} interval_start={interval_start} interval_end={interval_end} />
        ) : (
          <p>N/A</p>
        )}
      </td>
    </tr>
  );
};

export default MetricResultRow;
