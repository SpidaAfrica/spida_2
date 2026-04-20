import { useEffect, useState } from "react";
import { spiTractorsApi } from "../../api/spiTractorsApi";

export default function RequestsStats() {
  const [stats, setStats] = useState([
    { title: "Completed Requests",  value: "—" },
    { title: "Active Jobs",         value: "—" },
    { title: "Pending Requests",    value: "—" },
    { title: "Cancelled Requests",  value: "—" },
    { title: "Declined Requests",   value: "—" },
  ]);

  const loadStats = async () => {
    try {
      const res = await spiTractorsApi.ownerRequestStats();
      const d   = res?.data || {};

      setStats([
        { title: "Completed Requests", value: String(d.completed ?? 0) },
        { title: "Active Jobs",        value: String(d.active    ?? 0) },
        { title: "Pending Requests",   value: String(d.pending   ?? 0) },
        { title: "Cancelled Requests", value: String(d.cancelled ?? 0) },
        // FIX: now returns real value from DB (was always hardcoded 0 in backend)
        { title: "Declined Requests",  value: String(d.declined  ?? 0) },
      ]);
    } catch (e) {
      console.error("Unable to fetch request stats:", e?.message);
    }
  };

  useEffect(() => {
    loadStats();
    // FIX: was 5 seconds — reduced to 30s
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="req-stats">
      {stats.map((s) => (
        <div className="req-stat" key={s.title}>
          <div className="req-stat-top">
            <span className="req-stat-title">{s.title}</span>
            <span className="req-info">ⓘ</span>
          </div>
          <div className="req-stat-value">{s.value}</div>
        </div>
      ))}
    </div>
  );
}
