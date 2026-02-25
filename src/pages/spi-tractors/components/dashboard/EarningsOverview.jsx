import { useEffect, useMemo, useState } from "react";
import "./earnings.css";
import { spiTractorsApi } from "../../api/spiTractorsApi";

function formatMoney(n) {
  const num = Number(n || 0);
  return `₦${num.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

export default function EarningsOverview() {
  const [tab, setTab] = useState("released"); // released | pending
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [data, setData] = useState({
    from_year: 2019,
    to_year: 2026,
    gross_completed: 0,
    owner_earnings_released: 0,
    gross_pending_release: 0,
    owner_earnings_pending: 0,
    series: [],
  });

  useEffect(() => {
    const load = async () => {
      try {
        setErr("");
        setLoading(true);
        const res = await spiTractorsApi.ownerEarnings(); // ✅ /dashboard_owner_earnings.php
        setData(res?.data || data);
      } catch (e) {
        setErr(e?.message || "Unable to load earnings");
      } finally {
        setLoading(false);
      }
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const headlineLabel = tab === "released" ? "Total earnings released" : "Pending earnings";
  const headlineValue =
    tab === "released" ? data.owner_earnings_released : data.owner_earnings_pending;

  const chartSeries = useMemo(() => {
    const list = Array.isArray(data.series) ? data.series : [];
    // Plot owner_90 always (what matters to tractor owner)
    return list.map((x) => ({
      year: Number(x.year),
      value: tab === "released" ? Number(x.owner_90 || 0) : Number(x.owner_90 || 0),
      gross: Number(x.gross || 0),
      owner90: Number(x.owner_90 || 0),
    }));
  }, [data.series, tab]);

  // Simple inline SVG polyline chart based on series values
  const chart = useMemo(() => {
    const w = 600;
    const h = 220;
    const padX = 16;
    const padY = 20;

    const values = chartSeries.map((d) => d.owner90);
    const max = Math.max(1, ...values);
    const min = 0;

    const n = chartSeries.length || 1;
    const stepX = (w - padX * 2) / Math.max(1, n - 1);

    const points = chartSeries
      .map((d, i) => {
        const x = padX + i * stepX;
        const norm = (d.owner90 - min) / (max - min || 1);
        const y = h - padY - norm * (h - padY * 2);
        return `${x},${y}`;
      })
      .join(" ");

    return (
      <div className="chart">
        <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="220">
          <polyline fill="none" strokeWidth="3" points={points} />
          <line x1="0" y1={h - 20} x2={w} y2={h - 20} stroke="#eef0f2" />
        </svg>
      </div>
    );
  }, [chartSeries]);

  return (
    <div className="card-block">
      <div className="earn-head">
        <div className="block-title">Earnings Overview</div>

        <div className="earn-tabs">
          <button
            className={`tab ${tab === "released" ? "active" : ""}`}
            onClick={() => setTab("released")}
            type="button"
          >
            Released
          </button>
          <button
            className={`tab ${tab === "pending" ? "active" : ""}`}
            onClick={() => setTab("pending")}
            type="button"
          >
            Pending
          </button>
        </div>
      </div>

      {loading && <div style={{ padding: 10, opacity: 0.8 }}>Loading...</div>}
      {err && <div style={{ padding: 10, color: "crimson" }}>{err}</div>}

      <div className="earn-main">
        <div className="earn-amount">
          <div className="k">{headlineLabel}</div>
          <div className="amt">{formatMoney(headlineValue)}</div>
          <div style={{ marginTop: 6, opacity: 0.75, fontSize: 12 }}>
            Range: {data.from_year} - {data.to_year}
          </div>
        </div>

        <div className="earn-filters">
          <button className="chip small" type="button">
            Years ▾
          </button>
          <button className="chip small" type="button">
            {data.from_year} - {data.to_year} ▾
          </button>
        </div>
      </div>

      {/* ✅ Summary blocks that match your payload */}
      <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(2, minmax(0, 1fr))", padding: "0 0 14px" }}>
        <div style={{ border: "1px solid #eef0f2", borderRadius: 12, padding: 12 }}>
          <div style={{ opacity: 0.75, fontSize: 12 }}>Gross completed (100%)</div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{formatMoney(data.gross_completed)}</div>
          <div style={{ opacity: 0.75, fontSize: 12, marginTop: 4 }}>Owner released (90%)</div>
          <div style={{ fontSize: 16, fontWeight: 700 }}>{formatMoney(data.owner_earnings_released)}</div>
        </div>

        <div style={{ border: "1px solid #eef0f2", borderRadius: 12, padding: 12 }}>
          <div style={{ opacity: 0.75, fontSize: 12 }}>Gross pending release (100%)</div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{formatMoney(data.gross_pending_release)}</div>
          <div style={{ opacity: 0.75, fontSize: 12, marginTop: 4 }}>Owner pending (90%)</div>
          <div style={{ fontSize: 16, fontWeight: 700 }}>{formatMoney(data.owner_earnings_pending)}</div>
        </div>
      </div>

      {/* Chart */}
      {chart}

      {/* Optional yearly list */}
      <div style={{ paddingTop: 10 }}>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>Yearly Breakdown</div>
        <div style={{ display: "grid", gap: 8 }}>
          {(Array.isArray(data.series) ? data.series : []).map((x) => (
            <div
              key={x.year}
              style={{
                display: "flex",
                justifyContent: "space-between",
                border: "1px solid #eef0f2",
                borderRadius: 12,
                padding: "10px 12px",
              }}
            >
              <div style={{ fontWeight: 700 }}>{x.year}</div>
              <div style={{ opacity: 0.85 }}>
                Gross: <b>{formatMoney(x.gross)}</b> &nbsp; • &nbsp; Owner(90%):{" "}
                <b>{formatMoney(x.owner_90)}</b>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
