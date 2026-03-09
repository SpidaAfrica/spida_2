import React, { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";

import truck1 from "../../../assets/images/icons/truck1.png";
import truck2 from "../../../assets/images/icons/truck2.png";
import buy from "../../../assets/images/icons/buy.png";
import prev from "../../../assets/images/icons/prev.png";
import next from "../../../assets/images/icons/next.png";
import box from "../../../assets/images/icons/box.png";
import OrdersAnalytics from "../../../components/summary/OrdersAnalytics";
import {
  DeliveriesPieChart,
  WeeklyDeliveryChart,
} from "../../../components/summary/Summary";
import orders from "../../../data/orders";
import PieChart from "../../../components/PieChart";
import TripTrends from "../../../components/summary/TripTrends";
import PickupDistribution from "../../../components/summary/PickupDistribution";

const LogisticsDashboard = () => {
  const [currentPage, setCurrentPage] = useState(1); // State for the current page
  const itemsPerPage = 10; // Number of products per page
  const [orders, setOrders] = useState([]);
  const logisticsId = sessionStorage.getItem("logisticsId"); // Get logged-in farmer's ID
  const navigate = useNavigate();
 
 
   useEffect(() => {
     if (logisticsId) {
       fetchOrders();
     }
   }, [logisticsId]); // Re-run when `farmerId` changes
 
   const fetchOrders = async () => {
     if (!logisticsId) {
       console.warn("No Logistics ID found in session storage.");
       return;
     }
   
     try {
       const response = await fetch(`https://api.spida.africa/logistics/get_orders_for_logistics.php?logistics_id=${logisticsId}`);
       const data = await response.json();
   
       if (data.success) {
         setOrders(data.orders);
         console.log(data.orders);
       } else {
         console.error("Failed to fetch Orders");
       }
     } catch (error) {
       console.error("Error fetching Orders:", error);
     }
   };
   console.log(orders);
 
    // Calculate the products to display for the current page
    const indexOfLastProduct = currentPage * itemsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
    const currentOrders = orders.slice(indexOfFirstProduct, indexOfLastProduct);
  
    // Total pages
    const totalPages = Math.ceil(orders.length / itemsPerPage);
  
    // Change page handler
    const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
    };

  return (
    <div className="logistics_dashboard">
      <div className="delivery_containers">
        <div className="delivery_container">
          <div className="">
            <div className="img">
              <img src={truck1} alt="" />
            </div>
            <div className="text">
              <h3>Ongoing Deliveries</h3>
              <h4>NONE</h4>
            </div>
          </div>
        </div>
        <div className="delivery_container">
          <div className="">
            <div className="img">
              <img src={truck2} alt="" />
            </div>
            <div className="text">
              <h3>Pending Deliveries</h3>
              <h4>NONE</h4>
            </div>
          </div>
        </div>
        <div className="delivery_container">
          <div className="">
            <div className="img">
              <img src={buy} alt="" />
            </div>
            <div className="text">
              <h3>Orders</h3>
              <h4>{currentOrders.length}</h4>
            </div>
          </div>
        </div>
        <div className="delivery_container">
          <div className="">
            <div className="img">
              <img src={box} alt="" />
            </div>
            <div className="text">
              <h3>Total Deliveries</h3>
              <h4>NONE</h4>
            </div>
          </div>
        </div>
      </div>

      <div className="responsive-grid">
        {/*
        <WeeklyDeliveryChart />
        <DeliveriesPieChart />
        */}
        <TripTrends/>
        <PickupDistribution/>
      </div>
      <br />
      <div className="recent_orders pickup_summaries all_orders_page">
        <div className="farmer_orders">
          <div className="all_orders_page_header">
            <h1>Order History</h1>
          </div>

          <div className="order_items">
            {/* Header Section */}
            <div className="items_head">
              <ul>
                <li>Order ID</li>
                <li>Pickup Time</li>
                <li>Pickup Date</li>
                <li>Item</li>
                <li>Destination</li>
                <li>Quantity</li>
                <li>Status</li>
              </ul>
            </div>

            {/* Body Section */}
            <div className="items_body">
              {currentOrders.map((order, index) => (
                <div className="item" key={index}>
                  <ul>
                    <li>{order.order_id}</li>
                    <li>{order.pickup_time ? order.pickup_time : "Not Picked"}</li>
                    <li>{order.pickup_date ? order.pickup_date : "Not Picked"}</li>
                    <li>
                      {order.produce_name}
                    </li>
                    <li>{order.destination}</li>
                    <li>
                      {order.quantity}
                    </li>
                    <li>{order.status}</li>
                  </ul>
                </div>
              ))}
            </div>
            <div className="orders_cards">
              {currentOrders.length === 0 ? (
                <div>
                  <p style={{ textAlign: "center" }}>
                    No orders found.
                  </p>
                </div>
              ) : (
                currentOrders.map((order, index) => (
                  <div className="order_card" key={index}>
                    <p><strong>Order ID:</strong> {order.order_id}</p>
                    <p><strong>Pickup Time:</strong> {order.pickup_time ? order.pickup_time : "Not Picked"}</p>
                    <p><strong>Pickup Date:</strong> {order.pickup_date ? order.pickup_date : "Not Picked"}</p>
                    <p><strong>Item:</strong> {order.produce_name}</p>
                    <p><strong>Destination:</strong> {order.destination}</p>
                    <p><strong>Quantity:</strong> {order.quantity}</p>
                    <p>
                      <strong>Status:</strong>{" "}
                      <span className={`status ${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </p>
                  </div>
                ))
              )}
            </div>


            <div className="pagination">
              <div>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <img src={prev} alt="" />
                </button>

                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={currentPage === page ? "active" : ""}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <img src={next} alt="" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogisticsDashboard;
