import { useCallback, useEffect, useMemo, useState } from "react";
import "./earnings.css";
import { spiTractorsApi } from "../../api/spiTractorsApi";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function formatMoney(n) {
  const num = Number(n || 0);
  return `₦${num.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

const currentYear  = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1; // 1-12

export default function EarningsOverview() {
  const [loading, setLoading]   = useState(false);
  const [err, setErr]           = useState("");
  const [chartMode, setChartMode] = useState("owner_90"); // owner_90 | gross
  const [view, setView]         = useState("yearly");     // daily | monthly | yearly
  const [filterYear, setFilterYear]   = useState(currentYear);
  const [filterMonth, setFilterMonth] = useState(currentMonth);

  const [data, setData] = useState({
    from_year: currentYear - 7,
    to_year: currentYear,
    gross_completed: 0,
    owner_earnings_released: 0,
    gross_pending_release: 0,
    owner_earnings_pending: 0,
    series: [],
  });

  const load = useCallback(async () => {
    try {
      setErr("");
      setLoading(true);

      const params = new URLSearchParams({
        view,
        year:  String(filterYear),
        month: String(filterMonth),
      });

      const res = await spiTractorsApi.ownerEarnings(params.toString());
      setData(res?.data || data);
    } catch (e) {
      setErr(e?.message || "Unable to load earnings");
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, filterYear, filterMonth]);

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, [load]);

  const series = useMemo(() => {
    const list = Array.isArray(data.series) ? data.series : [];
    return list.map((x) => ({
      label:    x.label || String(x.year || x.date || ""),
      gross:    Number(x.gross    || 0),
      owner_90: Number(x.owner_90 || 0),
    }));
  }, [data.series]);

  /* ---- SVG chart ---- */
  const chartPoints = useMemo(() => {
    const w    = 720, h = 240;
    const padL = 54, padR = 16, padT = 24, padB = 44;
    const values = series.map((d) => Number(d[chartMode] || 0));
    const max  = Math.max(1, ...values);
    const n    = series.length || 1;
    const innerW = w - padL - padR;
    const innerH = h - padT - padB;
    const stepX  = innerW / Math.max(1, n - 1);

    const pts = series.map((d, i) => {
      const x = padL + i * stepX;
      const v = Number(d[chartMode] || 0);
      const t = v / (max || 1);
      const y = padT + (1 - t) * innerH;
      return { x, y, label: d.label, value: v };
    });

    // y-axis guide values
    const guides = [0, 0.25, 0.5, 0.75, 1].map((f) => ({
      y:   padT + (1 - f) * innerH,
      val: max * f,
    }));

    return { w, h, padL, padR, padT, padB, max, pts, guides };
  }, [series, chartMode]);

  const polylinePoints = chartPoints.pts.map((p) => `${p.x},${p.y}`).join(" ");

  const headlineValue =
    chartMode === "owner_90"
      ? data.owner_earnings_released
      : data.gross_completed;

  const headlineLabel =
    chartMode === "owner_90" ? "Owner earnings (90%)" : "Gross earnings (100%)";

  // Years for selector
  const yearOptions = [];
  for (let y = currentYear; y >= currentYear - 7; y--) yearOptions.push(y);

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

      {/* View selector: Daily / Monthly / Yearly */}
      <div className="earn-view-tabs">
        {["daily","monthly","yearly"].map((v) => (
          <button
            key={v}
            type="button"
            className={`view-tab ${view === v ? "active" : ""}`}
            onClick={() => setView(v)}
          >
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>

      {/* Period selectors */}
      <div className="earn-period-row">
        {(view === "monthly" || view === "daily") && (
          <select
            className="earn-select"
            value={filterYear}
            onChange={(e) => setFilterYear(Number(e.target.value))}
          >
            {yearOptions.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        )}

        {view === "daily" && (
          <select
            className="earn-select"
            value={filterMonth}
            onChange={(e) => setFilterMonth(Number(e.target.value))}
          >
            {MONTHS.map((m, i) => (
              <option key={i + 1} value={i + 1}>{m}</option>
            ))}
          </select>
        )}
      </div>

      {loading && <div style={{ padding: 10, opacity: 0.7, fontSize: 12 }}>Refreshing...</div>}
      {err     && <div style={{ padding: 10, color: "crimson", fontSize: 12 }}>{err}</div>}

      <div className="earn-main">
        <div className="earn-amount">
          <div className="k">{headlineLabel}</div>
          <div className="amt">{formatMoney(headlineValue)}</div>
          <div style={{ marginTop: 6, opacity: 0.6, fontSize: 11 }}>
            {view === "yearly" && `${data.from_year} – ${data.to_year}`}
            {view === "monthly" && `All months · ${filterYear}`}
            {view === "daily"   && `${MONTHS[filterMonth - 1]} ${filterYear}`}
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="earn-summary-grid">
        <div className="earn-summary-card">
          <div className="sum-label">Gross completed</div>
          <div className="sum-value">{formatMoney(data.gross_completed)}</div>
          <div className="sum-label" style={{ marginTop: 6 }}>Owner released (90%)</div>
          <div className="sum-value2">{formatMoney(data.owner_earnings_released)}</div>
        </div>
        <div className="earn-summary-card">
          <div className="sum-label">Gross pending release</div>
          <div className="sum-value">{formatMoney(data.gross_pending_release)}</div>
          <div className="sum-label" style={{ marginTop: 6 }}>Owner pending (90%)</div>
          <div className="sum-value2">{formatMoney(data.owner_earnings_pending)}</div>
        </div>
      </div>

      {/* Chart */}
      <div className="chart">
        {series.length === 0 ? (
          <div style={{ padding: 16, opacity: 0.7, textAlign: "center" }}>No chart data yet.</div>
        ) : (
          <svg viewBox={`0 0 ${chartPoints.w} ${chartPoints.h}`} width="100%" height="240">
            {/* horizontal guide lines */}
            {chartPoints.guides.map((g, i) => (
              <g key={i}>
                <line
                  x1={chartPoints.padL} y1={g.y}
                  x2={chartPoints.w - chartPoints.padR} y2={g.y}
                  stroke="#f0f0f0" strokeDasharray="4 4"
                />
                <text x={chartPoints.padL - 4} y={g.y + 4} fontSize="9" fill="#9ca3af" textAnchor="end">
                  {g.val >= 1000 ? `₦${(g.val / 1000).toFixed(0)}k` : `₦${g.val.toFixed(0)}`}
                </text>
              </g>
            ))}

            {/* axes */}
            <line x1={chartPoints.padL} y1={chartPoints.padT}
                  x2={chartPoints.padL} y2={chartPoints.h - chartPoints.padB}
                  stroke="#e5e7eb" />
            <line x1={chartPoints.padL} y1={chartPoints.h - chartPoints.padB}
                  x2={chartPoints.w - chartPoints.padR} y2={chartPoints.h - chartPoints.padB}
                  stroke="#e5e7eb" />

            {/* area fill */}
            {chartPoints.pts.length > 1 && (
              <polygon
                points={[
                  `${chartPoints.pts[0].x},${chartPoints.h - chartPoints.padB}`,
                  ...chartPoints.pts.map((p) => `${p.x},${p.y}`),
                  `${chartPoints.pts[chartPoints.pts.length - 1].x},${chartPoints.h - chartPoints.padB}`,
                ].join(" ")}
                fill="#16a34a"
                fillOpacity="0.08"
              />
            )}

            {/* polyline */}
            <polyline
              fill="none"
              stroke="#16a34a"
              strokeWidth="2.5"
              strokeLinejoin="round"
              points={polylinePoints}
            />

            {/* points + labels */}
            {chartPoints.pts.map((p, i) => {
              // Show every label, but skip some if too many
              const showLabel = series.length <= 14 || i % Math.ceil(series.length / 14) === 0;
              return (
                <g key={i}>
                  <circle cx={p.x} cy={p.y} r="4" fill="#16a34a" />
                  {showLabel && (
                    <text
                      x={p.x}
                      y={chartPoints.h - chartPoints.padB + 14}
                      fontSize="10"
                      fill="#6b7280"
                      textAnchor="middle"
                    >
                      {p.label}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        )}
      </div>

      {/* Breakdown list */}
      <div style={{ paddingTop: 12 }}>
        <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 13 }}>
          {view === "yearly"  && "Yearly Breakdown"}
          {view === "monthly" && `Monthly Breakdown · ${filterYear}`}
          {view === "daily"   && `Daily Breakdown · ${MONTHS[filterMonth - 1]} ${filterYear}`}
        </div>
        <div style={{ display: "grid", gap: 6 }}>
          {series.map((x, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                border: "1px solid #eef0f2",
                borderRadius: 10,
                padding: "8px 12px",
                fontSize: 12,
              }}
            >
              <div style={{ fontWeight: 700 }}>{x.label}</div>
              <div style={{ opacity: 0.85 }}>
                Gross: <b>{formatMoney(x.gross)}</b>
                &nbsp;•&nbsp;Owner: <b>{formatMoney(x.owner_90)}</b>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
