
import React, { useState, useEffect } from "react";
import "./checkout.css";
import { useNavigate } from "react-router-dom";
import Nav from "../../../components/Header/Nav";
import Footer from "../../../components/Footer/Footer";

const Checkout = () => {
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("userId");
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [formData, setFormData] = useState({
    user_id: "",
    userType: "",
    name: "",
    mobile_number: "", // Fix key mismatch (was mobileNumber)
    email: "",
    location: "",
    address: "",
    landmarks: "",
  });
  
  useEffect(() => {
    let userType = sessionStorage.getItem("userType");
    let userId = sessionStorage.getItem("userId");
  
    if (userType === "individual") {
      userId = sessionStorage.getItem("individualId");
    } else if (userType === "farmer") {
      userId = sessionStorage.getItem("farmerId");
    } else if (userType === "logistics") {
      userId = sessionStorage.getItem("logisticsId");
    }
  
    if (!userType) {
      userId = sessionStorage.getItem("userId");
      userType = "guest";
    }
  
    console.log("UserType:", userType);
    console.log("UserId:", userId);
  
    // Update state properly
    setFormData((prev) => ({
      ...prev,
      user_id: userId,
      userType: userType,
    }));
  }, []);
  


  

  useEffect(() => {
        let userType = sessionStorage.getItem("userType");
        let userId = sessionStorage.getItem("userId");
    
        if (userType === "individual") {
        userId = sessionStorage.getItem("individualId");
        } else if (userType === "farmer") {
        userId = sessionStorage.getItem("farmerId");
        } else if (userType === "logistics") {
        userId = sessionStorage.getItem("logisticsId");
        } else if (userType === "business") {
          userId = sessionStorage.getItem("businessId");
        }
    
        if (!userType) {
        userId = sessionStorage.getItem("userId");
        userType = "guest";
        }

    fetch(`https://api.spida.africa/individual/get_individual_cart.php?user_id=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setCart(data.cart);
        setTotal(data.cart.reduce((acc, item) => acc + item.price_per_unit * item.quantity, 0));
      });
  }, []);

  const handlePayment = () => {
    alert("Proceeding to payment...");
    navigate("/payment");
  };
/*
  const handleSubmit = () => {
    fetch("https://api.spida.africa/individual/delivery_info.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.success || data.error);
      })
      .catch((err) => console.error("Error submitting delivery info:", err));
  };
*/

  const handleCheckout = () => {
    let userType = sessionStorage.getItem("userType");
    let userId = sessionStorage.getItem("userId");

    if (userType === "individual") {
    userId = sessionStorage.getItem("individualId");
    } else if (userType === "farmer") {
    userId = sessionStorage.getItem("farmerId");
    } else if (userType === "logistics") {
    userId = sessionStorage.getItem("logisticsId");
    } else if (userType === "business") {
      userId = sessionStorage.getItem("businessId");
    }

    if (!userType) {
    userId = sessionStorage.getItem("userId");
    userType = "guest";
    }
    fetch("https://api.spida.africa/individual/process_orders.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        total_amount: total,
        items: cart,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          sessionStorage.setItem("lastOrderId", data.order_id);
          alert("Order placed successfully!");
  
          setCart([]); // Clear frontend cart
          sessionStorage.removeItem("cart");
  
          navigate("/order-confirmation"); // Redirect user
        } else {
          alert("Order failed: " + data.message);
        }
      })
      .catch((error) => console.error("Order error:", error));
  };

  
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = () => {
        const updatedData = {
          ...formData,
          user_id: userId,
          userType: sessionStorage.getItem("userType") || "guest",
        };
      
        fetch("https://api.spida.africa/logistics/delivery_info.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("Response:", data);
            alert(data.success || data.error);
          })
          .catch((err) => console.error("Error updating delivery info:", err));
      };
      
  

  return (
<div>
    <Nav />
    <div className="checkout-container">
      <div className="checkout-box">
        <div className="delivery-info">
            <h3>Delivery Information</h3>
            <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange}  required/>
            <input type="text" name="mobile_number" placeholder="Mobile Number" value={formData.mobile_number} onChange={handleChange} required/>
            <input type="text" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required/>
            <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} required/>
            <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} required/>
            <input type="text" name="landmarks" placeholder="Landmarks" value={formData.landmarks} onChange={handleChange} required/>
            <button onClick={handleSubmit}>Save</button>
        </div>
        <div className="payment-info">
          <h3>Payment Information</h3>
          <input type="text" placeholder="Name on Card" value="Ellen Yaro Esho" disabled />
          <input type="text" placeholder="Card Number" value="1234-3456-5680-8856" disabled />
          <div className="card-details">
            <input type="text" placeholder="Expiry Date" value="06/25" disabled />
            <input type="text" placeholder="CVV" value="123" disabled />
          </div>
          <button onClick={handlePayment}>PROCEED TO PAY</button>
        </div>
        <div className="order-summary">
          <h3>Order Summary</h3>
          {cart.map((item) => (
            <div key={item.id} className="order-item">
              <img src={`https://api.spida.africa/farmer/${item.product_image}`} alt={item.produce_name} />
              <div>
                <h4>{item.produce_name}</h4>
                <p>#{item.price_per_unit} per {item.unit}</p>
                <div className="quantity-controls">
                  <button>-</button>
                  <input type="number" value={item.quantity} readOnly />
                  <button>+</button>
                </div>
              </div>
            </div>
          ))}
          <h3>Total: #{total}</h3>
          <button onClick={handleCheckout}>CONFIRM ORDER</button>
        </div>
      </div>
      {/*
      <div className="order-tracking">
        <h3>Order Tracking</h3>
        <img src="/tracking-map.png" alt="Order Tracking Map" />
        <button>CONFIRM DELIVERY</button>
      </div>
      */}
    </div>
    <section className="footer_section">
      <Footer />
    </section>
</div>
  );
};

export default Checkout;


