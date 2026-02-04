import "./stats.css";

export default function StatCards() {
  const stats = [
    { title: "Total Jobs to date", value: "567" },
    { title: "Active Jobs", value: "3" },
    { title: "Upcoming Job", value: "59" },
  ];

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
