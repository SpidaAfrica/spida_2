import React from "react";
import { NavLink } from "react-router-dom";

const SidebarItem = ({ item }) => {
  return (
    <NavLink to={item.path} className={({ isActive }) => (isActive ? "active-link" : "link")}>
      <div className="sidebar_item">
        <div className="sidebar_title">
          <div>
            <span>
              {item.icon && <div className="icon">{item.icon}</div>}
              <div className="title">{item.title}</div>
            </span>
          </div>
        </div>
      </div>
    </NavLink>
  );
};

export default SidebarItem;
