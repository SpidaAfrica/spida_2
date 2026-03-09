import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";

const PickupDistribution = () => {
  const [data, setData] = useState({ labels: [], series: [] });
  const [timeframe, setTimeframe] = useState("monthly"); // Default filter
  const logisticsId = sessionStorage.getItem("logisticsId");

  useEffect(() => {
    fetch(`https://api.spida.africa/logistics/produce_distribution.php?logistics_id=${logisticsId}&timeframe=${timeframe}`)
      .then(response => response.json())
      .then(data => {
        const labels = data.map(item => item.produce_category);
        const series = data.map(item => item.quantity);
        setData({ labels, series });
      })
      .catch(error => console.error("Error fetching produce distribution:", error));
  }, [logisticsId, timeframe]);

  return (
    <div>
      <h2>Produce Pickup Distribution</h2>
      <select value={timeframe} onChange={(e) => setTimeframe(e.target.value)}>
        <option value="daily">Daily</option>
        <option value="monthly">Monthly</option>
        <option value="yearly">Yearly</option>
      </select>
      <Chart
        options={{
          labels: data.labels,
          chart: { type: "donut" },
          colors: ["#FF5733", "#33FF57", "#3357FF", "#FF33A1"],
        }}
        series={data.series}
        type="donut"
        height={300}
      />
    </div>
  );
};

export default PickupDistribution;
