import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./TractorAvailability.css";
import { spiTractorsApi } from "../api/spiTractorsApi";

export default function TractorAvailability() {
  const navigate = useNavigate();
  const location = useLocation();

  const tractorIdFromState = location.state?.tractorId;
  const tractorIdFromStorage = localStorage.getItem("spiLastTractorId");
  const tractorId = Number(tractorIdFromState || tractorIdFromStorage || 0);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    preferredDays: "",
    restrictedDays: "",
    dailyStart: "",
    endTime: "",
  });

  const onChange = (key) => (e) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

  const onSave = async () => {
    if (!tractorId) {
      alert("Missing tractor ID. Please go back and add tractor again.");
      return;
    }

    // Optional validation (you can loosen it if you want)
    if (!form.preferredDays || !form.dailyStart || !form.endTime) {
      alert("Please enter Preferred Days, Daily Start, and End Time.");
      return;
    }

    try {
      setLoading(true);

      await spiTractorsApi.updateTractorAvailability({
        tractor_id: tractorId,
        preferred_days: form.preferredDays,
        restricted_days: form.restrictedDays,
        daily_start: form.dailyStart,
        end_time: form.endTime,
      });

      navigate("/Spi_Tractors-AddPaymentMethod/", { state: { tractorId } });
    } catch (e) {
      alert(e?.message || "Unable to save availability");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="avail-page">
      <div className="avail-container">
        <h1 className="avail-title">Add your tractor</h1>
        <p className="avail-subtitle">
          Sign up to access affordable mechanization services and optimize your farming.
        </p>

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

        <button className="avail-btn" onClick={onSave} disabled={loading}>
          {loading ? "Saving..." : "Save & Continue"}
        </button>
      </div>
    </div>
  );
}
