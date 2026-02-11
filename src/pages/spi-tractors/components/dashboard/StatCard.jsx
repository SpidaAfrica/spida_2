import { useEffect, useState } from "react";
import "./stats.css";
import { spiTractorsApi } from "../../api/spiTractorsApi";

export default function StatCards() {
  const [stats, setStats] = useState([
    { title: "Total Jobs to date", value: "0" },
    { title: "Active Jobs", value: "0" },
    { title: "Upcoming Job", value: "0" },
  ]);

  useEffect(() => {
    spiTractorsApi
      .ownerSummary()
      .then((res) => {
        const summary = res?.data || {};
        setStats([
          { title: "Total Jobs to date", value: String(summary.completed_jobs || 0) },
          { title: "Active Jobs", value: String(summary.active_requests || 0) },
          { title: "Upcoming Job", value: String(summary.tractors_count || 0) },
        ]);
      })
      .catch(() => {});
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
