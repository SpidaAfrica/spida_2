import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./TrackingPage.css";
import Nav from "../../../components/Header/Nav";
import Footer from "../../../components/Footer/Footer";

const statusProgressMap = {
  Pending: 20,
  Accepted: 40,
  Picked: 60,
  Confirmed: 80,
  Completed: 100,
};

const statusDescriptions = {
  Pending: "Your order has been placed successfully and is awaiting acceptance by a logistics provider.",
  Accepted: "A logistics company has accepted your order and is preparing for pickup.",
  Picked: "The logistics provider has picked up the produce from the farm.",
  Confirmed: "The farmer has confirmed that the produce has been picked up.",
  Completed: "Your order has been delivered successfully to the destination.",
};

const TrackingPage = () => {
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const orderId = sessionStorage.getItem("lastOrderId");

  useEffect(() => {
    if (!orderId) {
      navigate("/");
      return;
    }

    fetch(`https://api.spida.africa/individual/get_order_details.php?order_id=${orderId}`)
      .then((res) => res.json())
      .then((data) => setOrderDetails(data))
      .catch((error) => console.error("Error fetching order:", error));
  }, [orderId, navigate]);

  if (!orderDetails) return <p>Loading order details...</p>;

  const progress = statusProgressMap[orderDetails.status] || 0;

  return (
    <div>
      <Nav />

      <section className="tracking_section">
        <h2>Order Tracking</h2>
        <p>Order ID: {orderDetails.order_id}</p>
        <p>Status: <strong>{orderDetails.status}</strong></p>

        <div className="progress_container">
          <div className="progress_bar" style={{ width: `${progress}%` }}></div>
        </div>

        <ul className="status_labels">
          {Object.keys(statusProgressMap).map((status, index) => (
            <li key={index} className={progress >= statusProgressMap[status] ? "active" : ""}>
              <h4>{status}</h4>
              <p className="status_description">{statusDescriptions[status]}</p>
            </li>
          ))}
        </ul>
      </section>

      <Footer />
    </div>
  );
};

export default TrackingPage;
