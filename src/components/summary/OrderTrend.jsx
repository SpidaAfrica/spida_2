import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import axios from "axios";

const OrderTrends = () => {
  const [timeframe, setTimeframe] = useState("monthly"); // Default filter
  const [data, setData] = useState([]);
  const farmerId = sessionStorage.getItem("farmerId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://api.spida.africa/farmer/farmer_orders_graph.php?farmer_id=${farmerId}&timeframe=${timeframe}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching order data:", error);
      }
    };

    fetchData();
  }, [farmerId, timeframe]);

  return (
    <div className="order-trends-container">
      <h2>Order Trends</h2>
      
      {/* Dropdown for selecting timeframe */}
      <select value={timeframe} onChange={(e) => setTimeframe(e.target.value)}>
        <option value="daily">Daily</option>
        <option value="monthly">Monthly</option>
        <option value="yearly">Yearly</option>
      </select>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="period" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="total_orders" stroke="#28a745" />
          <Line type="monotone" dataKey="total_revenue" stroke="#ffc107" />
          <Line type="monotone" dataKey="pickups" stroke="#007bff" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OrderTrends;
