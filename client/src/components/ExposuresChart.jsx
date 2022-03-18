import React from 'react';
import Chart from "react-apexcharts";
import { useSelector } from "react-redux";

const ExposuresChart = ({ id }) => {
  const exptData = useSelector((state) => state.experiments.find(expt => expt.id === id));
  if (!exptData.exposuresControl || !exptData.exposuresTest) {
    return <p>No exposures yet</p>;
  }

  let controlDates  = Object.keys(exptData.exposuresControl).sort();;
  let testDates = Object.keys(exptData.exposuresTest).sort();;
  let controlVals = controlDates.map(date => exptData.exposuresControl[date]);;
  let testVals = testDates.map(date => exptData.exposuresTest[date]);;

  const series = [
    { name: "control", data: controlVals },
    { name: "test", data: testVals }
  ];
  const chartOptions = {
    chart: { id },
    xaxis: {
      categories: controlDates.map(date => new Date(date).toLocaleDateString('en-US'))
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