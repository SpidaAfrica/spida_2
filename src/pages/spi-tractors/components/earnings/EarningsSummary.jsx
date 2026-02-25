import { useEffect, useState } from "react";
import "./earningsSummary.css";
import { spiTractorsApi } from "../../api/spiTractorsApi";

function formatMoney(n) {
  return `₦${Number(n || 0).toLocaleString()}`;
}

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

  const [summary, setSummary] = useState({
    owner_earnings_released: 0,
    owner_earnings_pending: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await spiTractorsApi.ownerEarnings();
        setSummary(res?.data || {});
      } catch (e) {
        console.error(e?.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) {
    return <div style={{ padding: 16 }}>Loading earnings...</div>;
  }

  return (
    <div className="er-summary">
      <SummaryCard
        title="Total Earnings (Released)"
        value={formatMoney(summary.owner_earnings_released)}
      />

      <SummaryCard
        title="Pending Release"
        value={formatMoney(summary.owner_earnings_pending)}
        muted
      />
    </div>
  );
}
