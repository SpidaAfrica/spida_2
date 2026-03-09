/*
import React from "react";
import { Link, useNavigate } from "react-router-dom";

import loginImg from "../../../../assets/images/product/loginimg.png";
import flower1 from "../../../../assets/images/product/flower1.png";
import flower2 from "../../../../assets/images/product/flower2.png";
import flower3 from "../../../../assets/images/product/flower3.png";

import "./login.css";

const Login = () => {
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault();
    alert("Logging");
    navigate("/dashboard/:type");
  };

  return (
    <div className="login_page">
      <div className="login_container">
        <div className="login_item">
          <img src={loginImg} alt="" />
        </div>
        <div className="login_item login_item_form">
          <h1>Welcome back</h1>
          <p>Login with appropriate details</p>
          <form onSubmit={handleLogin} className="login_form">
            <div className="form_field">
              <div>
                <label htmlFor="email">Email Address</label>
                <input
                  name="email"
                  type="email"
                  placeholder="Enter your Email Address"
                />
              </div>
            </div>
            <div className="form_field">
              <div>
                <label htmlFor="password">Password</label>
                <input
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                />
              </div>
            </div>
            <div className="other_actions">
              <div className="">
                <input type="checkbox" name="" id="" /> <span>Remember me</span>
              </div>
              <Link to="/forgot">Forgot password?</Link>
            </div>
            <button type="submit">Login</button>
          </form>
          <p className="no_account">
            Dont have an account? <Link to="/register">Sign-up</Link>
          </p>
        </div>
      </div>
      <img src={flower1} alt="" className="flower1" />
      <img src={flower2} alt="" className="flower2" />
      <img src={flower3} alt="" className="flower3" />
    </div>
  );
};

export default Login;

*/


import React, { useState, useEffect } from "react";
import { Link, useNavigate} from "react-router-dom";

import loginImg from "../../../../assets/images/product/loginimg.png";
import flower1 from "../../../../assets/images/product/flower1.png";
import flower2 from "../../../../assets/images/product/flower2.png";
import flower3 from "../../../../assets/images/product/flower3.png";

import "./login.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("farmer"); // Default to farmer
  const [loading, setLoading] = useState(false);
  

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loading state
    const guestId = sessionStorage.getItem("guestId");
  
    try {
      // Fetch user details after successful login
      const response = await fetch("https://api.spida.africa/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, userType, guest_id: guestId }),
      });
  
      const data = await response.json();
  
      if (data.success) {
        // Store user ID

        sessionStorage.setItem("userType", userType);
        sessionStorage.setItem(`${userType}Id`, data.userId);
        sessionStorage.setItem("token", data.token);
  
        // Fetch additional user details (name)
        const nameRes = await fetch(`https://api.spida.africa/${userType}/${userType}.php?${userType}_id=${data.userId}`);
        const userDetails = await nameRes.json();
        console.log(userDetails);
  
        if (userDetails.length > 0) {
            if(userType == "logistics"){
              sessionStorage.setItem(`companyName`, userDetails[0].company_name);
            }

            if(userType == "business"){
                sessionStorage.setItem(`businessName`, userDetails[0].business_name);
              }else{
                sessionStorage.setItem(`${userType}Name`, userDetails[0].full_name);
              }
            }
         else {
          console.warn("User details not found.");
        }
  
        // Navigate to user dashboard
        navigate(`/dashboard/${userType}`);
      } else {
        alert("Login failed: " + data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred. Please try again.");
    }finally {
      setLoading(false); // Hide loading state
    }
  };
  

  return (
    <div className="login_page">
      <div className="login_container">
        <div className="login_item">
          <img src={loginImg} alt="" />
        </div>
        <div className="login_item login_item_form">
          <h1>Welcome back</h1>
          <p>Login with appropriate details</p>
          <form onSubmit={handleLogin} className="login_form">
            <div className="form_field">
              <div>
                <label htmlFor="email">Email Address</label>
                <input
                  name="email"
                  type="email"
                  placeholder="Enter your Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form_field">
              <div>
                <label htmlFor="password">Password</label>
                <input
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* User Type Selection */}
            <div className="form_field">
              <div>
                <label htmlFor="userType">Login As</label>
                <select
                  name="userType"
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                >
                  <option value="farmer">Farmer</option>
                  <option value="logistics">Logistics</option>
                  <option value="business">Business Buyer</option>
                  <option value="individual">Individual Buyer</option>
                </select>
              </div>
            </div>

            <div className="other_actions">
              <div>
                <input type="checkbox" /> <span>Remember me</span>
              </div>
              <Link to="/forgot">Forgot password?</Link>
            </div>
            <button type="submit" target="_blank" disabled={loading}>
          {loading ? "logging in..." : "Login"}
            </button>
          </form>
          <p className="no_account">
            Don't have an account? <Link to="/register">Sign-up</Link>
          </p>
        </div>
      </div>
      <img src={flower1} alt="" className="flower1" />
      <img src={flower2} alt="" className="flower2" />
      <img src={flower3} alt="" className="flower3" />
    </div>
  );
};

export default Login;

