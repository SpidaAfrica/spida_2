import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/images/spicom.png";
import "./nav.css";

const Nav = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavigateHome = () => {
    navigate("/");
  };

  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
  };

  const closeMenu = () => setMenuOpen(false);

  // ✅ Check for token on component mount
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // ✅ Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };
  const goToDashboard = () => {
    const userType = sessionStorage.getItem("userType"); // ✅ Fix: retrieve userType
    if (userType) {
      navigate(`/dashboard/${userType}`);
    } else {
      console.warn("No userType found");
    }
  };
  

  return (
    <header>
      <nav className="navbar">
        <div onClick={handleNavigateHome} className="logo">
          <a href="/"><img src={logo} alt="Logo" /></a> 
        </div>

        <div className="hamburger" onClick={toggleMenu}>
          <span className={menuOpen ? "bar open" : "bar"}></span>
          <span className={menuOpen ? "bar open" : "bar"}></span>
          <span className={menuOpen ? "bar open" : "bar"}></span>
        </div>

        <div className={`nav_items ${menuOpen ? "show" : ""}`}>
          <ul>
            <li><NavLink onClick={closeMenu} to="/marketplace">Marketplace</NavLink></li>
            <li><NavLink onClick={closeMenu} to="/">Home</NavLink></li>
            <li><NavLink onClick={closeMenu} to="/about">About us</NavLink></li>
            <li><NavLink onClick={closeMenu} to="/faqs">Faqs</NavLink></li>
            <li><NavLink onClick={closeMenu} to="/contact">Contact us</NavLink></li>
            <li><NavLink onClick={closeMenu} to="/news">News blog</NavLink></li>
          </ul>

          <div className="user_account">
            {isLoggedIn ? (
              <>
                <div className="logged_in_buttons">
                  <button onClick={goToDashboard} className="logout" style={{marginRight:10}}>Dashboard</button>
                  <button onClick={handleLogout} className="logout">Logout</button>
                </div>
              </>
            ) : (
              <div className="login_buttons">
                <Link to="/login"><button className="login">Login</button></Link>
                <Link to="/register"><button className="register">Sign up</button></Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Nav;
