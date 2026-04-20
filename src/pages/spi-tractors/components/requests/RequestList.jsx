import { useEffect, useMemo, useState } from "react";
import RequestCard from "./RequestCard";
import { spiTractorsApi } from "../../api/spiTractorsApi";

export default function RequestList() {
  const [loading, setLoading] = useState(false);
  const [rows, setRows]       = useState([]);
  const [err, setErr]         = useState("");

  const load = async () => {
    try {
      setErr("");
      setLoading(true);

      const [singleRes, pairRes] = await Promise.all([
        spiTractorsApi.ownerNewRequestsSingle(),
        spiTractorsApi.ownerNewRequestsPair(),
      ]);

      const singleRows = Array.isArray(singleRes?.data)
        ? singleRes.data.map((r) => ({
            // FIX: was using ...r spread which lost field names.
            // Now explicitly map ALL fields so RequestCard can use offer_id for accept/decline.
            id:                   "single_" + r.offer_id,
            type:                 "single",
            offer_id:             r.offer_id,        // ← critical for accept/decline
            request_id:           r.request_id,
            request_code:         r.request_code,
            service:              r.service,
            farm_name:            r.farm_name,
            farm_address:         r.farm_address,
            farm_city:            r.farm_city,
            farm_lat:             r.farm_lat,
            farm_lng:             r.farm_lng,
            farm_size_acres:      r.farm_size_acres,
            full_name:            r.full_name,
            farmer_phone:         r.farmer_phone,
            preferred_date:       r.preferred_date,
            distance_km:          r.distance_km,
            eta_minutes:          r.eta_minutes,
            tractor_registration: r.tractor_registration,
          }))
        : [];

      const pairRows = pairRes?.data
        ? [
            {
              id:              "pair_" + pairRes.data.group.id,
              type:            "pair",
              group_id:        pairRes.data.group.id,
              request_code:    "PAIR-" + pairRes.data.group.id,
              farm_lat:        pairRes.data.farmers?.[0]?.farm_lat,
              farm_lng:        pairRes.data.farmers?.[0]?.farm_lng,
              farm_address:    pairRes.data.farmers?.[0]?.farm_address,
              farm_city:       pairRes.data.farmers?.[0]?.farm_city,
              service:         pairRes.data.farmers?.[0]?.service,
              farm_size_acres: pairRes.data.group.total_acres,
              farmers:         pairRes.data.farmers,
            },
          ]
        : [];

      setRows([...singleRows, ...pairRows]);
    } catch (e) {
      setErr(e?.message || "Unable to load requests");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // FIX: reduced from aggressive 10s polling to 30s
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
  }, []);

  const countLabel = useMemo(() => {
    const n = rows.length;
    return `${n} New Job Request${n === 1 ? "" : "s"}`;
  }, [rows.length]);

  return (
    <div className="req-list-wrap">
      <div className="req-list-top">
        <div className="req-list-title">
          <span>New Requests</span>
          <span
            className="req-info"
            title="Refresh"
            onClick={load}
            style={{ cursor: "pointer", marginLeft: 6 }}
          >
            ↻
          </span>
        </div>

        <div className="req-list-actions">
          <div className="req-new-badge">{countLabel}</div>
        </div>
      </div>

      {loading && rows.length === 0 && (
        <div style={{ padding: 14, color: "#6b7280", fontSize: 13 }}>Loading requests…</div>
      )}

      {err && (
        <div style={{ padding: 14, color: "crimson", fontSize: 13 }}>{err}</div>
      )}

      <div className="req-list">
        {rows.map((r) => (
          <RequestCard key={r.id} data={r} onChanged={load} />
        ))}

        {!loading && !err && rows.length === 0 && (
          <div style={{ padding: 14, color: "#6b7280", fontSize: 13 }}>
            No new requests right now. Checking every 30 seconds.
          </div>
        )}
      </div>
    </div>
  );
}
