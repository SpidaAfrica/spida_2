import { createContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Load cart from localStorage (in case of page refresh)
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart"));
    if (savedCart) {
      setCart(savedCart);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Get user ID or generate a guest ID
  const getUserId = () => {
    let userType = sessionStorage.getItem("userType");
    let userId = sessionStorage.getItem(`${userType}Id`);

    if (!userType) {
    userId = sessionStorage.getItem("userId");
    userType = "guest";
    }

    return userId;
  };

  // Add product to cart
  const addToCart = async (product) => {
    const user_id = getUserId();

    try {
      const response = await fetch("https://api.spida.africa/individual/individual_add_to_cart.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user_id, // Corrected key
          product_id: product.id,
          quantity: 1,
        }),
      });

      const data = await response.json();


      if (data.message === "Product added to cart") {
        // Avoid duplicate entries in the cart
        const existingItem = cart.find((item) => item.id === product.id);
        if (!existingItem) {
          setCart([...cart, { ...product, quantity: 1 }]);
        }
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <CartContext.Provider value={{ cart, setCart, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
