import label from "daisyui/components/label";
import React from "react";
import {Chart} from "react-google-charts";

// 🔗 How it’s used (IMPORTANT)
// 📄 Dashboard.jsx
// <PriceChart
//   prices={priceData}
//   labels={timeLabels}
//   symbol="AAPL"
// />



export default function PriceChart(prices , time , symbol){

  const data = [["Time" , "Price"], ...label.map((time,i)=>[time,prices[i]])];

  return (
    <Chart 
      ChartType = "ColumnChart"
      width = "100%"
      height = "400px"
      data = {data}
    />
  );
}