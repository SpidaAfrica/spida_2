import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Chart from "react-apexcharts";
import "./ordersAnalytics.css";

const OrdersAnalytics = () => {
  // Data for the line chart
  const lineChartData = [
    // { name: "Jan", offline: 20, online: 40 },
    { name: "Feb", offline: 30, online: 50 },
    { name: "Feb", offline: 30, online: 50 },
    { name: "Feb", offline: 40, online: 60 },
    { name: "Feb", offline: 50, online: 70 },
    { name: "Feb", offline: 20, online: 10 },
    { name: "Feb", offline: 120, online: 50 },
    { name: "Feb", offline: 30, online: 50 },
    { name: "Mar", offline: 40, online: 60 },
    { name: "Apr", offline: 50, online: 70 },
    { name: "May", offline: 60, online: 65 },
    { name: "Jun", offline: 70, online: 55 },
    { name: "Jul", offline: 80, online: 45 },
  ];

  // Config for the concentric donut chart
  const donutChartOptions = {
    labels: ["Offline Orders", "Online Orders"],
    colors: ["#004d00", "#ffc107"], // Green and Yellow
    chart: {
      type: "donut",
    },
    plotOptions: {
      pie: {
        donut: {
          size: "70%", // Inner circle size
        },
      },
    },
    legend: {
      position: "bottom",
    },
  };

  const donutChartSeries = [65, 35]; // Example data for the donut chart

  return (
    <div className="orders-analytics-container">
      {/* Line Chart */}
      <div className="line-chart-container">
        <div className="">
          <h2>Orders Analytics</h2>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={lineChartData}>
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="offline"
              stroke="#004d00"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="online"
              stroke="#ffc107"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Concentric Donut Chart */}
      <div className="donut-chart-container">
        <div className="">
          <h2>Earnings</h2>
        </div>
        <Chart
          options={donutChartOptions}
          series={donutChartSeries}
          type="donut"
          height={200}
        />
        <button className="download-button">Download Sales Record</button>
      </div>
    </div>
  );
};

export default OrdersAnalytics;
