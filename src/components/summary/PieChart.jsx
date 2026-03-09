import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";


const PieChart = () => {
  const [timeframe, setTimeframe] = useState("monthly"); // Default filter
  const [data, setData] = useState({ labels: [], series: [] });
  const farmerId = sessionStorage.getItem("farmerId");
 
    useEffect(() => {
        const endpoint = `https://api.spida.africa/farmer/produce_sales.php?farmer_id=${farmerId}&timeframe=${timeframe}`;
    
        fetch(endpoint)
        .then(response => {
            if (!response.ok) {
            throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            const labels = data.map(item => item.produce_name);
            const series = data.map(item => item.total_orders);
            setData({ labels, series });
        })
        .catch(error => console.error("Error fetching pie chart data:", error));
    }, [farmerId, timeframe]); // Dependencies ensure refetching when these change
  

  return (
    <div className="pie-chart-container">
      <h2>Produce Sales Breakdown"</h2>

      {/* Dropdown for filtering by timeframe */}
      <select value={timeframe} onChange={(e) => setTimeframe(e.target.value)}>
        <option value="daily">Daily</option>
        <option value="monthly">Monthly</option>
        <option value="yearly">Yearly</option>
      </select>

      <Chart options={{ labels: data.labels, chart: { type: "donut" } }} series={data.series} type="donut" height={200} />
    </div>
  );
};

export default PieChart;
