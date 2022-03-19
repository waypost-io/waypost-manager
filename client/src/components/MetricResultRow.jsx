import React from 'react';
import Chart from "react-apexcharts";

const MetricResultRow = ({ metric_id, name, type, mean_control, mean_test, p_value, interval_start, interval_end }) => {
  const formatNum = (type, num) => {
    if (type === 'revenue') {
      return `$${num.toFixed(2)}`
    }
    if (type === 'binomial') {
      return `${(num * 100).toFixed(2)}%`;
    }
    return num.toFixed(2);
  };

  const chartOptions = {
    chart: {
      id: metric_id,
      toolbar: {
        show: false
      },
    },
    colors: ['#07C0C5', '#B94E9C'],
    plotOptions: {
      bar: {
        horizontal: true,
      }
    },
    yaxis: {
      decimalsInFloat: 2,
      min: (Math.floor(interval_start * 100) > 0) ? -1 : (Math.floor(interval_start * 100) - 5),
      max: (Math.floor(interval_end * 100) < 0) ? 1 : (Math.floor(interval_end * 100) + 5),
      // labels: {
      //   formatter: function(val, index) { return `${val}%` }
      // }
    },
    xaxis: {
      type: 'numeric',
      tickAmount: 3,
      labels: {
        hideOverlappingLabels: true,
        formatter: function(val, index) { return `${Math.floor(val)}%` }
      }
    },
    annotations: {
      xaxis: [{
        x: 0,
        borderColor: '#B94E9C'
      }],
    },
    tooltip: {
      x: {
        formatter: function(val, opt) { return `${Math.floor(val)}%` }
      }
    }
  };

  const series = [{
    data: [
      { x: 'Change', y: [interval_start * 100, interval_end * 100] }
    ]
  }];

  return (
    <tr key={metric_id}>
      <td className="font-bold">{name}</td>
      <td>{formatNum(type, mean_control)}</td>
      <td>{formatNum(type, mean_test)}</td>
      {p_value < 0.05 ? (
        <td><p className="font-bold text-primary-turquoise">Significant</p>{p_value.toFixed(4)}</td>
      ) : (
        <td><p>Not significant</p>{p_value.toFixed(4)}</td>
      )}
      <td>
        {interval_start ? (
          <div>
            <Chart options={chartOptions}
              series={series}
              type="rangeBar"
              width="300"
              height="100"
            />
          </div>
        ) : (
          <p>No interval for binomial metrics</p>
        )}
      </td>
    </tr>
  );
};

export default MetricResultRow;