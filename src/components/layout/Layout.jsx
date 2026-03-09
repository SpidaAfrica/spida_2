
import React, { useState, useEffect } from "react";
import menu from "../../data/sidebar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SidebarItem from "./SidebarItem";

import logouticon from "../../assets/images/icons/logouticon.png";
import notificationicon from "../../assets/images/icons/notificationicon.png";
import userimg from "../../assets/images/icons/userimg.png";
import searchIcon from "../../assets/images/icons/search-icon.png";
import logo from "../../assets/images/logo.png";
import prev from "../../assets/images/icons/prev.png";
import next from "../../assets/images/icons/next.png";

import "./layout.css";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);


  

  // Extract user type from URL
  const getDashboardType = () => {
    if (location.pathname.includes("logistics")) return "logistics";
    if (location.pathname.includes("farmer")) return "farmer";
    if (location.pathname.includes("individual")) return "individual";
    if (location.pathname.includes("business")) return "business"; // Default buyer
    return "default";
  };

  const dashboardType = getDashboardType();

  const logout = () => {
    alert("Logging out");
    sessionStorage.clear(); // Clear all session data
    setIsLoggedIn(false);
    navigate("/login");
  };

  const handleNotifications = () => {
    navigate(`/notifications/${dashboardType}`);
  };

  const handleNavigateHome = () => {
    navigate("/");
  };
  

  // Filter sidebar items based on user type from the URL
  const filteredMenu = menu.filter((item) =>
    item.accountTypes?.includes(dashboardType)
  );

  let name = sessionStorage.getItem(`${dashboardType}Name`);

  if(dashboardType == "logistics"){
       name =  sessionStorage.getItem("companyName");
  }

  return (
    <div className="layout">
      {/* Top Navigation */}
      <div className="top_nav">
        <div onClick={handleNavigateHome} className="logo">
          <img src={logo} alt="Logo" />
        </div>
        <div className="top_nav_items">
          {location.pathname === "/notifications" && (
            <div className="note_page">
              <div className="icons">
                <img src={prev} alt="Previous" />
                <img src={next} alt="Next" />
              </div>
              <h1>Notifications</h1>
            </div>
          )}
          {/* 
          <div className="search">
            <input placeholder="Search" type="search" />
            <img src={searchIcon} alt="Search Icon" className="search_icon" />
          </div>
          */}
          <div onClick={handleNotifications} className="notifications">
            <img src={notificationicon} alt="Notifications" />
            <span>.</span>
          </div>
          <div className="user_info">
            <img src={userimg} alt="User" />
            <div>
              <h3>{name}</h3>
              <p>{dashboardType}</p>
            </div>
          </div>
        </div>
        <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </button>
      </div>

      {/* Main Content */}
      <div className="main_content">
        {/* Sidebar */}
        <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
          <div className="sidebar_content">
            {filteredMenu.map((item, index) => (
              <SidebarItem key={index} item={item} onClick={() => setSidebarOpen(false)} />
            ))}

            {/* Logout Button */}
            <div className="logout_box">
              <Link onClick={logout}>
                <div className="sidebar_item s-parent">
                  <div className="sidebar_title">
                    <span>
                      <div className="icon">
                        <img src={logouticon} alt="Logout" />
                      </div>
                      <div className="title">Log Out</div>
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Dashboard Content */}
        <main style={{ transition: "all .5s" }}>{children}</main>
      </div>
    </div>
  );
};

export default Layout;

