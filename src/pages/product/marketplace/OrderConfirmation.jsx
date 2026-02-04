import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./orderConfirmation.css";
import Nav from "../../../components/Header/Nav";
import Footer from "../../../components/Footer/Footer";

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const orderId = sessionStorage.getItem("lastOrderId"); // Retrieve order ID

  useEffect(() => {
    if (!orderId) {
      navigate("/"); // Redirect if no order ID
      return;
    }

    fetch(`https://api.spida.africa/individual/get_order_details.php?order_id=${orderId}`)
      .then((res) => res.json())
      .then((data) => setOrderDetails(data))
      .catch((error) => console.error("Error fetching order:", error));
  }, [orderId, navigate]);

  if (!orderDetails) {
    return <p>Loading order details...</p>;
  }

  return (
<div>
    <Nav />
    <div className="order-confirmation-container">
      <h2>Order Confirmation</h2>
      <p>Thank you for your purchase! Your order ID is <strong>#{orderDetails.order_id}</strong>.</p>
      
      <div className="order-summary">
        <h3>Order Summary</h3>
        {orderDetails.items.map((item) => (
          <div key={item.id} className="order-item">
            <img src={`https://api.spida.africa/farmer/${item.product_image}`} alt={item.produce_name} />
            <div>
              <h4>{item.produce_name}</h4>
              <p>Quantity: {item.quantity}</p>
              <p>Price: #{item.price}</p>
            </div>
          </div>
        ))}
        <h3>Total: #{orderDetails.total_amount}</h3>
      </div>
      <p>use this link to track your order: <Link to={`/order-confirmation/${orderDetails.order_id}`}>https://spi-ecommerce.spida.africa/order-confirmation/{orderDetails.order_id}</Link></p>
      <div className="cart-buttons">
        <button onClick={() => navigate("/")}>Back to Home</button>
        <button onClick={() => navigate(`/order-confirmation/${orderDetails.order_id}`)}>Go to Tracking Page</button>
      </div> 
    </div>
    <section className="footer_section">
      <Footer />
    </section>
</div>
  );
};

export default OrderConfirmation;
