import { useEffect, useState } from "react";
import { spiTractorsApi } from "../../api/spiTractorsApi";

export default function RequestsStats() {
  const [stats, setStats] = useState([
    { title: "Completed Request", value: "0" },
    { title: "Active Jobs", value: "0" },
    { title: "Pending Requests", value: "0" },
    { title: "Cancelled Requests", value: "0" },
    { title: "Declined Requests", value: "0" },
  ]);

  // ✅ Function to load stats
  const loadStats = async () => {
    try {
      const res = await spiTractorsApi.ownerRequestStats();
      const d = res?.data || {};

      setStats([
        { title: "Completed Request", value: String(d.completed || 0) },
        { title: "Active Jobs", value: String(d.active || 0) },
        { title: "Pending Requests", value: String(d.pending || 0) },
        { title: "Cancelled Requests", value: String(d.cancelled || 0) },
        { title: "Declined Requests", value: String(d.declined || 0) },
      ]);
    } catch (e) {
      console.error("Unable to fetch request stats", e);
    }
  };

  useEffect(() => {
    loadStats(); // initial load
    const interval = setInterval(loadStats, 5000); // refresh every 5 seconds

    return () => clearInterval(interval); // cleanup on unmount
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
