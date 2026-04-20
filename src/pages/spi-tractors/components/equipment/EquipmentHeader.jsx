import { useState } from "react";
import { spiTractorsApi } from "../../api/spiTractorsApi";
import "./EquipmentHeader.css";

const SPEC_OPTIONS = [
  "Ploughing",
  "Harrowing",
  "Ridging",
  "Planting",
  "Spraying",
  "Harvesting",
];

const CURRENT_YEAR = new Date().getFullYear();

export default function EquipmentHeader({ onCreated }) {
  const [open, setOpen]         = useState(false);
  const [loading, setLoading]   = useState(false);
  const [gettingGps, setGettingGps] = useState(false);

  const emptyForm = {
    name:               "",
    registration_id:    "",
    model:              "",
    brand:              "",
    spec:               "",
    release_year:       "",
    base_rate_per_hour: "",
    daily_capacity:     "",
    travel_speed:       "",
    city:               "",
    lat:                "",
    lng:                "",
  };

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const onChange = (k) => (e) => {
    setForm((p) => ({ ...p, [k]: e.target.value }));
    setErrors((p) => ({ ...p, [k]: "" }));
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported on this device/browser.");
      return;
    }
    setGettingGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((p) => ({
          ...p,
          lat: String(pos.coords.latitude),
          lng: String(pos.coords.longitude),
        }));
        setGettingGps(false);
      },
      (err) => {
        alert(err?.message || "Location access denied. Please allow location access.");
        setGettingGps(false);
      },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim())               errs.name              = "Required";
    if (!form.registration_id.trim())    errs.registration_id   = "Required";
    if (!form.model.trim())              errs.model             = "Required";
    if (!form.brand.trim())              errs.brand             = "Required";
    if (!form.spec)                      errs.spec              = "Required";
    if (!form.base_rate_per_hour)        errs.base_rate_per_hour= "Required";
    if (Number(form.base_rate_per_hour) <= 0) errs.base_rate_per_hour = "Must be > 0";
    if (!form.daily_capacity)            errs.daily_capacity    = "Required";
    if (Number(form.daily_capacity) <= 0) errs.daily_capacity   = "Must be > 0";
    if (!form.city.trim())               errs.city              = "Required";

    if (form.release_year && (Number(form.release_year) < 1970 || Number(form.release_year) > CURRENT_YEAR)) {
      errs.release_year = `Must be between 1970 and ${CURRENT_YEAR}`;
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const onSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      await spiTractorsApi.addTractor({
        name:               form.name.trim(),
        registration_id:    form.registration_id.trim(),
        model:              form.model.trim(),
        brand:              form.brand.trim(),
        spec:               form.spec,
        release_year:       form.release_year || undefined,
        travel_speed:       form.travel_speed || undefined,
        base_rate_per_hour: Number(form.base_rate_per_hour),
        daily_capacity:     Number(form.daily_capacity),
        city:               form.city.trim(),
        lat:                form.lat ? Number(form.lat) : null,
        lng:                form.lng ? Number(form.lng) : null,
      });

      setForm(emptyForm);
      setErrors({});
      setOpen(false);
      onCreated?.();
    } catch (e) {
      alert(e?.message || "Unable to create tractor");
    } finally {
      setLoading(false);
    }
  };

  const close = () => {
    setOpen(false);
    setErrors({});
  };

  const Field = ({ label, k, type = "text", inputMode, placeholder, children }) => (
    <div className="eq-field">
      <label className="eq-label">{label}</label>
      {children || (
        <input
          className={`eq-input${errors[k] ? " eq-input-err" : ""}`}
          type={type}
          inputMode={inputMode}
          placeholder={placeholder}
          value={form[k]}
          onChange={onChange(k)}
        />
      )}
      {errors[k] && <span className="eq-field-err">{errors[k]}</span>}
    </div>
  );

  return (
    <>
      <div className="eq-header">
        <h1 className="eq-title">Manage Equipment</h1>

        <div className="eq-controls">
          <button className="eq-action" type="button" onClick={() => setOpen(true)}>
            <span className="eq-gear">⚙</span> Add New Equipment
          </button>
        </div>
      </div>

      {open && (
        <div className="eq-modal" role="dialog" aria-modal="true" onClick={close}>
          <div className="eq-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="eq-modal-head">
              <h3 className="eq-modal-title">Add Tractor</h3>
              <button className="eq-x" type="button" onClick={close} aria-label="Close">
                ✕
              </button>
            </div>

            <div className="eq-form-scroll">
              <div className="eq-form">
                {/* Row 1 */}
                <Field k="name" label="Tractor Name *" placeholder="e.g John Deere 5055E" />
                <Field k="registration_id" label="Registration ID *" placeholder="e.g GHI-012QR" />

                {/* Row 2 */}
                <Field k="model" label="Model *" placeholder="e.g 5055E" />
                <Field k="brand" label="Brand *" placeholder="e.g John Deere" />

                {/* Spec full-width */}
                <div className="eq-field full">
                  <label className="eq-label">Spec / Service *</label>
                  <select
                    className={`eq-input${errors.spec ? " eq-input-err" : ""}`}
                    value={form.spec}
                    onChange={onChange("spec")}
                  >
                    <option value="">Select service capability</option>
                    {SPEC_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {errors.spec && <span className="eq-field-err">{errors.spec}</span>}
                </div>

                {/* Row 3 */}
                <Field k="release_year" label="Release Year" placeholder={`e.g ${CURRENT_YEAR - 3}`} inputMode="numeric" />
                <Field k="travel_speed" label="Travel Speed" placeholder="e.g 25 km/h" />

                {/* Row 4 */}
                <Field k="base_rate_per_hour" label="Base Rate / hr (₦) *" placeholder="e.g 5000" inputMode="numeric" />
                <Field k="daily_capacity" label="Daily Capacity (acres) *" placeholder="e.g 10" inputMode="numeric" />

                {/* City full-width */}
                <Field k="city" label="City *" placeholder="e.g Lagos" />

                {/* GPS row full-width */}
                <div className="eq-field full eq-loc-row">
                  <button
                    className="eq-loc-btn"
                    type="button"
                    onClick={getLocation}
                    disabled={gettingGps}
                  >
                    {gettingGps ? "Getting location…" : "📍 Use My Location"}
                  </button>
                  <span className="eq-loc-help">
                    {form.lat && form.lng
                      ? `GPS: ${Number(form.lat).toFixed(5)}, ${Number(form.lng).toFixed(5)}`
                      : "Fills latitude & longitude automatically"}
                  </span>
                </div>

                {/* Lat / Lng */}
                <Field k="lat" label="Latitude" placeholder="e.g 6.5244" inputMode="decimal" />
                <Field k="lng" label="Longitude" placeholder="e.g 3.3792" inputMode="decimal" />
              </div>
            </div>

            <div className="eq-actionsRow">
              <button
                className="eq-primary"
                type="button"
                onClick={onSubmit}
                disabled={loading}
              >
                {loading ? "Saving…" : "Create Tractor"}
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
