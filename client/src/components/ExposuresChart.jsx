import React from 'react';
import Chart from "react-apexcharts";

const ExposuresChart = ({ id }) => {
  const series = [
    { name: "control", data: [5, 10, 20, 35, 50, 70] },
    { name: "test", data: [6, 9, 19, 36, 51, 69] }
  ];
  const chartOptions = {
    chart: { id },
    xaxis: {
      categories: ['2022-03-09', '2022-03-10', '2022-03-11', '2022-03-12', '2022-03-13', '2022-03-14']
    },
    title: { text: "Total Exposures to Experiment (Sample Size)" },
    colors: ['#07C0C5', '#B94E9C'],
    stroke: {
      width: 1.5
    }
  };

  return (
    <div className="m-5">
      <Chart
        options={chartOptions}
        series={series}
        type="line"
        width="450"
      />
    </div>
  );
};

export default ExposuresChart;