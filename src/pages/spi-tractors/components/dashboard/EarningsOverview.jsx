import "./earnings.css";

export default function EarningsOverview() {
  return (
    <div className="card-block">
      <div className="earn-head">
        <div className="block-title">Earnings Overview</div>

        <div className="earn-tabs">
          <button className="tab active">Total earnings to date</button>
          <button className="tab">Pending</button>
        </div>
      </div>

      <div className="earn-main">
        <div className="earn-amount">
          <div className="k">Total earnings to date</div>
          <div className="amt">₦38,628,355.10</div>
        </div>

        <div className="earn-filters">
          <button className="chip small">Years ▾</button>
          <button className="chip small">2018 - 2025 ▾</button>
        </div>
      </div>

      {/* Chart placeholder (replace with real chart later) */}
      <div className="chart">
        <svg viewBox="0 0 600 220" width="100%" height="220">
          <polyline
            fill="none"
            stroke="#166534"
            strokeWidth="3"
            points="10,180 60,160 110,170 160,120 210,140 260,80 310,110 360,60 410,150 460,130 510,90 560,20"
          />
          <line x1="0" y1="200" x2="600" y2="200" stroke="#eef0f2" />
        </svg>
      </div>
    </div>
  );
}
