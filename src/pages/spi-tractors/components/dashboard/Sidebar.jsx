import { NavLink } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
  const linkClass = ({ isActive }) => (isActive ? "nav-item active" : "nav-item");

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-name">Spida</div>
        <div className="brand-mark">🍃</div>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/Spi_Tractors-Dashboard" className={linkClass}>
          <span className="nav-ic">▦</span>
          Home
        </NavLink>

        <NavLink to="/Spi_Tractors-Dashboard-Requests" className={linkClass}>
          <span className="nav-ic">☰</span>
          Requests
        </NavLink>

        <NavLink to="/Spi_Tractors-Dashboard-Bookings" className={linkClass}>
          <span className="nav-ic">📅</span>
          Bookings
        </NavLink>

        <NavLink to="/Spi_Tractors-Dashboard-Earnings" className={linkClass}>
          <span className="nav-ic">💰</span>
          Earnings
        </NavLink>

        <NavLink to="/Spi_Tractors-Dashboard-Manage-Equipment" className={linkClass}>
          <span className="nav-ic">🚜</span>
          Manage Equipment
        </NavLink>
      </nav>

      <div className="sidebar-foot">
        <NavLink to="/settings" className={linkClass}>
          <span className="nav-ic">⚙</span>
          Settings
        </NavLink>

        <div className="sidebar-user">
          <div className="avatar">S</div>
          <div className="user-meta">
            <div className="user-name">Sanusi Olamide</div>
            <button className="signout" type="button">
              <span className="nav-ic">⎋</span> Sign out
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
