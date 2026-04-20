import { useEffect, useState } from "react";
import { spiTractorsApi } from "../../api/spiTractorsApi";

export default function EquipmentCard({ item, onSaved }) {
  const [status, setStatus]   = useState(item.status || "Available");
  const [saving, setSaving]   = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setStatus(item.status || "Available");
  }, [item.status]);

  const isMaintenance = status === "Under maintenance";

  const onChangeStatus = async (newStatus) => {
    setStatus(newStatus);
    try {
      setSaving(true);
      await spiTractorsApi.updateTractorAvailable({
        tractor_id:          item.id,
        availability_status: newStatus,
      });
      onSaved?.();
    } catch (e) {
      alert(e?.message || "Unable to update tractor status");
      setStatus(item.status || "Available");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="eq-card">
        <div className="eq-imgwrap">
          <img className="eq-img" src={item.image} alt={item.name} />
        </div>

        <div className="eq-body">
          <div className="eq-name">{item.name}</div>
          <div className="eq-reg">
            <span className="eq-reg-label">Reg. ID:</span> {item.reg}
          </div>
          <div className="eq-meta">{item.completed} Requests Completed</div>

          <div className="eq-actions">
            <div className={`eq-status ${isMaintenance ? "warn" : "ok"}`}>
              <select
                className="eq-select"
                value={status}
                disabled={saving}
                onChange={(e) => onChangeStatus(e.target.value)}
              >
                <option value="Available">Available</option>
                <option value="Under maintenance">Under maintenance</option>
                <option value="Unavailable">Unavailable</option>
              </select>
              <span className="eq-caret">▾</span>
            </div>

            <button
              className="eq-details"
              type="button"
              onClick={() => setShowModal(true)}
              disabled={saving}
            >
              Tractor Details
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <TractorDetailsModal item={item} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}

/* -----------------------------------------------
   Tractor Details Modal
----------------------------------------------- */
function TractorDetailsModal({ item, onClose }) {
  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff", borderRadius: 16, padding: 24,
          width: "100%", maxWidth: 420, boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: "absolute", top: 14, right: 14,
            background: "none", border: "none", fontSize: 18,
            cursor: "pointer", color: "#6b7280",
          }}
          aria-label="Close"
        >
          ✕
        </button>

        {/* Image */}
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <img
            src={item.image}
            alt={item.name}
            style={{
              width: "100%", maxHeight: 180, objectFit: "cover",
              borderRadius: 12, border: "1px solid #eef0f2",
            }}
          />
        </div>

        <h3 style={{ margin: "0 0 14px", fontSize: 16, fontWeight: 800 }}>
          {item.name}
        </h3>

        <div style={{ display: "grid", gap: 10 }}>
          <DetailRow label="Registration ID"    value={item.reg} />
          <DetailRow label="Model"              value={item.model} />
          <DetailRow label="Brand"              value={item.brand} />
          <DetailRow label="Spec / Service"     value={item.spec} />
          <DetailRow label="Release Year"       value={item.release_year} />
          <DetailRow label="Travel Speed"       value={item.travel_speed} />
          <DetailRow label="Base Rate / hr"     value={item.base_rate ? `₦${Number(item.base_rate).toLocaleString()}` : undefined} />
          <DetailRow label="Daily Capacity"     value={item.daily_capacity ? `${item.daily_capacity} acres` : undefined} />
          <DetailRow label="City"               value={item.city} />
          <DetailRow
            label="Location (GPS)"
            value={
              item.lat && item.lng
                ? `${Number(item.lat).toFixed(5)}, ${Number(item.lng).toFixed(5)}`
                : undefined
            }
          />
          <DetailRow label="Status"             value={item.status} />
          <DetailRow label="Requests Completed" value={String(item.completed)} />
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  if (!value && value !== 0) return null;
  return (
    <div
      style={{
        display: "flex", justifyContent: "space-between",
        gap: 10, fontSize: 13,
        borderBottom: "1px solid #f3f4f6", paddingBottom: 8,
      }}
    >
      <span style={{ color: "#6b7280", fontWeight: 600, flexShrink: 0 }}>{label}</span>
      <span style={{ fontWeight: 700, textAlign: "right" }}>{value}</span>
    </div>
  );
}
