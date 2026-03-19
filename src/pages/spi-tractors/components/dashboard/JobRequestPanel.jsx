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

  /* =========================
     SELECTED
  ========================= */

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

  /* =========================
     LOAD BOTH ENDPOINTS
  ========================= */

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
            id: "single_" + r.offer_id,
            type: "single",
            offer_id: r.offer_id,
            lat: r.farm_lat,
            lng: r.farm_lng,
            service: r.service,
            farm_size_acres: r.farm_size_acres,
            request_code: r.request_code,
            farm_name: r.farm_name,
            farm_address: r.farm_address,
            preferred_date: r.preferred_date,
            tractor_registration: r.tractor_registration,
          }))
        : [];

      const pairRows = pairRes?.data
        ? [
            {
              id: "pair_" + pairRes.data.group.id,
              type: "pair",
              group_id: pairRes.data.group.id,
              lat: pairRes.data.farmers[0]?.farm_lat,
              lng: pairRes.data.farmers[0]?.farm_lng,
              service: pairRes.data.farmers[0]?.service,
              farm_size_acres: pairRes.data.group.total_acres,
              request_code: "PAIR-" + pairRes.data.group.id,
              farmers: pairRes.data.farmers,
            },
          ]
        : [];

      const merged = [...singleRows, ...pairRows];

      setList(merged);

      if (!selectedId && merged[0]) {
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
  }, []);

  /* =========================
     ACTION
  ========================= */

  const handleAction = async (action) => {
    if (!selected || loading) return;

    try {
      setLoading(true);

      if (selected.type === "single") {
        await spiTractorsApi.ownerRequestActionSingle({
          offer_id: selected.offer_id,
          action,
        });
      }

      if (selected.type === "pair") {
        if (action === "ACCEPT") {
          await spiTractorsApi.ownerAcceptPairGroup({
            group_id: selected.group_id,
          });
        } else {
          await spiTractorsApi.ownerDeclinePairGroup({
            group_id: selected.group_id,
          });
        }
      }

      await load();
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  const countLabel = `${list.length} New Job request${
    list.length === 1 ? "" : "s"
  }`;

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
          <div className="jobpanel-title">
            {selected?.type === "pair"
              ? "Pair Request"
              : "Single Request"}
          </div>

          <div className="jobpanel-sub">
            {selected?.request_code}
          </div>
        </div>

        <div className="jobpanel-badge">
          {loading ? "Loading..." : countLabel}
        </div>
      </div>

      {list.length > 1 && (
        <select
          value={selected?.id || ""}
          onChange={(e) => setSelectedId(e.target.value)}
        >
          {list.map((x) => (
            <option key={x.id} value={x.id}>
              {x.request_code} • {prettyService(x.service)}
            </option>
          ))}
        </select>
      )}

      <div className="mapbox">
        {hasMap ? (
          <iframe
            title="map"
            src={mapUrl}
            style={{ width: "100%", height: 220, border: 0 }}
          />
        ) : (
          <div>No map</div>
        )}
      </div>

      <div className="job-meta">

        <div className="row">
          <span className="k">Service</span>
          <span className="v">
            {prettyService(selected?.service)}
          </span>
        </div>

        <div className="row">
          <span className="k">
            {selected?.type === "pair"
              ? "Total Acres"
              : "Farm Size"}
          </span>

          <span className="v">
            {selected?.farm_size_acres} acres
          </span>
        </div>

        {selected?.type === "pair" && (
          <div className="row">
            <span className="k">Farmers</span>
            <span className="v">
              {selected.farmers?.length}
            </span>
          </div>
        )}

      </div>

      <div className="jobpanel-actions">

        <button
          className="accept"
          onClick={() => handleAction("ACCEPT")}
          disabled={loading}
        >
          Accept
        </button>

        <button
          className="decline"
          onClick={() => handleAction("DECLINE")}
          disabled={loading}
        >
          Decline
        </button>

      </div>

    </div>
  );
}
