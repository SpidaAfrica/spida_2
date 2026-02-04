import "./upcoming.css";

const items = [
  { date: "25", month: "30", title: "12 Banana Street, Lekki, Lagos, Nigeria", service: "Ploughing", time: "08:00 AM - 5:00 PM" },
  { date: "25", month: "30", title: "12 Banana Street, Lekki, Lagos, Nigeria", service: "Tilling", time: "08:00 AM - 5:00 PM" },
  { date: "25", month: "30", title: "12 Banana Street, Lekki, Lagos, Nigeria", service: "Ploughing", time: "08:00 AM - 5:00 PM" },
  { date: "25", month: "30", title: "12 Banana Street, Lekki, Lagos, Nigeria", service: "Ploughing", time: "08:00 AM - 5:00 PM" },
];

export default function Upcoming() {
  return (
    <div className="card-block">
      <div className="up-head">
        <div className="block-title">Upcoming</div>
        <div className="up-controls">
          <button className="chip small">Today ▾</button>
          <button className="chip small">Wednesday, January 22, 2025 ▾</button>
        </div>
      </div>

      <div className="up-grid">
        {items.map((x, i) => (
          <div className="up-card" key={i}>
            <div className="up-date">
              <div className="d">{x.date}</div>
              <div className="m">{x.month}</div>
            </div>
            <div className="up-body">
              <div className="t">{x.title}</div>
              <div className="s">{x.service}</div>
              <div className="tm">{x.time}</div>
              <button className="stat-link">See full details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
