import { useEffect, useRef, useState } from "react";
import "./Topbar.css";
import { getCurrentUser, spiTractorsApi } from "../../api/spiTractorsApi";

export default function Topbar() {
  const currentUser = getCurrentUser();

  const [notifOpen, setNotifOpen] = useState(false);
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const [adminUsers, setAdminUsers] = useState(0);

  const panelRef = useRef(null);

  const loadNotifications = async () => {
    try {
      setNotifLoading(true);
      const res = await spiTractorsApi.myNotifications();
      const list = Array.isArray(res?.data?.items) ? res.data.items : (Array.isArray(res?.data) ? res.data : []);
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

    if (currentUser?.role === "ADMIN") {
      spiTractorsApi
        .adminUsers()
        .then((res) => setAdminUsers((res?.data || []).length))
        .catch(() => setAdminUsers(0));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.role]);

  // Close popup when clicking outside
  useEffect(() => {
    const onDocClick = (e) => {
      if (!notifOpen) return;
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [notifOpen]);

  const toggleNotifications = async () => {
    const next = !notifOpen;
    setNotifOpen(next);

    // If opening, refresh and mark read (optional)
    if (next) {
      await loadNotifications();

      // Optional: mark all as read on open
      try {
        await spiTractorsApi.notificationsMarkRead?.(); // if you add this method
        // optimistic UI update
        setUnreadCount(0);
        setNotifications((prev) =>
          prev.map((n) => ({ ...n, read_at: n.read_at || new Date().toISOString() }))
        );
      } catch {
        // ignore
      }
    }
  };

  const firstLetter = (currentUser?.email || "S").slice(0, 1).toUpperCase();

  return (
    <div className="topbar">
      <div className="topbar-spacer" />

      <div className="topbar-actions" ref={panelRef}>
        <button className="icon-btn bell-btn" onClick={toggleNotifications} title="Notifications">
          <span className="bell-ic">🔔</span>

          {unreadCount > 0 && (
            <span className="bell-badge">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>

        {notifOpen && (
          <div className="notif-pop">
            <div className="notif-head">
              <div className="notif-title">Notifications</div>
              <button className="notif-refresh" onClick={loadNotifications} type="button">
                ↻
              </button>
            </div>

            <div className="notif-body">
              {notifLoading ? (
                <div className="notif-empty">Loading...</div>
              ) : notifications.length === 0 ? (
                <div className="notif-empty">No notifications yet.</div>
              ) : (
                notifications.map((n) => {
                  const isUnread = !n.read_at;
                  return (
                    <div key={n.id} className={`notif-item ${isUnread ? "unread" : ""}`}>
                      <div className="notif-main">
                        <div className="notif-msg">{n.message}</div>
                        {n.meta?.request_code && (
                          <div className="notif-mini">
                            Request: <b>{n.meta.request_code}</b>
                          </div>
                        )}
                        <div className="notif-time">{n.created_at}</div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        <div className="topbar-user">
          <div className="topbar-avatar">{firstLetter}</div>
          <div className="topbar-name">{currentUser?.role || "Sanusi"}</div>
        </div>

        {currentUser?.role === "ADMIN" && (
          <div className="topbar-name">Users: {adminUsers}</div>
        )}
      </div>
    </div>
  );
}
