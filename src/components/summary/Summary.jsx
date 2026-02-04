import React from "react";
import { Line } from "react-chartjs-2";
import { Doughnut } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";
import "chart.js/auto"; // For auto-import of necessary components
import arrowUp from "../../assets/images/icons/arrowUp.png";
import arrowDown from "../../assets/images/icons/arrowDown.png";

import "./summary.css"; // Import CSS for styling

const Summary = ({ data }) => {
  return (
    <div className="summary_cards">
      {data.map((item, index) => (
        <div key={index} className="card">
          <div className="card-header">
            <div>
              <h2>{item.value}</h2>
              <p>{item.title}</p>
            </div>
            <img src={item.img} alt="" />
          </div>

          <div className="card-footer">
            <span className="trends">
              <img src={item.change > 0 ? arrowUp : arrowDown} alt="trend" />
              {Math.abs(item.change)?.toFixed(2)}
            </span>
            <span className="percentage">
              {item.percentage > 0 ? "+" : ""}
              {item.percentage?.toFixed(2)}% this week
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export const WeeklyDeliveryChart = () => {
  const data = {
    labels: ["Ogun", "Lagos", "Ekiti", "Ondo", "Oyo", "Osun"],
    datasets: [
      {
        label: "Deliveries",
        data: [30000, 45000, 60000, 30000, 50000, 20000],
        backgroundColor: "rgba(7, 94, 84, 0.2)",
        borderColor: "#075e54",
        borderWidth: 2,
        tension: 0.4, // Makes the curve smoother
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "#dcdcdc",
        },
      },
    },
    plugins: {
      legend: {
        display: false, // Disable the legend
      },
    },
  };

  return (
    <div className="chart-container">
      <h3>Weekly Delivery Chart</h3>
      <Line data={data} options={options} />
    </div>
  );
};

export const DeliveriesPieChart = () => {
  const data = {
    labels: ["Ontime", "In Progress", "Delayed"],
    datasets: [
      {
        data: [50, 20, 30],
        backgroundColor: ["#2ecc71", "#f39c12", "#e74c3c"],
        hoverBackgroundColor: ["#27ae60", "#e67e22", "#c0392b"],
        borderWidth: 2,
        borderColor: "#fff",
      },
    ],
  };

  const options = {
    responsive: false,
    maintainAspectRatio: false,
    cutout: "80%", // Reduces the thickness of the segments
    plugins: {
      legend: {
        display: false, // Disable the legend
      },
    },
  };

  return (
    <div className="pie-chart-container">
      <h3 style={{ textAlign: "left" }}>Deliveries</h3>
      <div style={{ display: "flex", width: "400px", alignItems: "center" }}>
        <Doughnut data={data} options={options} />
        <div className="legend">
          <div className="legend-item">
            <span style={{ backgroundColor: "#2ecc71" }}></span>
            <p>Ontime</p>
          </div>
          <div className="legend-item">
            <span style={{ backgroundColor: "#f39c12" }}></span>
            <p>In Progress</p>
          </div>
          <div className="legend-item">
            <span style={{ backgroundColor: "#e74c3c" }}></span>
            <p>Delayed</p>
          </div>
        </div>
      </div>

      <button className="download-button">Download Statistics</button>
    </div>
  );
};

export const BuyerBarChartIndividual = () => {
  const data = {
    labels: ["M", "T", "W", "T", "F", "S", "Today"],
    datasets: [
      {
        label: "Orders",
        data: [2000, 4000, 1500, 5000, 4500, 2500, 3000],
        backgroundColor: "#0C420A", // Solid green color
        borderRadius: 8, // Rounded corners for the bars
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false, // Remove vertical grid lines
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "transparent", // Light gray color for horizontal grid lines
        },
      },
    },
    plugins: {
      legend: {
        display: false, // Hide legend
      },
    },
  };

  return (
    <div className="chart-container" style={{ height: "300px" }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export const BuyerBarChartBusiness = () => {
  const data = {
    labels: ["Ogun", "Lagos", "Ekiti", "Ondo", "Oyo", "Osun"],
    datasets: [
      {
        label: "Deliveries",
        data: [30000, 45000, 60000, 30000, 50000, 20000],
        backgroundColor: "rgba(7, 94, 84, 0.2)",
        borderColor: "#075e54",
        borderWidth: 2,
        tension: 0.4, // Makes the curve smoother
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "#dcdcdc",
        },
      },
    },
    plugins: {
      legend: {
        display: false, // Disable the legend
      },
    },
  };

  return (
    <div className="chart-container">
      <h3>Weekly Delivery Chart</h3>
      <Line data={data} options={options} />
    </div>
  );
};

export default Summary;
