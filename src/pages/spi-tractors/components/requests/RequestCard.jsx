import { useState, useMemo } from "react";
import { spiTractorsApi } from "../../api/spiTractorsApi"; // adjust path if needed

function prettyService(serviceRaw) {
  const s = String(serviceRaw || "").toLowerCase();
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : "-";
}

function mapSrc(lat, lng) {
  // OpenStreetMap embed (no API key)
  const d = 0.01; // zoom delta
  const left = lng - d;
  const right = lng + d;
  const top = lat + d;
  const bottom = lat - d;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${lat}%2C${lng}`;
}

export default function RequestCard({ data, onChanged }) {
  const [loading, setLoading] = useState(false);

  const hasMap = Number.isFinite(Number(data.farm_lat)) && Number.isFinite(Number(data.farm_lng));
  const phone = String(data.farmer_phone || "").trim();

  const mapUrl = useMemo(() => {
    if (!hasMap) return "";
    return mapSrc(Number(data.farm_lat), Number(data.farm_lng));
  }, [hasMap, data.farm_lat, data.farm_lng]);

  const onAccept = async () => {
    if (loading) return;
    try {
      setLoading(true);

      // Must have suggested tractor id (backend picks closest)
      if (!data.suggested_tractor_id) {
        throw new Error("No tractor was suggested for this request yet.");
      }

      await spiTractorsApi.ownerRequestAction({
        request_id: data.request_id,
        action: "ACCEPT",
        tractor_id: data.suggested_tractor_id,
      });

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

      await spiTractorsApi.ownerRequestAction({
        request_id: data.request_id,
        action: "DECLINE",
      });

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
          <div className="req-map-skeleton">No Map (missing farm_lat/farm_lng)</div>
        )}
      </div>

      {/* Details */}
      <div className="req-details">
        <div className="req-details-head">
          <div>
            <div className="req-id">{data.request_code || data.request_id}</div>
            <div className="req-small">{data.full_name ? "1 Farmer" : "-"}</div>
          </div>

          <div className="req-contact">
            {phone ? (
              <a className="req-ic" title={`Call ${phone}`} href={`tel:${phone}`}>
                📞
              </a>
            ) : (
              <button className="req-ic" title="No phone number" disabled>
                📞
              </button>
            )}
          </div>
        </div>

        <div className="req-grid">
          <div className="req-field">
            <div className="req-k">Farm Name</div>
            <div className="req-v strong">{data.farm_name || "-"}</div>

            <div className="req-k mt">Farmer</div>
            <div className="req-v">{data.full_name || "-"}</div>
          </div>

          <div className="req-field">
            <div className="req-k">Farm Location</div>
            <div className="req-v">{data.farm_address || "-"}</div>
          </div>

          <div className="req-field">
            <div className="req-k">Service Needed</div>
            <div className="req-v strong">{prettyService(data.service)}</div>

            <div className="req-k mt">Preferred Date</div>
            <div className="req-v">{data.preferred_date || "-"}</div>
          </div>

          <div className="req-field">
            <div className="req-k">Farm Size</div>
            <div className="req-v">{Number(data.farm_size_acres || 0)} acres</div>

            <div className="req-k mt">Suggested Tractor</div>
            <div className="req-v">
              {data.suggested_tractor_reg_id || data.suggested_tractor_id || "-"}
            </div>
          </div>
        </div>

        <div className="req-divider" />

        <div className="req-actions">
          <button className="req-accept" onClick={onAccept} disabled={loading}>
            {loading ? "Working..." : "Accept"}
          </button>
          <button className="req-decline" onClick={onDecline} disabled={loading}>
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
