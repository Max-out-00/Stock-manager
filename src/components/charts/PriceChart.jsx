import React, { useMemo } from "react";
import { Chart } from "react-google-charts";

// 🔗 Usage
// <PriceChart prices={priceData} labels={timeLabels} symbol="AAPL" loading={false} />

export default function PriceChart({ 
  prices = [], 
  labels = [], 
  symbol,
  loading = false,
  error = null,
  showLineChart = false 
}) {
  const data = useMemo(() => {
    if (!prices.length || !labels.length) {
      return [["Time", "Price"]];
    }
    return [
      ["Time", "Price"],
      ...labels.map((time, i) => [time, prices[i] ?? 0])
    ];
  }, [prices, labels]);

  const options = useMemo(() => ({
    title: symbol ? `${symbol} Price Chart` : "Price Chart",
    titleTextStyle: {
      fontSize: 16,
      bold: true,
      color: "#333"
    },
    curveType: "function",
    legend: { position: "bottom" },
    hAxis: {
      title: "Time",
      titleTextStyle: { color: "#333", italic: false },
      slantedText: true,
      slantedTextAngle: 45
    },
    vAxis: {
      title: "Price ($)",
      titleTextStyle: { color: "#333", italic: false },
      minValue: 0
    },
    pointSize: 4,
    lineWidth: 2,
    colors: ["#3b82f6"],
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
          <div className="loading loading-spinner loading-md mb-4"></div>
          <p className="text-gray-600">Loading price chart...</p>
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

  if (!data || data.length <= 1 || !prices.length) {
    return (
      <div className="w-full p-8 text-center bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-gray-600">📊 No price data available</p>
        <p className="text-sm text-gray-500 mt-2">Search for a stock to view its price chart</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg shadow-sm p-4">
      <Chart
        chartType={showLineChart ? "LineChart" : "AreaChart"}
        width="100%"
        height="400px"
        data={data}
        options={options}
      />
    </div>
  );
} 