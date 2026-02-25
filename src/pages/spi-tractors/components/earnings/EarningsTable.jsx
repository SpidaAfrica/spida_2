import { useEffect, useMemo, useState } from "react";
import "./earningsTable.css"; // create or reuse your css
import { spiTractorsApi } from "../../api/spiTractorsApi";

function initials(name) {
  const n = String(name || "").trim();
  return n ? n[0].toUpperCase() : "?";
}

function prettyService(s) {
  const v = String(s || "").toLowerCase();
  return v ? v[0].toUpperCase() + v.slice(1) : "-";
}

function formatMoney(n) {
  return `₦${Number(n || 0).toLocaleString()}`;
}

function formatDate(dt) {
  if (!dt) return "-";
  const d = new Date(dt.replace(" ", "T"));
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function EarningsTable() {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [rows, setRows] = useState([]);

  const fetchRows = async () => {
    try {
      setErr("");
      setLoading(true);
      const res = await spiTractorsApi.ownerEarningsRecent();
      setRows(Array.isArray(res?.data) ? res.data : []);
    } catch (e) {
      setErr(e?.message || "Unable to load transactions");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRows();
  }, []);

  const content = useMemo(() => {
    if (loading && rows.length === 0) return <div style={{ padding: 12 }}>Loading...</div>;
    if (err) return <div style={{ padding: 12 }}>{err}</div>;
    if (!rows.length) return <div style={{ padding: 12 }}>No transactions yet.</div>;

    return (
      <table className="er-table">
        <thead>
          <tr>
            <th>Farmer’s Name</th>
            <th>Farm Name</th>
            <th>Farm Size</th>
            <th>Task</th>
            <th>Amount (Owner 90%)</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((r) => (
            <tr key={r.reference}>
              <td className="er-namecell">
                <span className="er-avatar">{initials(r.full_name)}</span>
                <span>{r.full_name || "Farmer"}</span>
              </td>
              <td>{r.farm_name || "-"}</td>
              <td>{r.farm_size_acres ? `${r.farm_size_acres} Acres` : "-"}</td>
              <td>{prettyService(r.service)}</td>
              <td className="er-amt">{formatMoney(r.owner_amount_naira)}</td>
              <td>{formatDate(r.paid_at || r.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }, [rows, loading, err]);

  return (
    <div className="er-table-wrap">
      <div className="er-table-head">
        <div className="er-table-title">
          Recent Transactions <span className="er-info" title="Owner earnings (90% of paid amount)">ⓘ</span>
        </div>
        <button className="er-seeall" type="button" onClick={() => fetchRows()}>
          Refresh
        </button>
      </div>

      <div className="er-table-scroll">{content}</div>
    </div>
  );
}
