import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./RequestSpitractor.css";

export default function RequestSpiTractor() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    farmAddress: "",
    farmSize: "",
    service: "",
    preferredDate: "",
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    // Later: call your API or navigate to search results page with form data
    console.log("Request Tractor:", form);
    alert("Searching tractors near you (demo)...");
  };

  return (
    <div className="rt-page">
      {/* Back */}
      <button className="rt-back" onClick={() => navigate(-1)} aria-label="Go back">
        ←
      </button>

      <div className="rt-shell">
        {/* LEFT CARD */}
        <div className="rt-card">
          <div className="rt-titleRow">
            <h1 className="rt-title">
              Request a tractor <span className="rt-info">ⓘ</span>
            </h1>
          </div>

          <form className="rt-form" onSubmit={onSubmit}>
            <label className="rt-label">Farm Address</label>
            <input
              className="rt-input"
              placeholder="e.g. 123 Farm Lane, Lagos Nigeria"
              name="farmAddress"
              value={form.farmAddress}
              onChange={onChange}
            />

            <label className="rt-label">Farm Size</label>
            <input
              className="rt-input"
              placeholder="e.g 2 acres"
              name="farmSize"
              value={form.farmSize}
              onChange={onChange}
            />

            <label className="rt-label">Services Needed</label>
            <div className="rt-selectWrap">
              <select
                className="rt-select"
                name="service"
                value={form.service}
                onChange={onChange}
              >
                <option value="">e.g Ploughing</option>
                <option value="Ploughing">Ploughing</option>
                <option value="Harrowing">Harrowing</option>
                <option value="Ridging">Ridging</option>
                <option value="Planting">Planting</option>
                <option value="Harvesting">Harvesting</option>
              </select>
              <span className="rt-caret">▾</span>
            </div>

            <label className="rt-label">Preferred date</label>
            <input
              className="rt-input"
              placeholder="e.g Between 25-01-25 to 30-01-25."
              name="preferredDate"
              value={form.preferredDate}
              onChange={onChange}
            />

            <button className="rt-btn" onClick={navigate("/SpiTractorsPayAndEta/")} type="submit">
              Search for tractor Near me
            </button>
          </form>
        </div>

        {/* RIGHT MAP */}
        <div className="rt-map">
          {/* Placeholder map UI (replace later with real map) */}
          <div className="rt-mapInner">
            <div className="rt-pin" title="Location pin" />
          </div>
        </div>
      </div>
    </div>
  );
}
