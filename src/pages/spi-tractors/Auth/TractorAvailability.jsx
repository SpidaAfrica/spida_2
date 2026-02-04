import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./TractorAvailability.css";

export default function TractorAvailability() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    preferredDays: "",
    restrictedDays: "",
    dailyStart: "",
    endTime: "",
  });

  const onChange = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const onSave = () => {
    // TODO: send to backend
    // Next page can be dashboard or tractor list
    navigate("/Spi_Tractors-AddPaymentMethod/");
  };

  return (
    <div className="avail-page">
      <div className="avail-container">
        <h1 className="avail-title">Add your tractor</h1>
        <p className="avail-subtitle">
          Sign up to access affordable mechanization services and optimize your farming.
        </p>

        {/* Stepper */}
        <div className="avail-stepper">
          <div className="avail-stepper-top">
            <div className="avail-step">
              <div className="avail-dot active" />
              <span className="avail-label">Tractor Details</span>
            </div>

            <div className="avail-line" />

            <div className="avail-step">
              <div className="avail-dot active" />
              <span className="avail-label">Capability and Cost</span>
            </div>

            <div className="avail-line" />

            <div className="avail-step">
              <div className="avail-dot active" />
              <span className="avail-label active">Set Availability</span>
            </div>
          </div>

          <div className="avail-bar">
            <div className="avail-fill" />
          </div>
        </div>

        <h2 className="avail-section">Set Availability</h2>

        <div className="avail-form">
          <div className="avail-field">
            <label>Preferred Days</label>
            <input
              value={form.preferredDays}
              onChange={onChange("preferredDays")}
              placeholder="e.g Monday - Friday"
            />
          </div>

          <div className="avail-field">
            <label>Restricted Days</label>
            <input
              value={form.restrictedDays}
              onChange={onChange("restrictedDays")}
              placeholder="e.g Weekends"
            />
          </div>

          <div className="avail-field">
            <label>Daily Start</label>
            <input
              value={form.dailyStart}
              onChange={onChange("dailyStart")}
              placeholder="e.g 8:00 AM"
            />
          </div>

          <div className="avail-field">
            <label>End Time</label>
            <input
              value={form.endTime}
              onChange={onChange("endTime")}
              placeholder="e.g 5:00 PM"
            />
          </div>
        </div>

        <div className="avail-btn" onClick={onSave}>
          Save &amp; Continue
        </div>
      </div>
    </div>
  );
}
