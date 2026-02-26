import { useState } from "react";
import { spiTractorsApi } from "../../api/spiTractorsApi";
import "./EquipmentHeader.css";
export default function EquipmentHeader({ onCreated }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gettingGps, setGettingGps] = useState(false);

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

  const getLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported on this device/browser.");
      return;
    }

    setGettingGps(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setForm((p) => ({
          ...p,
          lat: String(lat),
          lng: String(lng),
        }));

        setGettingGps(false);
      },
      (err) => {
        alert(
          err?.message ||
            "Location permission denied or unavailable. Please allow location access."
        );
        setGettingGps(false);
      },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  };

  const onSubmit = async () => {
    if (!form.name.trim()) return alert("Name is required.");
    if (!form.registration_id.trim()) return alert("Registration ID is required.");
    if (!form.model.trim()) return alert("Model is required.");
    if (!form.brand.trim()) return alert("Brand is required.");
    if (!form.spec.trim()) return alert("Spec is required (e.g Ploughing).");
    if (!form.base_rate_per_hour) return alert("Base rate per hour is required.");

    try {
      setLoading(true);

      await spiTractorsApi.addTractor({
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

  const close = () => setOpen(false);

  return (
    <>
      <div className="eq-header">
        <h1 className="eq-title">Manage Equipment</h1>

        <div className="eq-controls">
          <div className="eq-filters">
            <button className="eq-chip" type="button">
              Week <span className="eq-chev">▾</span>
            </button>
            <button className="eq-chip" type="button">
              January 01-26 - March 31-26 <span className="eq-chev">▾</span>
            </button>
          </div>

          <button className="eq-action" type="button" onClick={() => setOpen(true)}>
            <span className="eq-gear">⚙</span> Add New Equipment
          </button>
        </div>
      </div>

      {open && (
        <div
          className="eq-modal"
          role="dialog"
          aria-modal="true"
          onClick={close}
        >
          <div className="eq-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="eq-modal-head">
              <h3 className="eq-modal-title">Add Tractor</h3>
              <button className="eq-x" type="button" onClick={close} aria-label="Close">
                ✕
              </button>
            </div>

            <div className="eq-form">
              <input placeholder="Name" value={form.name} onChange={onChange("name")} />
              <input
                placeholder="Registration ID"
                value={form.registration_id}
                onChange={onChange("registration_id")}
              />

              <input placeholder="Model" value={form.model} onChange={onChange("model")} />
              <input placeholder="Brand" value={form.brand} onChange={onChange("brand")} />

              <input
                className="full"
                placeholder="Spec (Ploughing, Harrowing etc)"
                value={form.spec}
                onChange={onChange("spec")}
              />

              <input
                placeholder="Release Year"
                value={form.release_year}
                onChange={onChange("release_year")}
              />
              <input
                placeholder="Base Rate /hr"
                value={form.base_rate_per_hour}
                onChange={onChange("base_rate_per_hour")}
                inputMode="numeric"
              />

              <input className="full" placeholder="City" value={form.city} onChange={onChange("city")} />

              <div className="eq-locRow full">
                <button
                  className="eq-locBtn"
                  type="button"
                  onClick={getLocation}
                  disabled={gettingGps}
                >
                  {gettingGps ? "Getting location..." : "Use my location"}
                </button>
                <div className="eq-help">
                  This fills Latitude/Longitude automatically (allow location access).
                </div>
              </div>

              <input
                placeholder="Latitude"
                value={form.lat}
                onChange={onChange("lat")}
              />
              <input
                placeholder="Longitude"
                value={form.lng}
                onChange={onChange("lng")}
              />
            </div>

            <div className="eq-actionsRow">
              <button className="eq-primary" type="button" onClick={onSubmit} disabled={loading}>
                {loading ? "Saving..." : "Create Tractor"}
              </button>
              <button className="eq-secondary" type="button" onClick={close}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
