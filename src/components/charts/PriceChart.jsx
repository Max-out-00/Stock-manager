import React from 'react';
import { Chart } from "react-google-charts";

export default function PriceChart({ prices, labels, symbol }) {
  const data = [
    ["Time", "Price"],
    ...labels.map((time, i) => [time, prices[i]])
  ];

  const options = {
    title: `${symbol} Price Trend`,
    curveType: "function",
    legend: { position: "bottom" },
  };

  
  return (
    <div className="bg-white p-4 rounded shadow">
      <Chart
        chartType="LineChart"
        width="100%"
        height="400px"
        data={data}
        options={options}
      />
    </div>
  );
}

