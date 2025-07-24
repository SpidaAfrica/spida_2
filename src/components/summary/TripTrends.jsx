import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const TripTrends = () => {
const [timeframe, setTimeframe] = useState("monthly"); // Default filter
const [data, setData] = useState([]);
const logisticsId = sessionStorage.getItem("logisticsId");

  useEffect(() => {
    fetch(`https://api.spida.africa/logistics/trip_trends.php?logistics_id=${logisticsId}&timeframe=${timeframe}`)
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error("Error fetching trip trends:", error));
  }, [logisticsId, timeframe]);

  return (
    <div>
      <h2>Trips Made Over Time</h2>
      <select value={timeframe} onChange={(e) => setTimeframe(e.target.value)}>
        <option value="daily">Daily</option>
        <option value="monthly">Monthly</option>
        <option value="yearly">Yearly</option>
      </select>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="total_trips" stroke="#ff7300" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TripTrends;
