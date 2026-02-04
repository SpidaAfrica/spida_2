import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddTractors.css";

export default function AddTractor() {
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(1); // 1,2,3 (UI only)
  const [form, setForm] = useState({
    model: "",
    brand: "",
    spec: "",
    tractorId: "",
    releaseYear: "",
    speed: "",
  });

  const clearViewRef = useRef(null);
  const ploughRef = useRef(null);
  const conditionRef = useRef(null);

  const onChange = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const pickFile = (ref) => ref?.current?.click();

  const onSave = () => {
    // TODO: send form + images to backend
    // Next step page route can be changed
    navigate("/tractor-capability");
  };

  const onSkip = () => {
    navigate("/"); // or dashboard route
  };

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
              <span className={`label ${activeStep === 1 ? "active" : ""}`}>Tractor Details</span>
            </div>

            <div className="line" />

            <div className="step">
              <div className={`dot ${activeStep >= 2 ? "active" : ""}`} />
              <span className={`label ${activeStep === 2 ? "active" : ""}`}>Capability and Cost</span>
            </div>

            <div className="line" />

            <div className="step">
              <div className={`dot ${activeStep >= 3 ? "active" : ""}`} />
              <span className={`label ${activeStep === 3 ? "active" : ""}`}>Set Availability</span>
            </div>
          </div>

          {/* Progress line fill */}
          <div className="stepper-bar">
            <div
              className="stepper-fill"
              style={{ width: activeStep === 1 ? "33%" : activeStep === 2 ? "66%" : "100%" }}
            />
          </div>
        </div>

        <h2 className="section-heading">Tractor Details:</h2>

        {/* Form grid */}
        <div className="tractor-form">
          <div className="field">
            <label>Tractor Model</label>
            <input
              value={form.model}
              onChange={onChange("model")}
              placeholder="e.g John Deere 5055E"
            />
          </div>

          <div className="field">
            <label>Brand</label>
            <input value={form.brand} onChange={onChange("brand")} placeholder="e.g John Deere" />
          </div>

          <div className="field">
            <label>Equipment Specifications</label>
            <select value={form.spec} onChange={onChange("spec")}>
              <option value="" disabled>
                e.g Ploughing
              </option>
              <option value="Ploughing">Ploughing</option>
              <option value="Harrowing">Harrowing</option>
              <option value="Ridging">Ridging</option>
              <option value="Planting">Planting</option>
              <option value="Spraying">Spraying</option>
              <option value="Harvesting">Harvesting</option>
            </select>
          </div>

          <div className="field">
            <label>Tractor ID</label>
            <input value={form.tractorId} onChange={onChange("tractorId")} placeholder="e.g GHI-012QR" />
          </div>

          <div className="field">
            <label>Release Year</label>
            <input value={form.releaseYear} onChange={onChange("releaseYear")} placeholder="e.g 2020" />
          </div>

          <div className="field">
            <label>Travel Speed</label>
            <input value={form.speed} onChange={onChange("speed")} placeholder="e.g 25 km/h" />
          </div>
        </div>

        <h3 className="upload-heading">Upload tractor photos</h3>

        {/* Upload cards */}
        <div className="upload-stack">
          {/* 1 */}
          <div className="upload-card">
            <input
              ref={clearViewRef}
              type="file"
              accept="image/*"
              className="hidden-file"
              onChange={() => {}}
            />
            <button type="button" className="upload-btn" onClick={() => pickFile(clearViewRef)}>
              <span className="upload-ic" aria-hidden="true">⤴</span>
              Upload Clear side view of the tractor
            </button>
          </div>

          {/* 2 */}
          <div className="upload-card">
            <input
              ref={ploughRef}
              type="file"
              accept="image/*"
              className="hidden-file"
              onChange={() => {}}
            />
            <button type="button" className="upload-btn" onClick={() => pickFile(ploughRef)}>
              <span className="upload-ic" aria-hidden="true">⤴</span>
              Upload Close-up of plough attachment
            </button>
          </div>

          {/* 3 */}
          <div className="upload-card">
            <input
              ref={conditionRef}
              type="file"
              accept="image/*"
              className="hidden-file"
              onChange={() => {}}
            />
            <button type="button" className="upload-btn" onClick={() => pickFile(conditionRef)}>
              <span className="upload-ic" aria-hidden="true">⤴</span>
              Upload Overall equipment condition
            </button>
          </div>
        </div>

        {/* Actions */}
        <button className="primary-btn" onClick={() => navigate("/Spi_Tractors-Tractor-Capability")
}>
          Save &amp; Continue
        </button>
        <div className="secondary-btn" onClick={onSkip}>
          Skip
        </div>

        {/* (Optional) quick step switching for demo */}
      </div>
    </div>
  );
}
