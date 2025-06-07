import React from "react";
import { Link } from "react-router-dom";

import readyimg from "../../assets/images/readyimg.png"

import "./ready.css";

const ReadyToConnect = () => {
  return (
    <div className="ready_to_connect">
      <div className="ready_item">
        <h1>Ready to connect, deliver, and thrive?</h1>
        <p>
          SPIDA is your all-in-one platform that empowers farmers to sell
          directly, enables logistics providers to manage seamless deliveries,
          and gives buyers easy access to fresh, cheap and quality farm produce.
        </p>
        <Link to="/register">
          <button>Get Started</button>
        </Link>
      </div>
      <div className="ready_item">
        <img src={readyimg} alt="" />
      </div>
    </div>
  );
};

export default ReadyToConnect;
