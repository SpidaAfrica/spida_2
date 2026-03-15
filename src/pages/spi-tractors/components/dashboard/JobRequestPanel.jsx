import { useEffect, useMemo, useState } from "react";
import "./jobpanel.css";
import { spiTractorsApi } from "../../api/spiTractorsApi";

function prettyService(serviceRaw) {
  const s = String(serviceRaw || "").toLowerCase();
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : "-";
}

function money(n) {
  if (n === null || n === undefined) return "-";
  return `₦${Number(n).toLocaleString()}`;
}

function mapSrc(lat, lng) {
  const d = 0.01;
  const left = lng - d;
  const right = lng + d;
  const top = lat + d;
  const bottom = lat - d;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${lat}%2C${lng}`;
}

export default function JobRequestPanel() {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [err, setErr] = useState("");

  // Determine selected job (always compute hook)
  const selected = useMemo(() => {
    if (!list.length) return null;
    return list.find((x) => x.offer_id === selectedId) || list[0];
  }, [list, selectedId]);

  const hasMap =
    Number.isFinite(Number(selected?.farm_lat)) &&
    Number.isFinite(Number(selected?.farm_lng));

  const mapUrl = useMemo(() => {
    if (!hasMap) return "";
    return mapSrc(Number(selected.farm_lat), Number(selected.farm_lng));
  }, [hasMap, selected?.farm_lat, selected?.farm_lng]);

  // Load job requests
  const load = async () => {
    try {
      setErr("");
      setLoading(true);
      const res = await spiTractorsApi.ownerNewRequests();
      const rows = Array.isArray(res?.data) ? res.data : [];
      setList(rows);
      if (!selectedId && rows[0]?.offer_id) setSelectedId(rows[0].offer_id);
    } catch (e) {
      setErr(e?.message || "Unable to load job requests");
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 10000);
    return () => clearInterval(t);
  }, []);

  const handleAction = async (action) => {
    if (!selected || loading) return;
    try {
      setLoading(true);
      await spiTractorsApi.ownerRequestAction({
        offer_id: selected.offer_id,
        action,
      });
      await load();
    } catch (e) {
      alert(e?.message || `Unable to ${action.toLowerCase()} request`);
    } finally {
      setLoading(false);
    }
  };

  const countLabel = `${list.length} New Job request${list.length === 1 ? "" : "s"}`;

  // ✅ Early return if no requests (but after hooks)
  if (!loading && list.length === 0) {
    return (
      <div className="jobpanel no-jobs">
        <p>No job request at the moment...</p>
      </div>
    );
  }

  return (
    <div className="jobpanel">

      <div className="jobpanel-head">
        <div>
          <div className="jobpanel-title">Job Request</div>
          <div className="jobpanel-sub">{selected?.request_code || "—"}</div>
        </div>
        <div className="jobpanel-badge">{loading ? "Loading..." : countLabel}</div>
      </div>

      {list.length > 1 && (
        <div style={{ marginBottom: 10 }}>
          <select
            value={selected?.offer_id || ""}
            onChange={(e) => setSelectedId(Number(e.target.value))}
            style={{ width: "100%", padding: 10, borderRadius: 10 }}
          >
            {list.map((x) => (
              <option key={x.offer_id} value={x.offer_id}>
                {x.request_code} • {prettyService(x.service)} • {x.farm_city || "-"}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="mapbox">
        {hasMap ? (
          <iframe
            title={`map-${selected?.offer_id}`}
            src={mapUrl}
            loading="lazy"
            style={{ width: "100%", height: 220, border: 0 }}
          />
        ) : (
          <div className="map-skeleton">No Map Available</div>
        )}
      </div>

      <div className="job-meta">
        {err && <div style={{ padding: 10, color: "crimson" }}>{err}</div>}

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
            <div className="k">Suggested Tractor</div>
            <div className="v">{selected?.tractor_registration || selected?.tractor_registration || "-"}</div>
          </div>

          <div>
            <div className="k">Preferred Date</div>
            <div className="v">{selected?.preferred_date || "-"}</div>
          </div>
        </div>

        <div className="row two">
          <div>
            <div className="k">Payment Method</div>
            <div className="v">{selected?.meta?.payment_method || "Card"}</div>
          </div>

          <div>
            <div className="k">Total Amount</div>
            <div className="v">{money(selected?.meta?.amount_naira)}</div>
          </div>
        </div>
      </div>

      <div className="jobpanel-actions">
        <button
          className="accept"
          onClick={() => handleAction("ACCEPT")}
          disabled={!selected || loading}
        >
          {loading ? "Working..." : "Accept"}
        </button>

        <button
          className="decline"
          onClick={() => handleAction("DECLINE")}
          disabled={!selected || loading}
        >
          Decline
        </button>
      </div>
    </div>
  );
}
