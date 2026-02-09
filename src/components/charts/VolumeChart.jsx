import {React,useEffect,useState} from "react";
import { Chart } from "react-google-charts";

const[ChartData , setChartData] = useState([]);

const StockData = async()=>{
  const responce = await fetch('');
  
  setChartData(await responce.json())  
}

useEffect(()=>{
  StockData();
},[])

export const options = {
  legend: "none",
};

export const data = [
  ["day", "open", "high", "low", "close"],
  [...ChartData()], // makes charts 
];

export default function VolumeChart() {
  
  return (
    <Chart
      chartType="CandlestickChart"
      width="100%"
      height="100%"
      data={data}
      options={options}
    />
  );
}
