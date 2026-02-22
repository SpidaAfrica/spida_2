import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./RequestSpitractor.css";
import { spiTractorsApi } from "../api/spiTractorsApi";

export default function RequestSpiTractor() {
  const navigate = useNavigate();

const [form, setForm] = useState({
  fullName: "",
  farmName: "",
  farmAddress: "",
  farmCity: "",
  farmSize: "",
  service: "",
  preferredDate: "",
});

  const [gps, setGps] = useState({ lat: null, lng: null });
  const [loading, setLoading] = useState(false);
  const [gettingGps, setGettingGps] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const getGps = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported on this device/browser.");
      return;
    }

    setGettingGps(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGps({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        alert("Location captured ✅");
        setGettingGps(false);
      },
      () => {
        alert("Location permission denied or unavailable.");
        setGettingGps(false);
      },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    const token = localStorage.getItem("spiTractorsToken") || "";

    // 🟡 Not logged in → go to phone capture
    if (!token) {
      navigate("/Spi_Tractors-Guest-Login/", {
        state: {
          requestDraft: form, // so they don't refill later
        },
      });
      return;
    }
    if (!form.farmAddress.trim()) {
      alert("Farm Address is required.");
      return;
    }

    // City is strongly recommended (fallback when GPS not available)
    if (!form.farmCity.trim()) {
      alert("Farm City is required (used for matching if GPS is not available).");
      return;
    }

    const farmSize = Number(String(form.farmSize).replace(/[^\d.]/g, "")) || 1;

    try {
      setLoading(true);

      // 1) Create request (now includes city + gps)
      const createRes = await spiTractorsApi.createRequest({
        full_name: form.fullName,
        farm_name: form.farmName,
        service: (form.service || "PLOUGHING").toUpperCase(),
        farm_address: form.farmAddress,
        farm_city: form.farmCity,
        farm_size_acres: Number(form.farmSize) || 1,
        preferred_date: form.preferredDate || null,
        farm_lat: gps.lat,
        farm_lng: gps.lng,
        notes: "Created from SpiTractors frontend",
      });

      const requestId = createRes?.data?.id;
      if (!requestId) {
        throw new Error("Request created but request id missing.");
      }

      // 2) Search matches near-me (30km default)
      const matchRes = await spiTractorsApi.searchRequestMatches(requestId, 30);
      const matches = matchRes?.data?.matches || [];
      const firstTractor = matches[0] || {};

      if (!firstTractor?.id) {
        alert("No tractors found near you yet. Try increasing radius or try again later.");
        return;
      }

      // Use backend-calculated values if present
      const distanceKm = Number(firstTractor?.distance_km) || 0;
      const etaMinutes = Number(firstTractor?.eta_minutes) || 0;

      navigate("/SpiTractorsPayAndEta/", {
        state: {
          job: {full_name: form.fullName,
            farm_name: form.farmName,
            requestId: createRes?.data?.request_code || "REQ-0000",
            requestUuid: requestId,
            service: form.service || "Ploughing",
            farmAddress: form.farmAddress,
            farmCity: form.farmCity,
            farmSize: farmSize,
            preferredDate: form.preferredDate,

            tractorId: firstTractor?.id,
            tractorName: firstTractor?.name,
            tractorRegId: firstTractor?.registration_id,

            distanceKm,
            etaMinutes,

            ratePerHour: Number(firstTractor?.base_rate_per_hour) || 5000,
            estimatedHours: 6,
            travelFee: Number(firstTractor?.travel_cost) || 2000,
          },
        },
      });
    } catch (error) {
      alert(error?.message || "Unable to create request");
    } finally {
      setLoading(false);
    }
  };

  const gpsLabel =
    gps.lat && gps.lng ? `GPS: ${gps.lat.toFixed(5)}, ${gps.lng.toFixed(5)}` : "No GPS captured";

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

          <form className="rt-form" onSubmit={onSubmit}><label className="rt-label">Full Name</label>
            <input
              className="rt-input"
              placeholder="e.g. Adisa Jairo Yusuf"
              name="fullName"
              value={form.fullName}
              onChange={onChange}
            />
            
            <label className="rt-label">Farm Name</label>
            <input
              className="rt-input"
              placeholder="e.g. Jairo Farms Ltd"
              name="farmName"
              value={form.farmName}
              onChange={onChange}
            />
            <label className="rt-label">Farm Address</label>
            <input
              className="rt-input"
              placeholder="e.g. 123 Farm Lane, Lagos Nigeria"
              name="farmAddress"
              value={form.farmAddress}
              onChange={onChange}
            />

            <label className="rt-label">Farm City</label>
            <input
              className="rt-input"
              placeholder="e.g. Lagos"
              name="farmCity"
              value={form.farmCity}
              onChange={onChange}
            />

            {/* GPS capture */}
            <div style={{ display: "flex", gap: 10, alignItems: "center", margin: "10px 0" }}>
              <button
                type="button"
                onClick={getGps}
                disabled={gettingGps}
                className="rt-btn"
                style={{ width: "auto", padding: "10px 14px" }}
              >
                {gettingGps ? "Getting location..." : "Use my location"}
              </button>
              <small style={{ opacity: 0.85 }}>{gpsLabel}</small>
            </div>

            <label className="rt-label">Farm Size (acres)</label>
            <input
              className="rt-input"
              placeholder="e.g 2"
              name="farmSize"
              value={form.farmSize}
              onChange={onChange}
              inputMode="decimal"
            />

            <label className="rt-label">Services Needed</label>
            <div className="rt-selectWrap">
              <select className="rt-select" name="service" value={form.service} onChange={onChange}>
                <option value="">e.g Ploughing</option>
                <option value="Ploughing">Ploughing</option>
                <option value="Harrowing">Harrowing</option>
                <option value="Ridging">Ridging</option>
                <option value="Planting">Planting</option>
                <option value="Spraying">Spraying</option>
                <option value="Harvesting">Harvesting</option>
              </select>
              <span className="rt-caret">▾</span>
            </div>

            <label className="rt-label">Preferred date</label>
            <input
              className="rt-input"
              type="date"
              name="preferredDate"
              value={form.preferredDate}
              onChange={onChange}
            />

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
