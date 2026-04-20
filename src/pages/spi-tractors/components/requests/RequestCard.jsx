import { useState, useMemo } from "react";
import { spiTractorsApi } from "../../api/spiTractorsApi";
import call from "../../../../assets/images/elements (9).png";

function prettyService(serviceRaw) {
  const s = String(serviceRaw || "").toLowerCase();
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : "—";
}

function mapSrc(lat, lng) {
  const d      = 0.01;
  const left   = lng - d;
  const right  = lng + d;
  const top    = lat + d;
  const bottom = lat - d;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${lat}%2C${lng}`;
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
}

export default function RequestCard({ data, onChanged }) {
  const [loading, setLoading] = useState(false);

  const isPair  = data.type === "pair";
  const hasMap  = Number.isFinite(Number(data.farm_lat)) && Number.isFinite(Number(data.farm_lng));
  const phone   = String(data.farmer_phone || "").trim();

  const mapUrl = useMemo(() => {
    if (!hasMap) return "";
    return mapSrc(Number(data.farm_lat), Number(data.farm_lng));
  }, [hasMap, data.farm_lat, data.farm_lng]);

  const onAccept = async () => {
    if (loading) return;
    try {
      setLoading(true);

      if (isPair) {
        await spiTractorsApi.ownerAcceptPairGroup({ group_id: data.group_id });
      } else {
        // FIX: was calling spiTractorsApi.ownerRequestAction() which does NOT exist.
        // Correct method is ownerRequestActionSingle() with offer_id + action.
        if (!data.offer_id) {
          throw new Error("No offer ID found for this request. Cannot accept.");
        }
        await spiTractorsApi.ownerRequestActionSingle({
          offer_id: data.offer_id,
          action:   "ACCEPT",
        });
      }

      onChanged?.();
    } catch (e) {
      alert(e?.message || "Unable to accept request");
    } finally {
      setLoading(false);
    }
  };

  const onDecline = async () => {
    if (loading) return;
    try {
      setLoading(true);

      if (isPair) {
        await spiTractorsApi.ownerDeclinePairGroup({ group_id: data.group_id });
      } else {
        if (!data.offer_id) {
          throw new Error("No offer ID found for this request. Cannot decline.");
        }
        await spiTractorsApi.ownerRequestActionSingle({
          offer_id: data.offer_id,
          action:   "DECLINE",
        });
      }

      onChanged?.();
    } catch (e) {
      alert(e?.message || "Unable to decline request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="req-card">

      {/* Map */}
      <div className="req-map">
        {hasMap ? (
          <iframe
            title={`map-${data.request_code || data.request_id}`}
            src={mapUrl}
            className="req-map-iframe"
            loading="lazy"
          />
        ) : (
          <div className="req-map-skeleton">📍 No location data</div>
        )}
      </div>

      {/* Details */}
      <div className="req-details">
        <div className="req-details-head">
          <div>
            <div className="req-id">{data.request_code || ("REQ-" + data.request_id)}</div>
            <div className="req-type">
              {isPair
                ? <span className="badge-pair-sm">PAIR REQUEST</span>
                : <span className="badge-single-sm">SINGLE REQUEST</span>}
            </div>
            <div className="req-small">
              {isPair
                ? `${data.farmers?.length || 0} Farmers · ${data.farm_size_acres || 0} acres total`
                : data.full_name
                  ? `${data.full_name} · ${data.farm_size_acres || 0} acres`
                  : `${data.farm_size_acres || 0} acres`}
            </div>
          </div>

          <div className="req-contact">
            {phone ? (
              <a className="req-ic" title={`Call ${phone}`} href={`tel:${phone}`}>
                <img src={call} style={{ width: 25 }} alt="Call" />
              </a>
            ) : (
              <button className="req-ic" title="No phone number" disabled>
                <img src={call} style={{ width: 25 }} alt="Call" />
              </button>
            )}
          </div>
        </div>

        <div className="req-grid">

          {/* Single request fields */}
          {!isPair && (
            <>
              <div className="req-field">
                <div className="req-k">Farmer</div>
                <div className="req-v strong">{data.full_name || "—"}</div>
                <div className="req-k mt">Farm Name</div>
                <div className="req-v">{data.farm_name || "—"}</div>
              </div>

              <div className="req-field">
                <div className="req-k">Location</div>
                <div className="req-v">
                  {[data.farm_address, data.farm_city].filter(Boolean).join(", ") || "—"}
                </div>
              </div>

              <div className="req-field">
                <div className="req-k">Service</div>
                <div className="req-v strong">{prettyService(data.service)}</div>
                <div className="req-k mt">Preferred Date</div>
                <div className="req-v">{formatDate(data.preferred_date)}</div>
              </div>

              <div className="req-field">
                <div className="req-k">Farm Size</div>
                <div className="req-v">{data.farm_size_acres || 0} acres</div>
                <div className="req-k mt">Distance</div>
                <div className="req-v">
                  {data.distance_km != null ? `${data.distance_km} km` : "—"}
                </div>
              </div>
            </>
          )}

          {/* Pair request fields */}
          {isPair && (
            <>
              <div className="req-field">
                <div className="req-k">Service</div>
                <div className="req-v strong">{prettyService(data.service)}</div>
                <div className="req-k mt">Total Acres</div>
                <div className="req-v">{data.farm_size_acres || 0} acres</div>
              </div>

              <div className="req-field">
                <div className="req-k">Farmers in Group</div>
                <div className="req-v strong">{data.farmers?.length || 0} Farmers</div>
              </div>

              {/* Per-farmer list */}
              {Array.isArray(data.farmers) && data.farmers.map((f, i) => (
                <div className="req-field" key={i} style={{ gridColumn: "1 / -1" }}>
                  <div className="req-k">Farmer #{i + 1}</div>
                  <div className="req-v">
                    <b>{f.full_name || "—"}</b>
                    {f.phone ? ` · ${f.phone}` : ""}
                    {f.acres ? ` · ${f.acres} acres` : ""}
                    {f.farm_city ? ` · ${f.farm_city}` : ""}
                  </div>
                </div>
              ))}
            </>
          )}

        </div>

        <div className="req-divider" />

        <div className="req-actions">
          <button className="req-accept"  onClick={onAccept}  disabled={loading}>
            {loading ? "Working…" : "✓ Accept"}
          </button>
          <button className="req-decline" onClick={onDecline} disabled={loading}>
            ✕ Decline
          </button>
        </div>
      </div>
    </div>
  );
}
