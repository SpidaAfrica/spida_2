import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import "./Sidebar.css";
import MobileNav from "./MobileNav";
import "./MobileNav.css";
import { clearSession, getCurrentUser, spiTractorsApi } from "../../api/spiTractorsApi";
import logo    from "../../../../assets/images/logo2.png";
import home    from "../../../../assets/images/category.png";
import request from "../../../../assets/images/elements (8).png";
import earning from "../../../../assets/images/elements (7).png";
import booking from "../../../../assets/images/elements (6).png";
import req     from "../../../../assets/images/message-2.png";

export default function Sidebar() {
  const navigate = useNavigate();
  const [me, setMe] = useState(() => getCurrentUser() || null);

  const linkClass = ({ isActive }) => (isActive ? "nav-item active" : "nav-item");

  useEffect(() => {
    spiTractorsApi
      .me()
      .then((res) => {
        const u = res?.data?.user || res?.data || null;
        if (u) setMe(u);
      })
      .catch(() => {
        clearSession();
        navigate("/Spi_Tractors_Login");
      });
  }, [navigate]);

  const displayName = useMemo(() => {
    if (!me) return "User";
    return me.full_name || me.name || (me.email ? me.email.split("@")[0] : "User");
  }, [me]);

  const avatarLetter = useMemo(() => {
    const s = String(displayName || "").trim();
    return s ? s[0].toUpperCase() : "U";
  }, [displayName]);

  const onLogout = async () => {
    try { await spiTractorsApi.logout(); } catch {}
    clearSession();
    navigate("/Spi_Tractors_Login");
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sidebar">
        <div
          className="sidebar-brand"
          onClick={() => navigate("/Spi_Tractors-Dashboard")}
          role="button"
          tabIndex={0}
        >
          <div className="brand-name"><img src={logo} alt="Spida" /></div>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/Spi_Tractors-Dashboard" className={linkClass} end>
            <span className="nav-ic"><img src={home} alt="" /></span>Home
          </NavLink>
          <NavLink to="/Spi_Tractors-Dashboard-Requests" className={linkClass}>
            <span className="nav-ic"><img src={req} alt="" /></span>Requests
          </NavLink>
          <NavLink to="/Spi_Tractors-Dashboard-Bookings" className={linkClass}>
            <span className="nav-ic"><img src={booking} alt="" /></span>Bookings
          </NavLink>
          <NavLink to="/Spi_Tractors-Dashboard-Earnings" className={linkClass}>
            <span className="nav-ic"><img src={earning} alt="" /></span>Earnings
          </NavLink>
          <NavLink to="/Spi_Tractors-Dashboard-Manage-Equipment" className={linkClass}>
            <span className="nav-ic"><img src={request} alt="" /></span>Manage Equipment
          </NavLink>
        </nav>

        <div className="sidebar-foot">
          <NavLink to="/Spi_Tractors-Settings" className={linkClass}>
            <span className="nav-ic">⚙</span>Settings
          </NavLink>

          <div className="sidebar-user">
            <div className="avatar">{avatarLetter}</div>
            <div className="user-meta">
              <div className="user-name">{displayName}</div>
              <div className="user-email">{me?.email || ""}</div>
              <button className="signout" type="button" onClick={onLogout}>
                <span className="nav-ic">⎋</span> Sign out
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile bottom nav — only visible on small screens */}
      <MobileNav />
    </>
  );
}
