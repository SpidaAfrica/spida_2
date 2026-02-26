import { useState } from "react";
import { spiTractorsApi } from "../../api/spiTractorsApi";

export default function EquipmentHeader({ onCreated }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    registration_id: "",
    model: "",
    brand: "",
    spec: "",
    release_year: "",
    base_rate_per_hour: "",
    city: "",
    lat: "",
    lng: "",
  });

  const onChange = (k) => (e) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  const onSubmit = async () => {
    try {
      setLoading(true);

      await spiTractorsApi.createTractor({
        ...form,
        base_rate_per_hour: Number(form.base_rate_per_hour || 0),
        lat: form.lat ? Number(form.lat) : null,
        lng: form.lng ? Number(form.lng) : null,
      });

      setOpen(false);
      onCreated?.(); // refresh grid
    } catch (e) {
      alert(e?.message || "Unable to create tractor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="eq-header">
        <h1 className="eq-title">Manage Equipment</h1>

        <div className="eq-controls">
          <div className="eq-filters">
            <button className="eq-chip">
              Week <span className="eq-chev">▾</span>
            </button>
            <button className="eq-chip">
              January 20-26 - February 10-16 <span className="eq-chev">▾</span>
            </button>
          </div>

          <button className="eq-action" onClick={() => setOpen(true)}>
            <span className="eq-gear">⚙</span> Add New Equipment
          </button>
        </div>
      </div>

      {open && (
        <div className="eq-modal">
          <div className="eq-modal-card">
            <h3>Add Tractor</h3>

            <input placeholder="Name" onChange={onChange("name")} />
            <input placeholder="Registration ID" onChange={onChange("registration_id")} />
            <input placeholder="Model" onChange={onChange("model")} />
            <input placeholder="Brand" onChange={onChange("brand")} />
            <input placeholder="Spec (Ploughing etc)" onChange={onChange("spec")} />
            <input placeholder="Release Year" onChange={onChange("release_year")} />
            <input placeholder="Base Rate /hr" onChange={onChange("base_rate_per_hour")} />
            <input placeholder="City" onChange={onChange("city")} />
            <input placeholder="Latitude" onChange={onChange("lat")} />
            <input placeholder="Longitude" onChange={onChange("lng")} />

            <button onClick={onSubmit} disabled={loading}>
              {loading ? "Saving..." : "Create Tractor"}
            </button>

            <button onClick={() => setOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
}
