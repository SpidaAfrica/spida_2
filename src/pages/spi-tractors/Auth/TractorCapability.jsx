import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./TractorCapability.css";
import { spiTractorsApi } from "../api/spiTractorsApi";

export default function TractorCapability() {
  const navigate = useNavigate();
  const location = useLocation();

  const tractorIdFromState = location.state?.tractorId;
  const tractorIdFromStorage = localStorage.getItem("spiLastTractorId");
  const tractorId = Number(tractorIdFromState || tractorIdFromStorage || 0);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    taskRate: "",
    workRate: "",
    dailyCapacity: "",
    travelCost: "",
  });

  const onChange = (key) => (e) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

  const onSave = async () => {
    if (!tractorId) {
      alert("Missing tractor ID. Please go back and add tractor again.");
      return;
    }

    if (!form.taskRate || !form.workRate || !form.dailyCapacity || !form.travelCost) {
      alert("Please complete all fields.");
      return;
    }

    try {
      setLoading(true);

      await spiTractorsApi.updateTractorCapability({
        tractor_id: tractorId,
        task_rate_label: form.taskRate,
        work_rate: form.workRate,
        daily_capacity: form.dailyCapacity,
        travel_cost: form.travelCost,
      });

      navigate("/Spi_Tractors-Tractor-Availability/", { state: { tractorId } });
    } catch (e) {
      alert(e?.message || "Unable to save capability");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cap-page">
      <div className="cap-container">
        <h1 className="cap-title">Add your tractor</h1>
        <p className="cap-subtitle">
          Sign up to access affordable mechanization services and optimize your farming.
        </p>

        {/* Stepper */}
        <div className="cap-stepper">
          <div className="cap-stepper-top">
            <div className="cap-step">
              <div className="cap-dot active" />
              <span className="cap-label">Tractor Details</span>
            </div>

            <div className="cap-line" />

            <div className="cap-step">
              <div className="cap-dot active" />
              <span className="cap-label active">Capability and Cost</span>
            </div>

            <div className="cap-line" />

            <div className="cap-step">
              <div className="cap-dot" />
              <span className="cap-label">Set Availability</span>
            </div>
          </div>

          <div className="cap-bar">
            <div className="cap-fill" />
          </div>
        </div>

        <h2 className="cap-section">Capability</h2>

        <div className="cap-form">
          <div className="cap-field">
            <label>Hourly Rate for Tasks</label>
            <select value={form.taskRate} onChange={onChange("taskRate")}>
              <option value="" disabled>
                e.g Ploughing ₦5,000/hour
              </option>
              <option value="Ploughing ₦5,000/hour">Ploughing ₦5,000/hour</option>
              <option value="Harrowing ₦4,000/hour">Harrowing ₦4,000/hour</option>
              <option value="Ridging ₦4,500/hour">Ridging ₦4,500/hour</option>
              <option value="Planting ₦3,500/hour">Planting ₦3,500/hour</option>
            </select>
          </div>

          <div className="cap-field">
            <label>Work Rate</label>
            <input
              value={form.workRate}
              onChange={onChange("workRate")}
              placeholder="e.g 2 acres/hour"
            />
          </div>

          <div className="cap-field">
            <label>Daily Work Capacity</label>
            <input
              value={form.dailyCapacity}
              onChange={onChange("dailyCapacity")}
              placeholder="e.g 10 acres"
            />
          </div>

          <div className="cap-field">
            <label>Travel Cost</label>
            <input
              value={form.travelCost}
              onChange={onChange("travelCost")}
              placeholder="e.g ₦2,000 per trip"
            />
          </div>
        </div>

        <button className="cap-btn" onClick={onSave} disabled={loading}>
          {loading ? "Saving..." : "Save & Continue"}
        </button>
      </div>
    </div>
  );
}
