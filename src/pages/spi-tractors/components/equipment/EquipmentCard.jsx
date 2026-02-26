import { useEffect, useState } from "react";
import { spiTractorsApi } from "../../api/spiTractorsApi";

export default function EquipmentCard({ item, onSaved }) {
  const [status, setStatus] = useState(item.status || "Available");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setStatus(item.status || "Available");
  }, [item.status]);

  const isMaintenance = status === "Under maintenance";

  const onChangeStatus = async (newStatus) => {
    setStatus(newStatus); // optimistic UI
    try {
      setSaving(true);
      await spiTractorsApi.updateTractorAvailable({
        tractor_id: item.id,
        availability_status: newStatus,
      });
      onSaved?.();
    } catch (e) {
      alert(e?.message || "Unable to update tractor status");
      setStatus(item.status || "Available"); // rollback
    } finally {
      setSaving(false);
    }
  };

  return (
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

          <button className="eq-details" type="button">
            {saving ? "Saving..." : "Tractor Details"}
          </button>
        </div>
      </div>
    </div>
  );
}
