import { useEffect, useMemo, useState } from "react";
import "./earnings.css";
import { spiTractorsApi } from "../../api/spiTractorsApi";

export default function EarningsOverview() {
  const currentYear = new Date().getFullYear();
  const [tab, setTab] = useState("PAID"); // PAID | PENDING

  const [fromYear, setFromYear] = useState(currentYear - 7);
  const [toYear, setToYear] = useState(currentYear);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    total_paid: 0,
    total_pending: 0,
    series: [],
  });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await spiTractorsApi.ownerEarnings(fromYear, toYear);
        setData(res?.data || { total_paid: 0, total_pending: 0, series: [] });
      } catch {
        // keep fallback
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [fromYear, toYear]);

  const amount = tab === "PAID" ? data.total_paid : data.total_pending;

  const formatMoney = (n) => `₦${Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // Build SVG polyline points from series
  const points = useMemo(() => {
    const series = Array.isArray(data.series) ? data.series : [];
    if (!series.length) return "10,180 560,180";

    const width = 560; // x from 10..570-ish
    const height = 160; // y from 20..180
    const x0 = 10;
    const yBase = 180;

    const vals = series.map((s) => Number(s.total || 0));
    const max = Math.max(...vals, 1);

    return series
      .map((s, i) => {
        const x = x0 + (i * width) / Math.max(series.length - 1, 1);
        const v = Number(s.total || 0);
        const y = yBase - (v / max) * height;
        return `${Math.round(x)},${Math.round(y)}`;
      })
      .join(" ");
  }, [data.series]);

  const onQuickRange = () => {
    // simple toggle: last 8 years vs last 3 years
    const isShort = toYear - fromYear <= 3;
    if (isShort) setFromYear(currentYear - 7);
    else setFromYear(currentYear - 2);
    setToYear(currentYear);
  };

  return (
    <div className="card-block">
      <div className="earn-head">
        <div className="block-title">Earnings Overview</div>

        <div className="earn-tabs">
          <button className={`tab ${tab === "PAID" ? "active" : ""}`} onClick={() => setTab("PAID")}>
            Total earnings to date
          </button>
          <button className={`tab ${tab === "PENDING" ? "active" : ""}`} onClick={() => setTab("PENDING")}>
            Pending
          </button>
        </div>
      </div>

      <div className="earn-main">
        <div className="earn-amount">
          <div className="k">{tab === "PAID" ? "Total earnings to date" : "Pending earnings"}</div>
          <div className="amt">{loading ? "Loading..." : formatMoney(amount)}</div>
        </div>

        <div className="earn-filters">
          <button className="chip small" type="button" onClick={onQuickRange}>
            Years ▾
          </button>
          <button className="chip small" type="button" onClick={onQuickRange}>
            {fromYear} - {toYear} ▾
          </button>
        </div>
      </div>

      <div className="chart">
        <svg viewBox="0 0 600 220" width="100%" height="220">
          <polyline fill="none" stroke="#166534" strokeWidth="3" points={points} />
          <line x1="0" y1="200" x2="600" y2="200" stroke="#eef0f2" />
        </svg>

        {/* optional year labels */}
        <div style={{ display: "flex", justifyContent: "space-between", opacity: 0.7, fontSize: 12, marginTop: 8 }}>
          <span>{fromYear}</span>
          <span>{toYear}</span>
        </div>
      </div>
    </div>
  );
}
