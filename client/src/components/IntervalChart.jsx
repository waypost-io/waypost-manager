import React from 'react';
import Chart from "react-apexcharts";

const IntervalChart = ({ metric_id, interval_start, interval_end }) => {
  const chartOptions = {
    chart: {
      id: metric_id,
      toolbar: {
        show: false,
      }
    },
    colors: ["#07C0C5", "#B94E9C"],
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    yaxis: {
      decimalsInFloat: 2,
      min:
        Math.floor(interval_start * 100) > 0
          ? -1
          : Math.floor(interval_start * 100) - 5,
      max:
        Math.floor(interval_end * 100) < 0
          ? 1
          : Math.floor(interval_end * 100) + 5
    },
    xaxis: {
      type: "numeric",
      tickAmount: 3,
      labels: {
        hideOverlappingLabels: true,
        formatter: function (val, index) {
          return `${Math.floor(val)}%`;
        },
      },
    },
    annotations: {
      xaxis: [
        {
          x: 0,
          borderColor: "#B94E9C",
        },
      ],
    },
    tooltip: {
      x: {
        formatter: function (val, opt) {
          return `${Math.floor(val)}%`;
        },
      },
    },
  };

  const series = [
    {
      data: [{ x: "Change", y: [interval_start * 100, interval_end * 100] }],
    },
  ];

  return (
    <div>
      <Chart
        options={chartOptions}
        series={series}
        type="rangeBar"
        width="300"
        height="100"
      />
    </div>
  )
};

export default IntervalChart;