import { useEffect, useMemo, useState } from "react";
import "./jobpanel.css";
import { spiTractorsApi } from "../../api/spiTractorsApi";

function prettyService(serviceRaw) {
  const s = String(serviceRaw || "").toLowerCase();
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : "—";
}

function money(n) {
  if (n === null || n === undefined || n === "") return "—";
  return `₦${Number(n).toLocaleString()}`;
}

function mapSrc(lat, lng) {
  const d      = 0.012;
  const left   = lng - d;
  const right  = lng + d;
  const top    = lat + d;
  const bottom = lat - d;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${lat}%2C${lng}`;
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-NG", {
    day:   "numeric",
    month: "short",
    year:  "numeric",
  });
}

export default function JobRequestPanel() {
  const [loading, setLoading]     = useState(false);
  const [list, setList]           = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [err, setErr]             = useState("");

  /* ---- Selected item ---- */
  const selected = useMemo(() => {
    if (!list.length) return null;
    return list.find((x) => x.id === selectedId) || list[0];
  }, [list, selectedId]);

  const hasMap =
    Number.isFinite(Number(selected?.lat)) &&
    Number.isFinite(Number(selected?.lng));

  const mapUrl = useMemo(() => {
    if (!hasMap) return "";
    return mapSrc(Number(selected.lat), Number(selected.lng));
  }, [hasMap, selected]);

  /* ---- Load ---- */
  const load = async () => {
    try {
      setLoading(true);
      setErr("");

      const [singleRes, pairRes] = await Promise.all([
        spiTractorsApi.ownerNewRequestsSingle(),
        spiTractorsApi.ownerNewRequestsPair(),
      ]);

      const singleRows = Array.isArray(singleRes?.data)
        ? singleRes.data.map((r) => ({
            id:               "single_" + r.offer_id,
            type:             "single",
            offer_id:         r.offer_id,
            lat:              r.farm_lat,
            lng:              r.farm_lng,
            service:          r.service,
            farm_size_acres:  r.farm_size_acres,
            request_code:     r.request_code,
            farm_name:        r.farm_name,
            farm_address:     r.farm_address,
            farm_city:        r.farm_city,
            preferred_date:   r.preferred_date,
            full_name:        r.full_name,
            farmer_phone:     r.farmer_phone,
            distance_km:      r.distance_km,
            eta_minutes:      r.eta_minutes,
            tractor_registration: r.tractor_registration,
          }))
        : [];

      const pairRows = pairRes?.data
        ? [
            {
              id:              "pair_" + pairRes.data.group.id,
              type:            "pair",
              group_id:        pairRes.data.group.id,
              lat:             pairRes.data.farmers[0]?.farm_lat,
              lng:             pairRes.data.farmers[0]?.farm_lng,
              service:         pairRes.data.farmers[0]?.service,
              farm_size_acres: pairRes.data.group.total_acres,
              capacity_acres:  pairRes.data.group.capacity_acres,
              request_code:    "PAIR-" + pairRes.data.group.id,
              farmers:         pairRes.data.farmers,
            },
          ]
        : [];

      const merged = [...singleRows, ...pairRows];
      setList(merged);

      // Keep existing selection if still in list, otherwise pick first
      if (!selectedId && merged[0]) {
        setSelectedId(merged[0].id);
      } else if (selectedId && !merged.find((x) => x.id === selectedId) && merged[0]) {
        setSelectedId(merged[0].id);
      }
    } catch (e) {
      setErr(e.message);
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 10000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---- Accept / Decline ---- */
  const handleAction = async (action) => {
    if (!selected || loading) return;
    try {
      setLoading(true);
      if (selected.type === "single") {
        await spiTractorsApi.ownerRequestActionSingle({
          offer_id: selected.offer_id,
          action,
        });
      } else {
        if (action === "ACCEPT") {
          await spiTractorsApi.ownerAcceptPairGroup({ group_id: selected.group_id });
        } else {
          await spiTractorsApi.ownerDeclinePairGroup({ group_id: selected.group_id });
        }
      }
      await load();
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  /* ---- Empty state ---- */
  if (!loading && list.length === 0) {
    return (
      <div className="jobpanel no-jobs">
        <div className="nojob-icon">🚜</div>
        <p>No job requests at the moment.</p>
        <p style={{ fontSize: 11, opacity: 0.6 }}>Checking every 10 seconds…</p>
      </div>
    );
  }

  const isPair   = selected?.type === "pair";
  const countLabel = `${list.length} New Request${list.length === 1 ? "" : "s"}`;

  return (
    <div className="jobpanel">

      {/* Header */}
      <div className="jobpanel-head">
        <div>
          <div className="jobpanel-type-badge">
            {isPair
              ? <span className="badge-pair">PAIR REQUEST</span>
              : <span className="badge-single">SINGLE REQUEST</span>}
          </div>
          <div className="jobpanel-code">{selected?.request_code}</div>
        </div>

        <div className="jobpanel-badge">
          {loading ? <span className="pulse-dot" /> : countLabel}
        </div>
      </div>

      {/* Multi-request selector */}
      {list.length > 1 && (
        <div className="jobpanel-selector-wrap">
          <select
            className="jobpanel-selector"
            value={selected?.id || ""}
            onChange={(e) => setSelectedId(e.target.value)}
          >
            {list.map((x) => (
              <option key={x.id} value={x.id}>
                {x.request_code} • {prettyService(x.service)}
                {x.type === "pair" ? " (Pair)" : ""}
              </option>
            ))}
          </select>
        </div>
      )}

      {err && (
        <div style={{ fontSize: 11, color: "crimson", padding: "6px 0" }}>{err}</div>
      )}

      {/* Map */}
      <div className="mapbox">
        {hasMap ? (
          <iframe
            title="farm-map"
            src={mapUrl}
            style={{ width: "100%", height: "100%", border: 0 }}
          />
        ) : (
          <div className="map-skeleton">📍 No location data</div>
        )}
      </div>

      {/* ---- SINGLE request details ---- */}
      {!isPair && selected && (
        <div className="job-meta">
          <MetaRow label="Service"    value={prettyService(selected.service)} />
          <MetaRow label="Farmer"     value={selected.full_name} />
          <MetaRow label="Phone"      value={selected.farmer_phone} />
          <MetaRow label="Farm Name"  value={selected.farm_name} />
          <MetaRow label="Location"   value={[selected.farm_address, selected.farm_city].filter(Boolean).join(", ")} />
          <MetaRow label="Farm Size"  value={selected.farm_size_acres ? `${selected.farm_size_acres} acres` : null} />
          <MetaRow label="Preferred Date" value={formatDate(selected.preferred_date)} />
          {selected.distance_km != null && (
            <MetaRow label="Distance"  value={`${selected.distance_km} km`} />
          )}
          {selected.eta_minutes != null && (
            <MetaRow label="ETA"       value={`~${selected.eta_minutes} min`} />
          )}
          <MetaRow label="Tractor Reg" value={selected.tractor_registration} />
        </div>
      )}

      {/* ---- PAIR request details ---- */}
      {isPair && selected && (
        <div className="job-meta">
          <MetaRow label="Service"        value={prettyService(selected.service)} />
          <MetaRow label="Total Acres"    value={`${selected.farm_size_acres} acres`} />
          <MetaRow label="Tractor Capacity" value={selected.capacity_acres ? `${selected.capacity_acres} acres` : null} />
          <MetaRow label="Farmers in Group" value={String(selected.farmers?.length || 0)} />

          {/* Individual farmer cards */}
          {Array.isArray(selected.farmers) && selected.farmers.length > 0 && (
            <div className="pair-farmers-wrap">
              <div className="pair-farmers-title">Farmer Details</div>
              {selected.farmers.map((f, i) => (
                <div key={i} className="pair-farmer-card">
                  <div className="pfc-num">#{i + 1}</div>
                  <div className="pfc-rows">
                    <PairRow label="Name"    value={f.full_name} />
                    <PairRow label="Phone"   value={f.phone} />
                    <PairRow label="Acres"   value={f.acres ? `${f.acres} acres` : null} />
                    <PairRow label="Amount"  value={f.amount_paid ? money(f.amount_paid / 100) : null} />
                    <PairRow
                      label="Location"
                      value={
                        f.farm_lat && f.farm_lng
                          ? `${Number(f.farm_lat).toFixed(4)}, ${Number(f.farm_lng).toFixed(4)}`
                          : null
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="jobpanel-actions">
        <button
          className="accept"
          onClick={() => handleAction("ACCEPT")}
          disabled={loading}
        >
          {loading ? "…" : "✓ Accept"}
        </button>
        <button
          className="decline"
          onClick={() => handleAction("DECLINE")}
          disabled={loading}
        >
          {loading ? "…" : "✕ Decline"}
        </button>
      </div>

    </div>
  );
}

function MetaRow({ label, value }) {
  if (!value && value !== 0) return null;
  return (
    <div className="row">
      <span className="k">{label}</span>
      <span className="v">{value}</span>
    </div>
  );
}

function PairRow({ label, value }) {
  if (!value && value !== 0) return null;
  return (
    <div className="pfc-row">
      <span className="pfc-k">{label}:</span>
      <span className="pfc-v">{value}</span>
    </div>
  );
}
