import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./RequestSpitractor.css";
import { spiTractorsApi } from "../api/spiTractorsApi";

export default function RequestSpiTractor() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    farmAddress: "",
    farmSize: "",
    service: "",
    preferredDate: "",
  });
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const createRes = await spiTractorsApi.createRequest({
        service: (form.service || "PLOUGHING").toUpperCase(),
        farm_address: form.farmAddress,
        farm_size_acres: Number(form.farmSize) || 1,
        preferred_date: form.preferredDate || null,
        notes: "Created from SpiTractors frontend",
      });

      const requestId = createRes?.data?.id;
      let matches = [];

      if (requestId) {
        const matchRes = await spiTractorsApi.searchRequestMatches(requestId);
        matches = matchRes?.data?.matches || [];
      }

      const firstTractor = matches[0] || {};

      navigate("/SpiTractorsPayAndEta/", {
        state: {
          job: {
            requestId: createRes?.data?.request_code || "REQ-0000",
            requestUuid: requestId,
            service: form.service || "Ploughing",
            farmAddress: form.farmAddress,
            farmSize: form.farmSize,
            preferredDate: form.preferredDate,
            tractorName: firstTractor?.name || "Greenfield 6060X",
            tractorRegId: firstTractor?.registration_id || "ABC-456ZT",
            distanceKm: 6.4,
            etaMinutes: 18,
            ratePerHour: Number(firstTractor?.base_rate_per_hour) || 5000,
            estimatedHours: 6,
            travelFee: 2000,
          },
        },
      });
    } catch (error) {
      alert(error.message || "Unable to create request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rt-page">
      <button className="rt-back" onClick={() => navigate(-1)} aria-label="Go back">
        ←
      </button>

      <div className="rt-shell">
        <div className="rt-card">
          <div className="rt-titleRow">
            <h1 className="rt-title">
              Request a tractor <span className="rt-info">ⓘ</span>
            </h1>
          </div>

          <form className="rt-form" onSubmit={onSubmit}>
            <label className="rt-label">Farm Address</label>
            <input className="rt-input" placeholder="e.g. 123 Farm Lane, Lagos Nigeria" name="farmAddress" value={form.farmAddress} onChange={onChange} />

            <label className="rt-label">Farm Size</label>
            <input className="rt-input" placeholder="e.g 2 acres" name="farmSize" value={form.farmSize} onChange={onChange} />

            <label className="rt-label">Services Needed</label>
            <div className="rt-selectWrap">
              <select className="rt-select" name="service" value={form.service} onChange={onChange}>
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
            <input className="rt-input" placeholder="e.g Between 25-01-25 to 30-01-25." name="preferredDate" value={form.preferredDate} onChange={onChange} />

            <button className="rt-btn" type="submit" disabled={loading}>
              {loading ? "Searching..." : "Search for tractor Near me"}
            </button>
          </form>
        </div>

        <div className="rt-map">
          <div className="rt-mapInner">
            <div className="rt-pin" title="Location pin" />
          </div>
        </div>
      </div>
    </div>
  );
}
