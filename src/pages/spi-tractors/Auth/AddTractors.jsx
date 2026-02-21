import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddTractors.css";
import { spiTractorsApi } from "../api/spiTractorsApi";

const MAX_MB = 5;
const MAX_BYTES = MAX_MB * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function AddTractor() {
  const navigate = useNavigate();

  const [activeStep] = useState(1);

  const [form, setForm] = useState({
    model: "",
    brand: "",
    spec: "",
    tractorId: "",
    releaseYear: "",
    speed: "",
  });

  const [photos, setPhotos] = useState({
    side: null,
    plough: null,
    condition: null,
  });

  const [loading, setLoading] = useState(false);

  const clearViewRef = useRef(null);
  const ploughRef = useRef(null);
  const conditionRef = useRef(null);

  const onChange = (key) => (e) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

  const pickFile = (ref) => ref?.current?.click();

  const validateImage = (file) => {
    if (!file) return "No file selected";
    if (!ALLOWED_TYPES.includes(file.type)) return "Only JPG, PNG, or WEBP images are allowed.";
    if (file.size > MAX_BYTES) return `Image must be ${MAX_MB}MB or less.`;
    return null;
  };

  const onPickPhoto = (key) => (e) => {
    const f = e.target.files?.[0] || null;
    if (!f) return;

    const err = validateImage(f);
    if (err) {
      alert(err);
      e.target.value = "";
      return;
    }

    setPhotos((p) => ({ ...p, [key]: f }));
  };

  const onSave = async () => {
    if (loading) return;

    if (!form.brand.trim() || !form.model.trim() || !form.tractorId.trim()) {
      alert("Please fill Tractor Model, Brand, and Tractor ID.");
      return;
    }

    // If you want to FORCE uploads, uncomment:
    // if (!photos.side || !photos.plough || !photos.condition) {
    //   alert("Please upload all tractor photos.");
    //   return;
    // }

    try {
      setLoading(true);

      const fd = new FormData();

      // basic tractor fields
      fd.append("name", `${form.brand} ${form.model}`.trim());
      fd.append("registration_id", form.tractorId.trim());
      fd.append("model", form.model.trim());
      fd.append("brand", form.brand.trim());
      fd.append("base_rate_per_hour", "5000");

      // optional extras (send if you want them stored)
      if (form.spec) fd.append("spec", form.spec);
      if (form.releaseYear) fd.append("release_year", form.releaseYear.trim());
      if (form.speed) fd.append("travel_speed", form.speed.trim());

      // photos (IMPORTANT: field names must match backend)
      if (photos.side) fd.append("photo_side", photos.side);
      if (photos.plough) fd.append("photo_plough", photos.plough);
      if (photos.condition) fd.append("photo_condition", photos.condition);

      const res = await spiTractorsApi.createTractor(fd);

      if (!res?.success) throw new Error(res?.message || "Unable to save tractor");

      navigate("/Spi_Tractors-Tractor-Capability");
    } catch (error) {
      alert(error?.message || "Unable to save tractor");
    } finally {
      setLoading(false);
    }
  };

  const onSkip = () => navigate("/");

  return (
    <div className="tractor-page">
      <div className="tractor-container">
        <h1 className="tractor-title">Add your tractor</h1>
        <p className="tractor-subtitle">
          Sign up to access affordable mechanization services and optimize your farming.
        </p>

        {/* Stepper */}
        <div className="stepper">
          <div className="stepper-top">
            <div className="step">
              <div className={`dot ${activeStep >= 1 ? "active" : ""}`} />
              <span className={`label ${activeStep === 1 ? "active" : ""}`}>
                Tractor Details
              </span>
            </div>

            <div className="line" />

            <div className="step">
              <div className={`dot ${activeStep >= 2 ? "active" : ""}`} />
              <span className={`label ${activeStep === 2 ? "active" : ""}`}>
                Capability and Cost
              </span>
            </div>

            <div className="line" />

            <div className="step">
              <div className={`dot ${activeStep >= 3 ? "active" : ""}`} />
              <span className={`label ${activeStep === 3 ? "active" : ""}`}>
                Set Availability
              </span>
            </div>
          </div>

          <div className="stepper-bar">
            <div className="stepper-fill" style={{ width: "33%" }} />
          </div>
        </div>

        <h2 className="section-heading">Tractor Details:</h2>

        <div className="tractor-form">
          <div className="field">
            <label>Tractor Model *</label>
            <input
              value={form.model}
              onChange={onChange("model")}
              placeholder="e.g John Deere 5055E"
            />
          </div>

          <div className="field">
            <label>Brand *</label>
            <input
              value={form.brand}
              onChange={onChange("brand")}
              placeholder="e.g John Deere"
            />
          </div>

          <div className="field">
            <label>Equipment Specifications</label>
            <select value={form.spec} onChange={onChange("spec")}>
              <option value="">Select</option>
              <option value="Ploughing">Ploughing</option>
              <option value="Harrowing">Harrowing</option>
              <option value="Ridging">Ridging</option>
              <option value="Planting">Planting</option>
              <option value="Spraying">Spraying</option>
              <option value="Harvesting">Harvesting</option>
            </select>
          </div>

          <div className="field">
            <label>Tractor ID *</label>
            <input
              value={form.tractorId}
              onChange={onChange("tractorId")}
              placeholder="e.g GHI-012QR"
            />
          </div>

          <div className="field">
            <label>Release Year</label>
            <input
              value={form.releaseYear}
              onChange={onChange("releaseYear")}
              placeholder="e.g 2020"
            />
          </div>

          <div className="field">
            <label>Travel Speed</label>
            <input
              value={form.speed}
              onChange={onChange("speed")}
              placeholder="e.g 25 km/h"
            />
          </div>
        </div>

        <h3 className="upload-heading">Upload tractor photos</h3>

        <div className="upload-stack">
          {/* Side view */}
          <div className="upload-card">
            <input
              ref={clearViewRef}
              type="file"
              accept="image/*"
              className="hidden-file"
              onChange={onPickPhoto("side")}
            />
            <button type="button" className="upload-btn" onClick={() => pickFile(clearViewRef)}>
              <span className="upload-ic" aria-hidden="true">⤴</span>
              Upload Clear side view of the tractor
            </button>
            <small>{photos.side ? `${photos.side.name} • ${(photos.side.size / 1024 / 1024).toFixed(2)}MB` : "No file selected"}</small>
          </div>

          {/* Plough */}
          <div className="upload-card">
            <input
              ref={ploughRef}
              type="file"
              accept="image/*"
              className="hidden-file"
              onChange={onPickPhoto("plough")}
            />
            <button type="button" className="upload-btn" onClick={() => pickFile(ploughRef)}>
              <span className="upload-ic" aria-hidden="true">⤴</span>
              Upload Close-up of plough attachment
            </button>
            <small>{photos.plough ? `${photos.plough.name} • ${(photos.plough.size / 1024 / 1024).toFixed(2)}MB` : "No file selected"}</small>
          </div>

          {/* Condition */}
          <div className="upload-card">
            <input
              ref={conditionRef}
              type="file"
              accept="image/*"
              className="hidden-file"
              onChange={onPickPhoto("condition")}
            />
            <button type="button" className="upload-btn" onClick={() => pickFile(conditionRef)}>
              <span className="upload-ic" aria-hidden="true">⤴</span>
              Upload Overall equipment condition
            </button>
            <small>{photos.condition ? `${photos.condition.name} • ${(photos.condition.size / 1024 / 1024).toFixed(2)}MB` : "No file selected"}</small>
          </div>
        </div>

        <button className="primary-btn" onClick={onSave} disabled={loading}>
          {loading ? "Saving..." : "Save & Continue"}
        </button>

        <div className="secondary-btn" onClick={onSkip}>
          Skip
        </div>
      </div>
    </div>
  );
}
