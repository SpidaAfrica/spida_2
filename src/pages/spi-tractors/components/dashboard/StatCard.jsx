import { useEffect, useState } from "react";
import "./stats.css";
import { spiTractorsApi } from "../../api/spiTractorsApi";

export default function StatCards() {
  const [stats, setStats] = useState([
    { title: "Total Jobs to date", value: "0" },
    { title: "Active Jobs", value: "0" },
    { title: "Upcoming Job", value: "0" },
  ]);

  // ✅ Function to load stats
  const loadStats = async () => {
    try {
      const res = await spiTractorsApi.ownerSummary();
      const summary = res?.data || {};
      setStats([
        { title: "Total Jobs to date", value: String(summary.completed_jobs || 0) },
        { title: "Active Jobs", value: String(summary.active_requests || 0) },
        { title: "Upcoming Job", value: String(summary.tractors_count || 0) },
      ]);
    } catch (e) {
      // Optionally handle error
      console.error("Unable to fetch stats", e);
    }
  };

  useEffect(() => {
    loadStats(); // initial load

    const interval = setInterval(loadStats, 5000); // refresh every 5 seconds

    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  return (
    <div className="stats-row">
      {stats.map((s) => (
        <div className="stat-card" key={s.title}>
          <div className="stat-top">
            <div className="stat-title">{s.title}</div>
            <div className="info">ⓘ</div>
          </div>
          <div className="stat-value">{s.value}</div>
          <button className="stat-link">See full details</button>
        </div>
      ))}
    </div>
  );
}
