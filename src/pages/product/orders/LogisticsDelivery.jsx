import React, { useState, useEffect } from "react";



import deliveryvan from "../../../assets/images/deliveryvan.png";
import map from "../../../assets/images/map.png";
import dprogress from "../../../assets/images/icons/dprogress.png";
import dest from "../../../assets/images/icons/dest.png";
import message from "../../../assets/images/icons/message.png";
import ownerImg from "../../../assets/images/icons/ownerImg.png";
import prev from "../../../assets/images/icons/prev.png";
import next from "../../../assets/images/icons/next.png";
import DeliveryMap from "../../../components/orders/DeliveryMap";

const OngoingDelivery = () => {
  const [currentPage, setCurrentPage] = useState(1); // State for the current page
  const itemsPerPage = 10; // Number of products per page
    const [orders, setOrders] = useState([]);
    const logisticsId = sessionStorage.getItem("logisticsId")
  
    useEffect(() => {
      if (logisticsId) {
        fetchOrders();
      }
    }, [logisticsId]); // Re-run when `logisticsId` changes
  
    const fetchOrders = async () => {
      if (!logisticsId) {
        console.warn("No Logistics ID found in session storage.");
        return;
      }
    
      try {
        const response = await fetch(`https://api.spida.africa/logistics/get_order_delivery.php?logistics_id=${logisticsId}`);
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
    <div className="ongoing_delivery_page">
      <h1>Ongoing Delivery</h1>
      <div className="delivery_items">     
      {currentOrders.map((order, index) => (
      <div className="delivery_items">
        <div className="delivery_item">
          <div className="shipment_info">
            <div className="">
              <h4>Shipment number</h4>
              <h1>SPIDA-00123</h1>
              <p>{order.produce_name}</p>
            </div>
            <img src={deliveryvan} alt="" />
          </div>
          <div className="locations">
            <div className="">
              <img src={dprogress} alt="" />
              <div className="">
                <h3>{order.farm_name}</h3>
                <p>{order.farm_address}</p>
              </div>
            </div>
            <div className="">
              <img src={dest} alt="" />
              <div className="">
                <h3>{order.location}</h3>
                <p>{order.address}</p>
              </div>
            </div>
          </div>
          <div className="owner">
            <div className="">
              <img src="" alt="" />
              <div className="">
                <h3>Order By</h3>
                <h1>{order.name}</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
        ))}
      </div>
      <div className="map">
        {/* <img src={map} alt="" /> */}
        <DeliveryMap orders={orders} />
      </div>

      <div className="recent_orders pickup_summaries">
        <div className="all_orders_page_header">
          <h1>Deliveries</h1>
          <h3>
            Sort by:{" "}
            <select name="sortBy" id="">
              <option value="completed">Completed</option>
            </select>
          </h3>
        </div>

        <div className="order_items">
          {/* Header Section */}
          <div className="items_head">
            <ul>
              <li>Order ID</li>
              <li>Delivery Time</li>
              <li>Delivery Date</li>
              <li>Item</li>
              <li>Pickup Location</li>
              <li>Status</li>
            </ul>
          </div>

          {/* Body Section */}
          <div className="items_body">
            {currentOrders.map((order, index) => (
              <div className="item" key={index}>
                <ul>
                  <li>{order.id}</li>
                  <li>{order.delivery_time ? order.delivery_time : "Not Delivered"}</li>
                  <li>{order.delivery_date ? order.delivery_date : "Not Delivered"}</li>
                  <li>{order.produce_name}</li>
                  <li>{order.address}</li>
                  <li>{order.status}</li>
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
                    <p><strong>Order ID:</strong> {order.id}</p>
                    <p><strong>Delivery Time:</strong> {order.delivery_time ? order.delivery_time : "Not Delivered"}</p>
                    <p><strong>Delivery Date:</strong> {order.delivery_date ? order.delivery_date : "Not Delivered"}</p>
                    <p><strong>Item:</strong> {order.produce_name}</p>
                    <p><strong>Pickup Location:</strong> {order.address}</p>
                    <p><strong>Status:</strong> <span className={`status ${order.status.toLowerCase()}`}>{order.status}</span></p>
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
    </div>
  );
};

export default OngoingDelivery;
