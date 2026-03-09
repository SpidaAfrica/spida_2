import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import weather1 from "../../../assets/images/weather1.png";
import weather2 from "../../../assets/images/weather2.png";
import weather3 from "../../../assets/images/weather3.png";
import weather4 from "../../../assets/images/weather4.png";
import weather5 from "../../../assets/images/weather5.png";
import weather6 from "../../../assets/images/weather6.png";
import tractor from "../../../assets/images/request_tractor.png";
import farming from "../../../assets/images/request_agriculture.png";
import money from "../../../assets/images/request_money.png";
import users from "../../../assets/images/icons/users.png";
import products from "../../../assets/images/icons/products.png";
import delivered from "../../../assets/images/icons/delivered.png";
import returned from "../../../assets/images/icons/returned.png";
import WeatherCard from "../../../components/weatherCard/WeatherCard";
import Summary from "../../../components/summary/Summary";
import OrdersAnalytics from "../../../components/summary/OrdersAnalytics";
import OrderTrends from "../../../components/summary/OrderTrend";
import PieChart from "../../../components/summary/PieChart";
import "./FarmerDashboard.css";

const FarmerDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState([]);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const farmerId = sessionStorage.getItem("farmerId"); // Get logged-in farmer's ID
  const [currentPage, setCurrentPage] = useState(1); // State for the current page
  const itemsPerPage = 10; // Number of products per page

  useEffect(() => {
    if (farmerId) {
      fetchOrders();
    }
  }, [farmerId]); // Re-run when `farmerId` changes

  const fetchOrders = async () => {
    if (!farmerId) {
      console.warn("No farmer ID found in session storage.");
      return;
    }

    try {
      const response = await fetch("https://api.spida.africa/individual/get_orders.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ farmer_id: farmerId }),
      });

      const data = await response.json();

      if (data.success) {
        setOrders(data.orders);
      } else {
        alert("Error fetching orders: " + data.message);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };
 



  const handleCompleteSetUp = () => {
    navigate("/profile/farmer");
  };
  const full_name = sessionStorage.getItem("farmerName");
  console.log(orders);


 



    // Calculate the products to display for the current page
    /*
    const indexOfLastProduct = currentPage * itemsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
    const currentOrders = orders.slice(indexOfFirstProduct, indexOfLastProduct);
  
    // Total pages
    const totalPages = Math.ceil(orders.length / itemsPerPage);
  
    // Change page handler
    const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
    };*/

  return (
    <div className="farmer_dashboard">
      <div className="dashboard_page">
         <h1>Welcome!!! Glad to see you, {full_name}</h1>
        <p>Here is the information about all your orders</p>

        <div className="complete_farm_setup">
          <div>
            <h3>Complete Your Farm Setup</h3>
            <p>To fully benefit from the platform's features and ensure seamless operations.</p>
          </div>
          <div>
            <button onClick={handleCompleteSetUp}>Complete Farm Setup</button>
          </div>
        </div>

        <div className="weather_info">
          <WeatherCard
          />
        </div>
      </div>

      <div className="request_section">
        <div className="request_items">
          <div className="request_item">
            <div>
              <div>
                <h3>Request Tractor</h3>
                <p>Boost your farm's productivity—request a tractor today</p>
                <button   onClick={() => navigate("/Spi_Tractors/")}
        type="button">Explore Now</button>
              </div>
            </div>
            <img src={tractor} alt="" />
          </div>
          <div className="request_item center">
            <div>
              <div>
                <h3>Request Regenerative Agriculture & Extension Support</h3>
                <p>Empower Your Farm, Embrace Regeneration—Request Agriculture & Extension Support Today</p>
                <button>Explore Now</button>
              </div>
            </div>
            <img src={farming} alt="" />
          </div>
          <div className="request_item">
            <div>
              <div>
                  <h3>Request Input Loan</h3>
                  <p>Boost Your Harvest Today—Request an Input Loan for a Brighter Tomorrow</p>
                  <button>Explore Now</button>
              </div>
            </div>
            <img src={money} alt="" />
          </div>
        </div>
      </div>
{/*
      <div className="business_summary">
        <Summary data={stats} />
      </div>

      <div className="orders_analytics">
        <OrdersAnalytics />
      </div>
*/}

      <div className="orders_analytics">
        <OrderTrends/>
      </div>
      <div className="orders_analytics">
        <PieChart/>
      </div>
      {/*
      <div className="recent_orders pickup_summaries">
        <h1>Recent Orders</h1>

        <div className="order_items">
          {/* Header Section *
          <div className="items_head">
            <ul>
              <li>Order ID</li>
              <li>Produce Name</li>
              <li>Quantity</li>
              <li>Price</li>
              <li>Total</li>
              <li>Status</li>
              <li>Buyer</li>
            </ul>
          </div>

          {/* Body Section *
          <div className="items_body">
            {orders.map((order, index) => (
              <div className="item" key={index}>
                <ul>
                    <li>{order.order_id}</li>
                    <li>{order.produce_name}</li>
                    <li>{order.quantity}</li>
                    <li>#{order.price}</li>
                    <li>#{order.total_amount}</li>
                    <li>{order.status}</li>
                    <li>{order.name}</li>
                </ul>
              </div>
            ))}
          </div>
        */}
        <div className="recent_orders pickup_summaries">
          <h1>Recent Orders</h1>
          
          <div className="table_wrapper">
            <div className="table_inner">
              <table className="orders_table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Produce Name</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Buyer</th>
                  </tr>
                </thead>
                  <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: "center" }}>
                        No orders found.
                      </td>
                    </tr>
                  ) : (
                    orders.map((order, index) => (
                    <tr key={index}>
                      <td>{order.order_id}</td>
                      <td>{order.produce_name}</td>
                      <td>{order.quantity}</td>
                      <td>#{order.price}</td>
                      <td>#{order.total_amount}</td>
                      <td className={`status ${order.status.toLowerCase()}`}>{order.status}</td>
                      <td>{order.name}</td>
                    </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="orders_cards">
                {orders.length === 0 ? (
                    <div>
                      <p style={{ textAlign: "center" }}>
                        No orders found.
                      </p>
                    </div>
                  ) : (
                    orders.map((order, index) => (
                    <div className="order_card" key={index}>
                      <p><strong>Order ID:</strong> {order.order_id}</p>
                      <p><strong>Produce Name:</strong> {order.produce_name}</p>
                      <p><strong>Quantity:</strong> {order.quantity}</p>
                      <p><strong>Price:</strong> #{order.price}</p>
                      <p><strong>Total:</strong> #{order.total_amount}</p>
                      <p><strong>Status:</strong> <span className={`status ${order.status.toLowerCase()}`}>{order.status}</span></p>
                      <p><strong>Buyer:</strong> {order.name}</p>
                    </div>
                    ))
                  )}
            </div>
    
{/*
          <div className="pagination">
            <div>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <img src={prev} alt="" />
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={currentPage === page ? "active" : ""}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <img src={next} alt="" />
              </button>
            </div>
          </div>
          */}
        </div>
    </div>
  );
};

export default FarmerDashboard;














/*
import React from "react";
import { useNavigate } from "react-router-dom";

import weather1 from "../../../assets/images/weather1.png";
import weather2 from "../../../assets/images/weather2.png";
import weather3 from "../../../assets/images/weather3.png";
import weather4 from "../../../assets/images/weather4.png";
import weather5 from "../../../assets/images/weather5.png";
import weather6 from "../../../assets/images/weather6.png";
import tractor from "../../../assets/images/request_tractor.png";
import farming from "../../../assets/images/request_agriculture.png";
import money from "../../../assets/images/request_money.png";
import users from "../../../assets/images/icons/users.png";
import products from "../../../assets/images/icons/products.png";
import delivered from "../../../assets/images/icons/delivered.png";
import returned from "../../../assets/images/icons/returned.png";
import WeatherCard from "../../../components/weatherCard/WeatherCard";
import Summary from "../../../components/summary/Summary";
import OrdersAnalytics from "../../../components/summary/OrdersAnalytics";


const FarmerDashboard = () => {
  const navigate = useNavigate();

  const handleCompleteSetUp = () => {
    navigate("/profile/farmer");
  };

  const data = [
    {
      img: users,
      value: 500,
      title: "Total users",
      change: 10.2,
      percentage: 1.01,
    },
    {
      img: products,
      value: 300,
      title: "Total products",
      change: 3.1,
      percentage: 0.49,
    },
    {
      img: delivered,
      value: 150,
      title: "Delivered",
      change: -2.56,
      percentage: -0.91,
    },
    {
      img: returned,
      value: 20,
      title: "Returned",
      change: 7.2,
      percentage: 1.51,
    },
  ];

  const orders = [
    {
      id: "001",
      time: "4:00pm",
      date: "April 18, 2024",
      item: "Watermelon",
      pickupLocation: "Adisa Farms, Plot 20",
      destination: "Number 29, Gbad...",
      status: "Completed",
    },
    {
      id: "002",
      time: "5:00pm",
      date: "April 19, 2024",
      item: "Banana",
      pickupLocation: "Alaba Market",
      destination: "Number 15, Lekki...",
      status: "Pending",
    },
    {
      id: "003",
      time: "3:30pm",
      date: "April 17, 2024",
      item: "Pineapple",
      pickupLocation: "Odogunyan Market",
      destination: "Number 12, Yaba...",
      status: "In Progress",
    },
    {
      id: "004",
      time: "6:00pm",
      date: "April 20, 2024",
      item: "Apples",
      pickupLocation: "Magodo Farms",
      destination: "Number 22, VI...",
      status: "Completed",
    },
    {
      id: "005",
      time: "2:00pm",
      date: "April 15, 2024",
      item: "Coconut",
      pickupLocation: "Iyana Ipaja Market",
      destination: "Number 3, Ikeja...",
      status: "Cancelled",
    },
    {
      id: "006",
      time: "2:00pm",
      date: "April 15, 2024",
      item: "Coconut",
      pickupLocation: "Iyana Ipaja Market",
      destination: "Number 3, Ikeja...",
      status: "In Progress",
    },
    {
      id: "007",
      time: "2:00pm",
      date: "April 15, 2024",
      item: "Coconut",
      pickupLocation: "Iyana Ipaja Market",
      destination: "Number 3, Ikeja...",
      status: "Completed",
    },
  ];

  const weatherData = {
    location: "Lagos, Nigeria",
    currentTemp: 24,
    currentDesc: "Thunderstorm",
    currentImg: weather1,
    forecastData: [
      {
        time: "9AM",
        icon: weather2,
        temp: 18,
        description: "Cloudy",
      },
      {
        time: "10AM",
        icon: weather3,
        temp: 19,
        description: "Windy",
      },
      {
        time: "11AM",
        icon: weather4,
        temp: 24,
        description: "Partly Cloudy",
        active: true,
      },
      {
        time: "12PM",
        icon: weather5,
        temp: 25,
        description: "Sunny",
      },
      {
        time: "1PM",
        icon: weather6,
        temp: 26,
        description: "Rainy",
      },
    ],
  };

  return (
    <div className="farmer_dashboard">
      <div className="dashboard_page">
        <h1>Welcome Back, Adisa</h1>
        <p>Here is the information about all your orders</p>

        <div className="complete_farm_setup">
          <div className="">
            <h3>Complete Your Farm Setup</h3>
            <p>
              To fully benefit from the platform's features and ensure seamless
              operations.
            </p>
          </div>
          <button onClick={handleCompleteSetUp}>Complete Farm Setup</button>
        </div>

        <div className="weather_info">
          <WeatherCard
            location={weatherData.location}
            currentTemp={weatherData.currentTemp}
            currentImg={weatherData.currentImg}
            currentDesc={weatherData.currentDesc}
            forecastData={weatherData.forecastData}
          />
        </div>
      </div>
      <div className="request_section">
        <div className="request_items">
          <div className="request_item">
            <div className="">
              <div className="">
                <h3>Request Tractor</h3>
                <p>Boost your farm's productivity—request a tractor today</p>
                <button>Explore Now</button>
              </div>
              <img src={tractor} alt="" />
            </div>
          </div>
          <div className="request_item center">
            <div className="">
              <div className="">
                <h3>Request Regenerative Agriculture & Extension Support</h3>
                <p>
                  Empower Your Farm, Embrace Regeneration—Request Agriculture &
                  Extension Support Today
                </p>
                <button>Explore Now</button>
              </div>
              <img src={farming} alt="" />
            </div>
          </div>
          <div className="request_item">
            <div className="">
              <div className="">
                <h3>Request Input Loan</h3>
                <p>
                  Boost Your Harvest Today—Request an Input Loan for a Brighter
                  Tomorrow
                </p>
                <button>Explore Now</button>
              </div>
              <img src={money} alt="" />
            </div>
          </div>
        </div>
      </div>

      <div className="business_summary">
        <Summary data={data} />
      </div>

      <div className="orders_analytics">
        <OrdersAnalytics />
      </div>

      <div className="recent_orders">
        <h1>Recent Orders</h1>

        <div className="order_items">
          {/* Header Section */
          
        /*
          <div className="items_head">
            <ul>
              <li>Order ID</li>
              <li>Pickup Time</li>
              <li>Pickup Date</li>
              <li>Item</li>
              <li>Pickup Location</li>
              <li>Destination</li>
              <li>Status</li>
            </ul>
          </div>
*
          {/* Body Section 
          <div className="items_body">
            {orders.map((order, index) => (
              <div className="item" key={index}>
                <ul>
                  <li>{order.id}</li>
                  <li>{order.time}</li>
                  <li>{order.date}</li>
                  <li>{order.item}</li>
                  <li>{order.pickupLocation}</li>
                  <li>{order.destination}</li>
                  <li
                    className={`status ${order.status
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                  >
                    {order.status}
                  </li>
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;

*/
