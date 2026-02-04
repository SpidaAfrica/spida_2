import React from "react";

import flower1 from "../../../assets/images/product/flower1.png";
import flower2 from "../../../assets/images/product/flower2.png";
import closeCircle from "../../../assets/images/close-circle.png";

import "./decline.css";

const Decline = () => {
  return (
    <div className="decline_orders_page">
      <div className="decline_container">
        <img src={closeCircle} alt="" className="close_circle" />
        <h1>Order Declined</h1>
        <div className="form_field">
          <div>
            <label htmlFor="email">Reason for Decline</label>
            <select name="email" placeholder="Enter your Email Address">
              <option value="1">Item not available</option>
              <option value="2">Vehicles not available</option>
              <option value="3">Others</option>
            </select>
          </div>
        </div>
      </div>

      <img src={flower1} alt="" className="flower1" />
      <img src={flower2} alt="" className="flower2" />
    </div>
  );
};

export default Decline;
