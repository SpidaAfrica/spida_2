import "./Topbar.css";

export default function Topbar() {
  return (
    <div className="topbar">
      <div className="topbar-spacer" />

      <div className="topbar-actions">
        <button className="icon-btn" title="Rewards">🏅</button>
        <button className="icon-btn" title="Search">🔎</button>
        <button className="icon-btn" title="Notifications">🔔</button>

        <div className="topbar-user">
          <div className="topbar-avatar">S</div>
          <div className="topbar-name">Sanusi</div>
        </div>
      </div>
    </div>
  );
}
