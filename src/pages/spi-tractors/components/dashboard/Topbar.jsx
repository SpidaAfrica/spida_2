import { useEffect, useState } from "react";
import "./Topbar.css";
import { getCurrentUser, spiTractorsApi } from "../../api/spiTractorsApi";

export default function Topbar() {
  const [notifCount, setNotifCount] = useState(0);
  const [adminUsers, setAdminUsers] = useState(0);
  const currentUser = getCurrentUser();

  useEffect(() => {
    spiTractorsApi
      .myNotifications()
      .then((res) => setNotifCount((res?.data || []).length))
      .catch(() => setNotifCount(0));

    if (currentUser?.role === "ADMIN") {
      spiTractorsApi
        .adminUsers()
        .then((res) => setAdminUsers((res?.data || []).length))
        .catch(() => setAdminUsers(0));
    }
  }, [currentUser?.role]);

  return (
    <div className="topbar">
      <div className="topbar-spacer" />

      <div className="topbar-actions">
        <button className="icon-btn" title="Rewards">🏅</button>
        <button className="icon-btn" title="Search">🔎</button>
        <button className="icon-btn" title="Notifications">🔔 {notifCount > 0 ? `(${notifCount})` : ""}</button>

        <div className="topbar-user">
          <div className="topbar-avatar">{(currentUser?.email || "S").slice(0, 1).toUpperCase()}</div>
          <div className="topbar-name">{currentUser?.role || "Sanusi"}</div>
        </div>

        {currentUser?.role === "ADMIN" && <div className="topbar-name">Users: {adminUsers}</div>}
      </div>
    </div>
  );
}
