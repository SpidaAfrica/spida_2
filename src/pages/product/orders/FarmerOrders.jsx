

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import prev from "../../../assets/images/icons/prev.png";
import next from "../../../assets/images/icons/next.png";
import "./farmerOrders.css";

//import "./logisticorders.css";

const FarmOrders = () => {
  const [orders, setOrders] = useState([]);
  const farmerId = sessionStorage.getItem("farmerId"); // Get logged-in farmer's ID
  const [currentPage, setCurrentPage] = useState(1); // State for the current page
  const itemsPerPage = 10; // Number of products per page
  const navigate = useNavigate();



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
    <div className="logistics_orders_page">
      <div className="recent_orders pickup_summaries">
        <h1>Available Orders</h1>

        <div className="order_items">
          {/* Header Section */}
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

          {/* Body Section */}
          <div className="items_body">
            {currentOrders.map((order, index) => (
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

          <div className="order_cards">
            {currentOrders.map((order, index) => (
              <div className="order_card" key={index}>
                <div><strong>Order ID:</strong> {order.order_id}</div>
                <div><strong>Produce:</strong> {order.produce_name}</div>
                <div><strong>Quantity:</strong> {order.quantity}</div>
                <div><strong>Price:</strong> #{order.price}</div>
                <div><strong>Total:</strong> #{order.total_amount}</div>
                <div><strong>Status:</strong> {order.status}</div>
                <div><strong>Buyer:</strong> {order.name}</div>
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

export default FarmOrders;

