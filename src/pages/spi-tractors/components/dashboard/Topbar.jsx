import { useEffect, useRef, useState } from "react";
import "./Topbar.css";
import { clearSession, getCurrentUser, spiTractorsApi } from "../../api/spiTractorsApi";
import { useNavigate } from "react-router-dom";
import bell from "../../../../assets/images/bell.png";

export default function Topbar() {
  const navigate     = useNavigate();
  const currentUser  = getCurrentUser();

  const [notifOpen,    setNotifOpen]    = useState(false);
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifications,setNotifications]= useState([]);
  const [unreadCount,  setUnreadCount]  = useState(0);
  const [menuOpen,     setMenuOpen]     = useState(false); // mobile user menu

  const panelRef = useRef(null);

  const loadNotifications = async () => {
    try {
      setNotifLoading(true);
      const res  = await spiTractorsApi.myNotifications();
      const list = Array.isArray(res?.data?.items)
        ? res.data.items
        : Array.isArray(res?.data) ? res.data : [];
      setNotifications(list);
      setUnreadCount(Number(res?.data?.unread_count ?? list.filter((x) => !x.read_at).length));
    } catch {
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setNotifLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  // Close panels on outside click
  useEffect(() => {
    const onDocClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setNotifOpen(false);
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const toggleNotifications = async () => {
    const next = !notifOpen;
    setNotifOpen(next);
    setMenuOpen(false);
    if (next) {
      await loadNotifications();
      try {
        await spiTractorsApi.notificationsMarkRead?.();
        setUnreadCount(0);
        setNotifications((prev) =>
          prev.map((n) => ({ ...n, read_at: n.read_at || new Date().toISOString() }))
        );
      } catch {}
    }
  };

  const onLogout = async () => {
    try { await spiTractorsApi.logout(); } catch {}
    clearSession();
    navigate("/Spi_Tractors_Login");
  };

  const firstLetter = (currentUser?.email || "S").slice(0, 1).toUpperCase();
  const displayName = currentUser?.full_name || currentUser?.email?.split("@")[0] || "User";

  return (
    <div className="topbar" ref={panelRef}>
      <div className="topbar-spacer" />

      <div className="topbar-actions">
        {/* Bell */}
        <button
          className="bell-btn"
          style={{ background: "#fff" }}
          onClick={toggleNotifications}
          title="Notifications"
        >
          <img className="bell-ic" src={bell} style={{ width: "20px" }} alt="notifications" />
          {unreadCount > 0 && (
            <span className="bell-badge">{unreadCount > 99 ? "99+" : unreadCount}</span>
          )}
        </button>

        {/* Notification panel */}
        {notifOpen && (
          <div className="notif-pop">
            <div className="notif-head">
              <div className="notif-title">Notifications</div>
              <button className="notif-refresh" onClick={loadNotifications} type="button">↻</button>
            </div>
            <div className="notif-body">
              {notifLoading ? (
                <div className="notif-empty">Loading...</div>
              ) : notifications.length === 0 ? (
                <div className="notif-empty">No notifications yet.</div>
              ) : (
                notifications.map((n) => (
                  <div key={n.id} className={`notif-item ${!n.read_at ? "unread" : ""}`}>
                    <div className="notif-msg">{n.message}</div>
                    {n.meta?.request_code && (
                      <div className="notif-mini">Request: <b>{n.meta.request_code}</b></div>
                    )}
                    <div className="notif-time">{n.created_at}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Avatar + mobile menu toggle */}
        <button
          className="topbar-avatar-btn"
          onClick={() => { setMenuOpen((v) => !v); setNotifOpen(false); }}
          title="Account"
        >
          <div className="topbar-avatar">{firstLetter}</div>
          <div className="topbar-name desktop-only">{currentUser?.role || "Owner"}</div>
        </button>

        {/* Mobile user dropdown */}
        {menuOpen && (
          <div className="topbar-user-menu">
            <div className="tum-name">{displayName}</div>
            <div className="tum-email">{currentUser?.email || ""}</div>
            <div className="tum-divider" />
            <button className="tum-item" onClick={() => { navigate("/Spi_Tractors-Settings"); setMenuOpen(false); }}>
              ⚙ Settings
            </button>
            <button className="tum-item danger" onClick={onLogout}>
              ⎋ Sign out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
