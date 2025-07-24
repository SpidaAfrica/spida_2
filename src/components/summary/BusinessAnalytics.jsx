import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Chart from "react-apexcharts";

const IndividualAnalytics = () => {
  const [spendingTrends, setSpendingTrends] = useState([]);
  const [favoriteProduce, setFavoriteProduce] = useState({ labels: [], series: [] });
  const [timeframe, setTimeframe] = useState("Monthly");
  const businessId = sessionStorage.getItem("businessId");

  useEffect(() => {
    fetch(`https://api.spida.africa/individual/individual_analytics.php?individual_id=${businessId}&timeframe=${timeframe}`)
      .then(response => response.json())
      .then(data => {
        setSpendingTrends(data.spending_trends || []); // Ensure spending_trends is always an array
        
        if (data.favorite_produce && Array.isArray(data.favorite_produce)) {
          setFavoriteProduce({
            labels: data.favorite_produce.map(item => item.produce_name), 
            series: data.favorite_produce.map(item => parseInt(item.quantity, 10)), 
          });
        } else {
          setFavoriteProduce({ labels: [], series: [] }); // Fallback for empty or undefined data
        }
      })
      .catch(error => console.error("Error fetching individual analytics:", error));
  }, [businessId, timeframe]);
  
  

  return (
    <div>
      <h2>Business User Analytics</h2>
      <select value={timeframe} onChange={(e) => setTimeframe(e.target.value)}>
        <option value="daily">Daily</option>
        <option value="monthly">Monthly</option>
        <option value="yearly">Yearly</option>
      </select>
      {/* Line Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={spendingTrends}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="total_spent" stroke="#28a745" />
        </LineChart>
      </ResponsiveContainer>

      {/* Pie Chart */}
      <h3>Produce Purchase</h3>
      <Chart options={{ labels: favoriteProduce.labels }} series={favoriteProduce.series} type="donut" height={300} />
    </div>
  );
};

export default IndividualAnalytics;
