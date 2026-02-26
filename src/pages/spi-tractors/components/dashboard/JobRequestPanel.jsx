import { useEffect, useMemo, useState } from "react";
import "./jobpanel.css";
import { spiTractorsApi } from "../../api/spiTractorsApi";

function prettyService(s) {
  const t = String(s || "").toLowerCase();
  return t ? t.charAt(0).toUpperCase() + t.slice(1) : "-";
}

function money(n) {
  if (n === null || n === undefined) return "-";
  return `₦${Number(n).toLocaleString()}`;
}

export default function JobRequestPanel() {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [err, setErr] = useState("");

  const selected = useMemo(() => {
    const first = list[0] || null;
    return list.find((x) => x.request_id === selectedId) || first;
  }, [list, selectedId]);

  const load = async () => {
    try {
      setErr("");
      setLoading(true);
      const res = await spiTractorsApi.ownerInbox();
      const rows = res?.data?.requests || [];
      setList(Array.isArray(rows) ? rows : []);
      if (!selectedId && rows?.[0]?.request_id) setSelectedId(rows[0].request_id);
    } catch (e) {
      setErr(e?.message || "Unable to load job requests");
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 12000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onAccept = async () => {
    if (!selected) return;
    try {
      await spiTractorsApi.requestSetStatus({
        request_id: selected.request_id,
        to_status: "ACCEPTED",
        note: "Accepted by tractor owner",
        tractor_id: selected.tractor_id,
      });
      await load();
      alert("Accepted ✅");
    } catch (e) {
      alert(e?.message || "Unable to accept request");
    }
  };

  const onDecline = async () => {
    if (!selected) return;
    if (!window.confirm("Decline this request?")) return;

    try {
      await spiTractorsApi.requestSetStatus({
        request_id: selected.request_id,
        to_status: "DECLINED",
        note: "Declined by tractor owner",
        tractor_id: selected.tractor_id,
      });
      await load();
      alert("Declined ❌");
    } catch (e) {
      alert(e?.message || "Unable to decline request");
    }
  };

  const newCount = list.length;

  return (
    <div className="jobpanel">
      <div className="jobpanel-head">
        <div>
          <div className="jobpanel-title">Job Request</div>
          <div className="jobpanel-sub">{selected?.request_code || "—"}</div>
        </div>

        <div className="jobpanel-badge">
          {loading ? "Loading..." : `${newCount} New Job request`}
        </div>
      </div>

      {/* Optional: small selector if multiple */}
      {list.length > 1 && (
        <div style={{ marginBottom: 10 }}>
          <select
            value={selected?.request_id || ""}
            onChange={(e) => setSelectedId(Number(e.target.value))}
            style={{ width: "100%", padding: 10, borderRadius: 10 }}
          >
            {list.map((x) => (
              <option key={x.request_id} value={x.request_id}>
                {x.request_code} • {prettyService(x.service)} • {x.farm_city || "-"}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="mapbox">
        <div className="map-skeleton">
          {selected?.farm_lat && selected?.farm_lng
            ? `Farm Location: ${selected.farm_lat}, ${selected.farm_lng}`
            : "Map Preview"}
        </div>
      </div>

      <div className="job-meta">
        {err ? <div style={{ padding: 10, color: "crimson" }}>{err}</div> : null}

        <div className="row">
          <span className="k">Farm Name</span>
          <span className="v">
            {(selected?.farm_name ? `${selected.farm_name}, ` : "")}
            {selected?.farm_address || "-"}
          </span>
        </div>

        <div className="row">
          <span className="k">Service Needed</span>
          <span className="v">{prettyService(selected?.service)}</span>
        </div>

        <div className="row">
          <span className="k">Farm Size</span>
          <span className="v">{selected?.farm_size_acres ? `${selected.farm_size_acres} acres` : "-"}</span>
        </div>

        <div className="row two">
          <div>
            <div className="k">Payment method</div>
            <div className="v">{selected?.meta?.payment_method || "Card"}</div>
          </div>

          <div>
            <div className="k">Total Amount</div>
            <div className="v">{money(selected?.meta?.amount_naira)}</div>
          </div>
        </div>
      </div>

      <div className="jobpanel-actions">
        <button className="accept" onClick={onAccept} disabled={!selected || loading}>
          Accept
        </button>
        <button className="decline" onClick={onDecline} disabled={!selected || loading}>
          Decline
        </button>
      </div>
    </div>
  );
}
