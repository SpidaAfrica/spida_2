import React, { useState, useEffect } from "react";

import truck1 from "../../../assets/images/icons/truck1.png";
import truck2 from "../../../assets/images/icons/truck2.png";
import buy from "../../../assets/images/icons/buy.png";
import prev from "../../../assets/images/icons/prev.png";
import next from "../../../assets/images/icons/next.png";


import BusinessAnalytics from "../../../components/summary/BusinessAnalytics";

const BusinessBuyer = () => {
  const [currentPage, setCurrentPage] = useState(1); // State for the current page
  const [orders, setOrders] = useState([]);
  const itemsPerPage = 10; // Number of products per page

  const businessId = sessionStorage.getItem("businessId");


  
  useEffect(() => {
    if (businessId) {
      fetchOrders();
    }
  }, [businessId]); // Re-run when `farmerId` changes

  const fetchOrders = async () => {
    if (!businessId) {
      console.warn("No Logistics ID found in session storage.");
      return;
    }
  
    try {
      const response = await fetch(`https://api.spida.africa/individual/get_order_individual_dashboard.php?individual_id=${businessId}`);
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
    <div className="logistics_dashboard individual_dashboard">
      <div className="delivery_containers">
        <div className="delivery_container">
          <div className="">
            <div className="img">
              <img src={truck1} alt="" />
            </div>
            <div className="text">
              <h3>Ongoing Purchase</h3>
              <h4>{currentOrders.length}</h4>
            </div>
          </div>
        </div>
        <div className="delivery_container">
          <div className="">
            <div className="img">
              <img src={truck2} alt="" />
            </div>
            <div className="text">
              <h3>Pending Purchases</h3>
              <h4>{currentOrders.length}</h4>
            </div>
          </div>
        </div>
        <div className="delivery_container">
          <div className="">
            <div className="img">
              <img src={buy} alt="" />
            </div>
            <div className="text">
              <h3>Total Orders</h3>
              <h4>{currentOrders.length}</h4>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "3fr 1fr",
          //   backgroundColor: "#ffffff",
          gap: "20px",
        }}
      >
        <BusinessAnalytics/>
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
                <li>Delivery Time</li>
                <li>Delivery Date</li>
                <li>Item</li>
                <li>Amount Spent</li>
                <li>Status</li>
              </ul>
            </div>

            <div className="items_body">
              {currentOrders.map((order, index) => (
                <div className="item" key={index}>
                  <ul>
                    <li>{order.id}</li>
                    <li>{order.delivery_time ? order.delivery_time : "Not Delivered"}</li>
                    <li>{order.delivery_date ? order.delivery_date : "Not Delivered"}</li>
                    <li>{order.produce_name}</li>
                    <li>#{order.total_amount}</li>
                    {/* <li>
                      <img src={order.star} alt="" />
                    </li> */}
                    <li>{order.status}</li>
                  </ul>
                </div>
              ))}
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
{/*
      <PieChart />
*/}
    </div>
  );
};

export default BusinessBuyer;
