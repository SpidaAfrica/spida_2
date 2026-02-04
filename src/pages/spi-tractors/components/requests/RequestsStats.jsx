export default function RequestsStats() {
    const stats = [
      { title: "Completed Request", value: "567" },
      { title: "Active Jobs", value: "6" },
      { title: "Pending Requests", value: "59" },
      { title: "Cancelled Requests", value: "59" },
      { title: "Declined Requests", value: "59" },
    ];
  
    return (
      <div className="req-stats">
        {stats.map((s) => (
          <div className="req-stat" key={s.title}>
            <div className="req-stat-top">
              <span className="req-stat-title">{s.title}</span>
              <span className="req-info">ⓘ</span>
            </div>
  
            <div className="req-stat-value">{s.value}</div>
            <button className="req-link">See full details</button>
          </div>
        ))}
      </div>
    );
  }
  