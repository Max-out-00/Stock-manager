import React from "react";
import { Chart } from "react-google-charts";

// 🔗 Usage
// <PriceChart prices={priceData} labels={timeLabels} symbol="AAPL" />

export default function PriceChart({ prices = [], labels = [], symbol }) {
  const data = [
    ["Time", "Price"],
    ...labels.map((time, i) => [time, prices[i] ?? 0])
  ];

  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold mb-2">{symbol ? `${symbol} Price` : "Price Chart"}</h2>
      <Chart
        chartType="ColumnChart"
        width="100%"
        height="400px"
        data={data}
      />
    </div>
  );
} 