import { useEffect, useState } from "react";
import "./stats.css";
import { spiTractorsApi } from "../../api/spiTractorsApi";

export default function StatCards() {
  const [stats, setStats] = useState([
    { title: "Total Jobs Completed", value: "—" },
    { title: "Active Jobs",          value: "—" },
    { title: "Upcoming Jobs",        value: "—" },
  ]);
  const [loading, setLoading] = useState(false);

  const loadStats = async () => {
    try {
      setLoading(true);
      const res     = await spiTractorsApi.ownerSummary();
      const summary = res?.data || {};

      setStats([
        { title: "Total Jobs Completed", value: String(summary.completed_jobs  ?? 0) },
        { title: "Active Jobs",          value: String(summary.active_requests  ?? 0) },
        // FIX: was using tractors_count here — now correctly uses upcoming_jobs
        { title: "Upcoming Jobs",        value: String(summary.upcoming_jobs    ?? 0) },
      ]);
    } catch (e) {
      console.error("Unable to fetch stats:", e?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
    // FIX: was 5 seconds — reduced to 30s to avoid hammering server
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="stats-row">
      {stats.map((s) => (
        <div className="stat-card" key={s.title}>
          <div className="stat-top">
            <div className="stat-title">{s.title}</div>
            <div className="info">ⓘ</div>
          </div>
          <div className="stat-value">
            {loading && s.value === "—" ? (
              <span style={{ opacity: 0.4, fontSize: 14 }}>…</span>
            ) : (
              s.value
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
