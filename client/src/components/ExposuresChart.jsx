import React from 'react';
import Chart from "react-apexcharts";

const ExposuresChart = ({ id }) => {
  const series = [{ name: "exposures", data: [5, 10, 20, 35, 50, 70] }];
  const chartOptions = {
    chart: { id },
    xaxis: {
      categories: ['2022-03-09', '2022-03-10', '2022-03-11', '2022-03-12', '2022-03-13', '2022-03-14']
    },
    title: { text: "Exposures to Experiment Over Time" },
    colors: ['#07C0C5']
  };

  return (
    <div className="m-5">
      <Chart
        options={chartOptions}
        series={series}
        type="line"
        width="400"
      />
    </div>
  );
};

export default ExposuresChart;