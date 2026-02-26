import { useEffect, useMemo, useState } from "react";
import RequestCard from "./RequestCard";
import { spiTractorsApi } from "../../api/spiTractorsApi"; // adjust path if needed

export default function RequestList() {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");

  const load = async () => {
    try {
      setErr("");
      setLoading(true);
      const res = await spiTractorsApi.ownerNewRequests();
      setRows(Array.isArray(res?.data) ? res.data : []);
    } catch (e) {
      setErr(e?.message || "Unable to load requests");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 10000);
    return () => clearInterval(t);
  }, []);

  const countLabel = useMemo(() => {
    const n = rows.length;
    return `${n} New Job request${n === 1 ? "" : "s"}`;
  }, [rows.length]);

  return (
    <div className="req-list-wrap">
      <div className="req-list-top">
        <div className="req-list-title">
          <span>New Request</span>
          <span className="req-info" title="Refresh" onClick={load} style={{ cursor: "pointer" }}>
            ⓘ
          </span>
        </div>

        <div className="req-list-actions">
          <div className="req-search">
            <input placeholder="Search" disabled />
            <span className="req-search-ic">🔎</span>
          </div>

          <div className="req-new-badge">{countLabel}</div>
        </div>
      </div>

      {loading && rows.length === 0 && <div style={{ padding: 12 }}>Loading...</div>}
      {err && <div style={{ padding: 12 }}>{err}</div>}

      <div className="req-list">
        {rows.map((r) => (
          <RequestCard key={r.request_id} data={r} onChanged={load} />
        ))}

        {!loading && !err && rows.length === 0 && (
          <div style={{ padding: 12 }}>No new requests right now.</div>
        )}
      </div>
    </div>
  );
}
