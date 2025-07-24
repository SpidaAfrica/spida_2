import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


import locationicon from "../../../assets/images/icons/locationicon3.png";
import lineimg from "../../../assets/images/icons/lineimg.png";
import prev from "../../../assets/images/icons/prev.png";
import next from "../../../assets/images/icons/next.png";



const LogisticsPickup = () => {
 const [orders, setOrders] = useState([]);
  const logisticsId = sessionStorage.getItem("logisticsId");

  const [currentPage, setCurrentPage] = useState(1); // State for the current page
  const itemsPerPage = 10; // Number of products per page
  const navigate = useNavigate();



  useEffect(() => {
    if (logisticsId) {
      fetchOrders();
    }
  }, [logisticsId]); // Re-run when `farmerId` changes

  const fetchName = async () => {
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

  const confirmPickup = async (orderId) => {
    const logisticsId = sessionStorage.getItem("logisticsId");
  
    // Get current date and time
    const now = new Date();
    const pickupDate = now.toISOString().split("T")[0]; // Format: YYYY-MM-DD
    const pickupTime = now.toTimeString().split(" ")[0]; // Format: HH:MM:SS
  
    try {
      const response = await fetch("https://api.spida.africa/logistics/confirm_pickup.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: Number(orderId), // Ensure integer
          logistics_id: Number(logisticsId), 
          pickup_time: pickupTime,
          pickup_date: pickupDate,
        }),
      });
  
      const data = await response.json();
      console.log("Response from backend:", data);
      if (data.success) {
        alert("Pickup confirmed with timestamp recorded.");
        fetchOrders(); // Refresh order list
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error confirming pickup:", error);
    }
  };
  
  

  // Calculate the products to display for the current page
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentOrders = orders.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Total pages
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  // Change page handler
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

return (
        <div className="pickups">
          {/* Pickup Items */}
          <div className="pickup_items">
            {currentOrders.map((order, index) => (
              <div className="pickup_item" key={index}>
                <img src={`https://api.spida.africa/farmer/${order.product_image}`} alt="" />
                <div className="pickup_details">
                  <div className="order_id">
                    <h3>Order ID</h3>
                    <h2>{order.order_id}</h2>
                  </div>
                  <div className="pickup_location">
                    <div>
                      <p>Pickup Location</p>
                      <h2>{order.pickup}</h2>
                    </div>
                    <div className="pickup_imgs">
                      <img src={locationicon} alt="" />
                      <img src={lineimg} alt="" />
                    </div>
                    <div>
                      <p>Destination</p>
                      <h2>{order.destination}</h2>
                    </div>
                  </div>
                  <div className="item_details">
                    <div>
                      <p>Item</p>
                      <h2>{order.produce_name}</h2>
                    </div>
                    <div>
                      <p>Quantity</p>
                      <h2>{order.quantity} kg</h2>
                    </div>
                    <div>
                      <p>Region</p>
                      <h2>{order.region}</h2>
                    </div>
                    <div>
                      <p>Farm Name</p>
                      <h2>{order.farm_name}</h2>
                    </div>
                  </div>
                  <button onClick={() => confirmPickup(order.order_id)}>Confirm Pickup</button>
                </div>
              </div>
            ))}
          </div>
      
          {/* Pickup Summary */}
          <div className="recent_orders pickup_summaries">
            <h1>Pickup Summary</h1>
      
            <div className="order_items">
              {/* Header Section */}
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
      
              {/* Body Section */}
              <div className="items_body">
                {currentOrders.map((order, index) => (
                  <div className="item" key={index}>
                    <ul>
                      <li>{order.order_id}</li>
                      <li>{order.pickup_time ? order.pickup_time : "Not Picked"}</li>
                      <li>{order.pickup_date ? order.pickup_date : "Not Picked"}</li>
                      <li>{order.produce_name}</li>
                      <li>{order.pickup}</li>
                      <li>{order.destination}</li>
                      <li>
                        {order.status === "Pending" ? (
                            <button onClick={() => confirmPickup(order.order_id)}>Confirm Pickup</button>
                        ) : order.status === "Picked" ? (
                            <span className="status" style={{color:"black"}}>Waiting for Farmer</span>
                        ) : (
                            <span className="status" style={{color:"black"}}>{order.status}</span>
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
                      <p><strong>Pickup Time:</strong> {order.pickup_time ? order.pickup_time : "Not Picked"}</p>
                      <p><strong>Pickup Date:</strong> {order.pickup_date ? order.pickup_date : "Not Picked"}</p>
                      <p><strong>Item:</strong> {order.produce_name}</p>
                      <p><strong>Pickup Location:</strong> {order.pickup}</p>
                      <p><strong>Destination:</strong> {order.destination}</p>
                      <p><strong>Status:</strong> {
                        order.status === "Pending" ? (
                          <button onClick={() => confirmPickup(order.order_id)}>Confirm Pickup</button>
                        ) : order.status === "Picked" ? (
                          <span className="status" style={{ color: "black" }}>Waiting for Farmer</span>
                        ) : (
                          <span className="status" style={{ color: "black" }}>{order.status}</span>
                        )
                      }</p>
                    </div>
                  ))
                )}
              </div>

      
              {/* Pagination */}
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
        </div>
      );
};

export default LogisticsPickup;
