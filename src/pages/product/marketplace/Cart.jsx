import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import CartContext from "../../../CartContext";
import "./cart.css";
import Nav from "../../../components/Header/Nav";
import Footer from "../../../components/Footer/Footer";

const Cart = () => {
  const { cart, setCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setTotal(cart.reduce((acc, item) => acc + item.price_per_unit * item.quantity, 0));
  }, [cart]);

  const removeFromCart = (cartId) => {    
    let userType = sessionStorage.getItem("userType");
    let userId = sessionStorage.getItem(`${userType}Id`);
    fetch("https://api.spida.africa/individual/remove_from_cart.php", {
      method: "POST",
      body: JSON.stringify({ cart_id: cartId,  user_id: userId }),
      headers: { "Content-Type": "application/json" },
    }).then(() => {
      setCart(cart.filter((item) => item.id !== cartId));
    });
  };


  let userType = sessionStorage.getItem("userType");
  let userId = sessionStorage.getItem(`${userType}Id`);

  if (!userType) {
  userId = sessionStorage.getItem("userId");
  userType = "guest";
  }


  useEffect(() => {

    fetch(`https://api.spida.africa/individual/get_individual_cart.php`, {
      method: "POST",
      body: JSON.stringify({ user_id: userId }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.cart) {
          setCart(data.cart);
          console.log(data);
        }
      })
      .catch((error) => console.error("Error fetching cart:", error));
  }, [setCart]);

  const updateQuantity = (cartId, newQuantity) => {
    const userId = sessionStorage.getItem("userId");

    if (newQuantity < 1) return; // Prevents setting quantity below 1

    fetch("https://api.spida.africa/individual/update_cart_quantity.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cart_id: cartId, quantity: newQuantity, user_id: userId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCart(
            cart.map((item) => (item.id === cartId ? { ...item, quantity: newQuantity } : item))
          );
        }
      })
      .catch((error) => console.error("Error updating quantity:", error));
  };


  const clearCart = () => {
    fetch("https://api.spida.africa/individual/clear_cart.php", {
      method: "POST",
      body: JSON.stringify({ user_id: userId }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCart([]); // Clear the local state too
        } else {
          alert("Failed to clear cart.");
        }
      })
      .catch((error) => {
        console.error("Error clearing cart:", error);
        alert("Error clearing cart.");
      });
  };
  

  return (
<div>
   <Nav />
    <div className="cart-container">
      <h2>Cart</h2>
      {cart.length > 0 ? (
        cart.map((item) => (
        <div className="cart-item" key={item.id}>
            <img src={`https://api.spida.africa/farmer/${item.product_image}`} alt={item.produce_name} />
            <div className="details">
                <h3>{item.produce_name}</h3>
                <p>Harvest Date: {item.harvest_date}</p>
                <p>#{item.price_per_unit} per {item.unit}</p>
                <div className="quantity-controls">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                    <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                    min="1"
                    />
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>
              <button className="delete-btn" onClick={() => removeFromCart(item.id)}>Delete</button>
            </div>
          </div>
        ))
      ) : (
        <p>Your cart is empty.</p>
      )}
      <h3>Total: #{total.toLocaleString()}</h3>
      <div className="cart-buttons">
        <button onClick={() => navigate("/marketplace")}>Buy More Produce</button>
        <button className="delete" onClick={clearCart}>Clear Cart</button>
        <button onClick={() => navigate("/checkout")}>Checkout!</button>
      </div>    
    </div>
    <section className="footer_section">
      <Footer />
    </section>
</div>
  );
};

export default Cart;

