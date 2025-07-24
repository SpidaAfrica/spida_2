import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import heart from "../../assets/images/icons/heart.png";
import heart_fill from "../../assets/images/icons/heart_fill.png";
import UserContext from "../../UserContext";
import CartContext from "../../CartContext";

import "./productItem.css";

const ProductItem = ({ product, isSelected, onSelect }) => {
  const navigate =  useNavigate();
  const { userId } = useContext(UserContext);
  const { addToCart } = useContext(CartContext);
  const handleSelectProduct = () => {
    onSelect(product.id);
  };

  const [isLiked, setIsLiked] = useState(false);

  const toggleLike = () => setIsLiked(!isLiked);

  const handleAddToCart = async () => {
    await addToCart(product,userId); // Add item to cart
    navigate("/cart"); // Redirect to cart
  };

  return (
    <div
      onClick={handleSelectProduct}
      className={isSelected ? "product_item selected" : "product_item"}
    >
      <div className="product_img">
        <img className="img" src={`https://api.spida.africa/farmer/${product.product_image}`} alt="" />
        <img
          onClick={toggleLike}
          className="heart"
          src={isLiked ? heart_fill : heart}
          alt=""
        />
      </div>
      <div className="product_details">
        <h3>Region: {product.region}</h3>
        <p>
          {product.farm_address} <span>Harvest Date: {product.harvest_date}</span>
        </p>
        <h1>{product.produce_name}</h1>
        <div className="stars_ratings">
          <img src={product.star} alt="" />
          <span>{product.rating} (verified Ratings)</span>
        </div>
        <h1>
          #{product.price_per_unit} per {product.unit}{" "}
          <span>
            ({product.available} {product.unit} available)
          </span>
        </h1>
        <h4>
           {product.quantity_moq} MOQ{product.unit}
        </h4>
        <button onClick={handleAddToCart}>Add to cart</button>
      </div>
    </div>
  );
};

export default ProductItem;
