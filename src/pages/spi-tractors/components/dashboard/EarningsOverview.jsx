import { useEffect, useMemo, useState } from "react";
import "./earnings.css";
import { spiTractorsApi } from "../../api/spiTractorsApi";

function formatMoney(n) {
  const num = Number(n || 0);
  return `₦${num.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

export default function EarningsOverview() {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // chartMode: owner_90 (tractor owner earnings) OR gross (full amount paid)
  const [chartMode, setChartMode] = useState("owner_90");

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
        const res = await spiTractorsApi.ownerEarnings(); // /dashboard_owner_earnings.php
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

  const series = useMemo(() => {
    const list = Array.isArray(data.series) ? data.series : [];
    return list
      .map((x) => ({
        year: Number(x.year),
        gross: Number(x.gross || 0),
        owner_90: Number(x.owner_90 || 0),
      }))
      .sort((a, b) => a.year - b.year);
  }, [data.series]);

  const chartPoints = useMemo(() => {
    const w = 720;
    const h = 240;
    const padL = 46;
    const padR = 16;
    const padT = 20;
    const padB = 44;

    const values = series.map((d) => Number(d[chartMode] || 0));
    const max = Math.max(1, ...values);
    const min = 0;

    const n = series.length || 1;
    const innerW = w - padL - padR;
    const innerH = h - padT - padB;
    const stepX = innerW / Math.max(1, n - 1);

    const pts = series.map((d, i) => {
      const x = padL + i * stepX;
      const v = Number(d[chartMode] || 0);
      const t = (v - min) / (max - min || 1);
      const y = padT + (1 - t) * innerH;
      return { x, y, year: d.year, value: v };
    });

    return { w, h, padL, padR, padT, padB, max, pts };
  }, [series, chartMode]);

  const polylinePoints = chartPoints.pts.map((p) => `${p.x},${p.y}`).join(" ");

  const headlineLabel =
    chartMode === "owner_90" ? "Owner earnings (90%)" : "Gross earnings (100%)";
  const headlineValue =
    chartMode === "owner_90" ? data.owner_earnings_released : data.gross_completed;

  return (
    <div className="card-block">
      <div className="earn-head">
        <div className="block-title">Earnings Overview</div>

        <div className="earn-tabs">
          <button
            className={`tab ${chartMode === "owner_90" ? "active" : ""}`}
            type="button"
            onClick={() => setChartMode("owner_90")}
          >
            Owner (90%)
          </button>
          <button
            className={`tab ${chartMode === "gross" ? "active" : ""}`}
            type="button"
            onClick={() => setChartMode("gross")}
          >
            Gross (100%)
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

      {/* Summary blocks */}
      <div
        style={{
          display: "grid",
          gap: 10,
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          padding: "0 0 14px",
        }}
      >
        <div style={{ border: "1px solid #eef0f2", borderRadius: 12, padding: 12 }}>
          <div style={{ opacity: 0.75, fontSize: 12 }}>Gross completed (100%)</div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{formatMoney(data.gross_completed)}</div>
          <div style={{ opacity: 0.75, fontSize: 12, marginTop: 4 }}>Owner released (90%)</div>
          <div style={{ fontSize: 16, fontWeight: 700 }}>
            {formatMoney(data.owner_earnings_released)}
          </div>
        </div>

        <div style={{ border: "1px solid #eef0f2", borderRadius: 12, padding: 12 }}>
          <div style={{ opacity: 0.75, fontSize: 12 }}>Gross pending release (100%)</div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>
            {formatMoney(data.gross_pending_release)}
          </div>
          <div style={{ opacity: 0.75, fontSize: 12, marginTop: 4 }}>Owner pending (90%)</div>
          <div style={{ fontSize: 16, fontWeight: 700 }}>
            {formatMoney(data.owner_earnings_pending)}
          </div>
        </div>
      </div>

      {/* ✅ Earnings vs Year chart */}
      <div
        className="chart"
        style={{
          border: "1px solid #eef0f2",
          borderRadius: 14,
          padding: 12,
          color: "#166534", // line uses currentColor
        }}
      >
        {series.length === 0 ? (
          <div style={{ padding: 10, opacity: 0.8 }}>No chart data yet.</div>
        ) : (
          <svg viewBox={`0 0 ${chartPoints.w} ${chartPoints.h}`} width="100%" height="240">
            {/* axes */}
            <line
              x1={chartPoints.padL}
              y1={chartPoints.padT}
              x2={chartPoints.padL}
              y2={chartPoints.h - chartPoints.padB}
              stroke="#e5e7eb"
            />
            <line
              x1={chartPoints.padL}
              y1={chartPoints.h - chartPoints.padB}
              x2={chartPoints.w - chartPoints.padR}
              y2={chartPoints.h - chartPoints.padB}
              stroke="#e5e7eb"
            />

            {/* top label */}
            <text x={chartPoints.padL} y={14} fontSize="12" fill="#111827">
              {chartMode === "owner_90" ? "Owner earnings (90%)" : "Gross earnings (100%)"}
            </text>

            {/* y-axis max label */}
            <text x={8} y={chartPoints.padT + 10} fontSize="11" fill="#6b7280">
              {formatMoney(chartPoints.max)}
            </text>

            {/* polyline */}
            <polyline
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              points={polylinePoints}
            />

            {/* points + x labels */}
            {chartPoints.pts.map((p) => (
              <g key={p.year}>
                <circle cx={p.x} cy={p.y} r="4" fill="currentColor" />
                <text
                  x={p.x}
                  y={chartPoints.h - 18}
                  fontSize="11"
                  fill="#6b7280"
                  textAnchor="middle"
                >
                  {p.year}
                </text>
              </g>
            ))}
          </svg>
        )}
      </div>

      {/* yearly list */}
      <div style={{ paddingTop: 10 }}>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>Yearly Breakdown</div>
        <div style={{ display: "grid", gap: 8 }}>
          {series.map((x) => (
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
