/*import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import prev from "../../assets/images/icons/prev.png";
import next from "../../assets/images/icons/next.png";
import melon from "../../assets/images/melon.png";
import locationicon from "../../assets/images/icons/locationicon3.png";
import lineimg from "../../assets/images/icons/lineimg.png";
import orders from "../../data/orders";

import "./logisticorders.css";

const LogisticsOrders = () => {
  const [currentPage, setCurrentPage] = useState(1); // State for the current page
  const itemsPerPage = 10; // Number of products per page
  const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const farmerId = sessionStorage.getItem("farmerId"); // Get logged-in farmer's ID
  
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

  const handleAcceptOrder = () => {
    alert("Order Accepted");
  };

  const handleRejectOrder = () => {
    alert("Order Rejected");
    navigate("/orders/rejected");
  };

  const handleConfirmPickup = (orderId) => {
    alert(`Pickup Confirmed for order ${orderId}`);
    navigate("/orders/ongoing-delivery");
  };
*/

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import prev from "../../assets/images/icons/prev.png";
import next from "../../assets/images/icons/next.png";

import "./logisticorders.css";

const LogisticsOrders = () => {
  const [orders, setOrders] = useState([]);
  const logisticsId = sessionStorage.getItem("logisticsId"); // Get logged-in farmer's ID
  const [currentPage, setCurrentPage] = useState(1); // State for the current page
  const itemsPerPage = 10; // Number of products per page
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

  const updateOrderStatus = async (orderId, newStatus) => {
    console.log(`Updating order ${orderId} to status: ${newStatus}`);
    try {
      const response = await fetch("https://api.spida.africa/logistics/update_order_status.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: orderId, status: newStatus, logistics_id: logisticsId }),
      });
  
      const data = await response.json();
      console.log("Update response:", data);
  
      if (data.success) {
        alert("Order status updated successfully!");
        fetchOrders(); // Refresh orders
   
      } else {
        alert("Failed to update order: " + data.message);
      }

      if(newStatus == 'Accepted'){
        navigate("/orders/logistics?tab=pickup")
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    };

  };


  

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
    <div className="logistics_orders_page">
      <div className="recent_orders pickup_summaries">
        <h1>Available Orders</h1>

        <div className="order_items">
          {/* Header Section */}
          <div className="items_head">
            <ul>
              <li>Order ID</li>
              <li>Item</li>
              <li>Quantity</li>
              <li>Pickup Location</li>
              <li>Destination</li>
              <li>Region</li>
              <li>Accept/Decline</li>
            </ul>
          </div>

          {/* Body Section */}
          <div className="items_body">
            {currentOrders.map((order, index) => (
              <div className="item" key={index}>
                <ul>
                  <li>{order.order_id}</li>
                  <li>{order.produce_name}</li>
                  <li>{order.quantity}</li>
                  <li>{order.pickup}</li>
                  <li>{order.destination}</li>
                  <li>{order.region}</li>
                  <li className="accept_decline">
                    {order.status == "Pending" ? (
                      <>
                        <button onClick={() => updateOrderStatus(order.order_id, "Accepted")} className="accept">
                          Accept
                        </button>
                        <button onClick={() => updateOrderStatus(order.order_id, "Declined")}>
                          Decline
                        </button>
                      </>
                    ) : (
                      <span className={`status ${order.status}`} style={{color:"black"}}>{order.status}</span>
                    )}
                </li>
                </ul>
              </div>
            ))}
          </div>
          <div className="orders_cards">
            {currentOrders.length === 0 ? (
              <div>
                <p style={{ textAlign: "center" }}>No orders found.</p>
              </div>
            ) : (
              currentOrders.map((order, index) => (
                <div className="order_card" key={index}>
                  <p><strong>Order ID:</strong> {order.order_id}</p>
                  <p><strong>Produce Name:</strong> {order.produce_name}</p>
                  <p><strong>Quantity:</strong> {order.quantity}</p>
                  <p><strong>Pickup:</strong> {order.pickup}</p>
                  <p><strong>Destination:</strong> {order.destination}</p>
                  <p><strong>Region:</strong> {order.region}</p>
                  <p><strong>Accept/Decline:</strong> {
                    order.status == "Pending" ? (
                      <div className="accept_decline">
                        <button onClick={() => updateOrderStatus(order.order_id, "Accepted")} className="accept">
                          Accept
                        </button>
                        <button onClick={() => updateOrderStatus(order.order_id, "Declined")}>
                          Decline
                        </button>
                      </div>
                    ) : (
                      <span className={`status ${order.status.toLowerCase()}`} style={{ color: "black" }}>
                        {order.status}
                      </span>
                    )
                  }</p>
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
        </div>
      </div>

      <br />
      <br />
{/*
      <div className="pickup_items">
        <h1>Pickup</h1>
        {pickupItems.map((item, index) => (
          <div className="pickup_item" key={index}>
            <img src={melon} alt="Melon" />
            <div className="pickup_details">
              <div className="order_id">
                <h3>Order ID</h3>
                <h2>{item.orderId}</h2>
              </div>
              <div className="pickup_location">
                <div>
                  <p>Pickup Location </p>
                  <h2>{item.pickupLocation}</h2>
                </div>
                <div className="pickup_imgs">
                  <img src={locationicon} alt="Location Icon" />
                  <img src={lineimg} alt="Line Image" />
                </div>
                <div>
                  <p>Destination</p>
                  <h2>{item.destination}</h2>
                </div>
              </div>
              <div className="item_details">
                <div>
                  <p>Item</p>
                  <h2>{item.item}</h2>
                </div>
                <div>
                  <p>Quantity</p>
                  <h2>{item.quantity}</h2>
                </div>
                <div>
                  <p>Region</p>
                  <h2>{item.region}</h2>
                </div>
                <div>
                  <p>Logistics Company</p>
                  <h2>{item.logisticsCompany}</h2>
                </div>
              </div>
              <button onClick={() => handleConfirmPickup(item.orderId)} style={{cursor: "pointer"}}>Confirm Pickup</button>
            </div>
          </div>
        ))}
      </div>
*/}
    </div>
  );
};

export default LogisticsOrders;
