import React, { useMemo, useEffect, useState } from "react";
import { Chart } from "react-google-charts";

// 🔗 Usage
// <VolumeChart volumes={volumeData} labels={timeLabels} symbol="AAPL" loading={false} />

export default function VolumeChart({ 
  volumes = [], 
  labels = [], 
  symbol,
  loading = false,
  error = null 
}) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Ensure google charts is loaded
    if (typeof window !== 'undefined' && window.google) {
      setIsReady(true);
    }
  }, []);

  const data = useMemo(() => {
    if (!volumes.length || !labels.length) {
      return [["Time", "Volume"]];
    }
    return [
      ["Time", "Volume"],
      ...labels.map((time, i) => [time, volumes[i] ?? 0])
    ];
  }, [volumes, labels]);

  const options = useMemo(() => ({
    title: symbol ? `${symbol} Volume Chart` : "Volume Chart",
    titleTextStyle: {
      fontSize: 16,
      bold: true,
      color: "#333"
    },
    legend: { position: "bottom" },
    hAxis: {
      title: "Time",
      titleTextStyle: { color: "#333", italic: false },
      slantedText: true,
      slantedTextAngle: 45
    },
    vAxis: {
      title: "Volume",
      titleTextStyle: { color: "#333", italic: false },
      minValue: 0
    },
    colors: ["#8b5cf6"],
    backgroundColor: "#f9fafb",
    chartArea: { width: "85%", height: "75%" },
    animation: {
      duration: 1000,
      easing: "out",
      startup: true
    }
  }), [symbol]);

  if (loading) {
    return (
      <div className="w-full p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading volume data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-8 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center gap-3">
          <span className="text-xl">⚠️</span>
          <div>
            <h3 className="font-semibold text-red-800">Error Loading Chart</h3>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data || data.length <= 1 || !volumes.length) {
    return (
      <div className="w-full p-8 text-center bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-gray-600">📊 No volume data available</p>
        <p className="text-sm text-gray-500 mt-2">Search for a stock to view its volume chart</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg shadow-sm p-4">
      {isReady ? (
        <Chart
          chartType="ColumnChart"
          width="100%"
          height="400px"
          data={data}
          options={options}
          loader={<div className="text-center py-8">Loading chart...</div>}
        />
      ) : (
        <div className="text-center py-8 text-gray-600">
          Initializing chart...
        </div>
      )}
    </div>
  );
}
