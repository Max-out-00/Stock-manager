import React from "react";
import { Chart } from "react-google-charts";

// Accepts volumes and labels via props; fallback to empty arrays
export default function VolumeChart({ volumes = [], labels = [], symbol }) {
  const data = [
    ["Time", "Volume"],
    ...labels.map((time, i) => [time, volumes[i] ?? 0])
  ];

  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold mb-2">{symbol ? `${symbol} Volume` : "Volume Chart"}</h2>
      <Chart
        chartType="ColumnChart"
        width="100%"
        height="400px"
        data={data}
      />
    </div>
  );
}
