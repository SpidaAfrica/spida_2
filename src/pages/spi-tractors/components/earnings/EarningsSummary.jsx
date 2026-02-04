function SummaryCard({ title, value, muted }) {
    return (
      <div className={`er-card ${muted ? "muted" : ""}`}>
        <div className="er-card-title">{title}</div>
        <div className="er-card-value">{value}</div>
  
        <div className="er-card-actions">
          <button className="er-btn primary">Withdraw</button>
          <button className="er-btn ghost">Transaction Analysis</button>
        </div>
      </div>
    );
  }
  
  export default function EarningsSummary() {
    return (
      <div className="er-summary">
        <SummaryCard title="Total Earnings" value="₦38,628,355.10" />
        <SummaryCard title="Milestone Payment" value="₦628,355.10" muted />
        <SummaryCard title="Pending" value="₦8,628,355.10" muted />
      </div>
    );
  }
  