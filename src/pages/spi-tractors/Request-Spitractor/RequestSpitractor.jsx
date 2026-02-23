import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./RequestSpitractor.css";
import { spiTractorsApi } from "../api/spiTractorsApi";

export default function RequestSpiTractor() {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
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

  const token = localStorage.getItem("spiTractorsToken") || "";

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
        setGps({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGettingGps(false);
      },
      () => {
        alert("Location permission denied or unavailable.");
        setGettingGps(false);
      },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  };

  const cleanFarmSize = (v) => Number(String(v).replace(/[^\d.]/g, "")) || 1;

  const buildDraftPayload = (srcForm) => ({
    full_name: (srcForm.fullName || "").trim(),
    farm_name: (srcForm.farmName || "").trim(),
    service: (srcForm.service || "PLOUGHING").toUpperCase(),
    farm_address: (srcForm.farmAddress || "").trim(),
    farm_city: (srcForm.farmCity || "").trim(),
    farm_size_acres: cleanFarmSize(srcForm.farmSize),
    preferred_date: srcForm.preferredDate || null,
    farm_lat: gps.lat,
    farm_lng: gps.lng,
    notes: "Created from SpiTractors frontend",
  });

  // ✅ AUTO SUBMIT after OTP returns here with requestDraft
  useEffect(() => {
    const draftFromState = location.state?.requestDraft || null;

    let draft = draftFromState;
    if (!draft) {
      try {
        draft = JSON.parse(localStorage.getItem("spiRequestDraft") || "null");
      } catch {
        draft = null;
      }
    }

    if (!draft) return;

    // consume so it doesn't loop
    localStorage.removeItem("spiRequestDraft");
    window.history.replaceState({}, document.title);

    const submitDraft = async () => {
      try {
        setLoading(true);

        const createRes = await spiTractorsApi.createRequest(draft);
        const requestId = createRes?.data?.id;

        if (!requestId) throw new Error("Request created but request id missing.");

        const matchRes = await spiTractorsApi.searchRequestMatches(requestId, 30);
        const matches = matchRes?.data?.matches || [];
        const firstTractor = matches[0] || {};

        navigate("/SpiTractorsPayAndEta/", {
          state: {
            job: {
              full_name: draft.full_name,
              farm_name: draft.farm_name,
              requestId: createRes?.data?.request_code || "REQ-0000",
              requestUuid: requestId,
              service: draft.service,
              farmAddress: draft.farm_address,
              farmCity: draft.farm_city,
              farmSize: draft.farm_size_acres,
              preferredDate: draft.preferred_date,

              tractorId: firstTractor?.id || null,
              tractorName: firstTractor?.name || "Searching...",
              tractorRegId: firstTractor?.registration_id || "",

              distanceKm: Number(firstTractor?.distance_km) || 0,
              etaMinutes: Number(firstTractor?.eta_minutes) || 0,

              ratePerHour: Number(firstTractor?.base_rate_per_hour) || 5000,
              estimatedHours: 6,
              travelFee: Number(firstTractor?.travel_cost) || 0,
            },
          },
        });
      } catch (e) {
        alert(e?.message || "Unable to create request after login");
      } finally {
        setLoading(false);
      }
    };

    submitDraft();
  }, [location.state, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    // validations
    if (!form.fullName.trim()) return alert("Full Name is required.");
    if (!form.farmName.trim()) return alert("Farm Name is required.");
    if (!form.farmAddress.trim()) return alert("Farm Address is required.");
    if (!form.farmCity.trim())
      return alert("Farm City is required (fallback when GPS isn't available).");
    if (!String(form.farmSize).trim()) return alert("Farm Size is required.");
    if (!form.service.trim()) return alert("Service is required.");

    // ✅ guest flow: send to OTP page and return here for auto-submit
    if (!token) {
      if (!form.phone.trim()) return alert("Phone Number is required.");

      const requestDraft = buildDraftPayload(form);

      // ✅ backup so we don't lose it if router state drops
      localStorage.setItem("spiRequestDraft", JSON.stringify(requestDraft));

      navigate("/Spi_Tractors-Otp/", {
        state: {
          phone: form.phone.trim(),
          full_name: form.fullName.trim(),
          next: "/Spi_Tractors_Request/",
          requestDraft,
        },
      });
      return;
    }

    // ✅ logged-in flow: submit directly
    try {
      setLoading(true);

      const draft = buildDraftPayload(form);

      const createRes = await spiTractorsApi.createRequest(draft);
      const requestId = createRes?.data?.id;

      if (!requestId) throw new Error("Request created but request id missing.");

      const matchRes = await spiTractorsApi.searchRequestMatches(requestId, 30);
      const matches = matchRes?.data?.matches || [];
      const firstTractor = matches[0] || {};

      navigate("/SpiTractorsPayAndEta/", {
        state: {
          job: {
            full_name: draft.full_name,
            farm_name: draft.farm_name,
            requestId: createRes?.data?.request_code || "REQ-0000",
            requestUuid: requestId,
            service: draft.service,
            farmAddress: draft.farm_address,
            farmCity: draft.farm_city,
            farmSize: draft.farm_size_acres,
            preferredDate: draft.preferred_date,

            tractorId: firstTractor?.id || null,
            tractorName: firstTractor?.name || "Searching...",
            tractorRegId: firstTractor?.registration_id || "",

            distanceKm: Number(firstTractor?.distance_km) || 0,
            etaMinutes: Number(firstTractor?.eta_minutes) || 0,

            ratePerHour: Number(firstTractor?.base_rate_per_hour) || 5000,
            estimatedHours: 6,
            travelFee: Number(firstTractor?.travel_cost) || 0,
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
    gps.lat && gps.lng
      ? `GPS: ${gps.lat.toFixed(5)}, ${gps.lng.toFixed(5)}`
      : "No GPS captured";

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
            <label className="rt-label">Full Name</label>
            <input
              className="rt-input"
              name="fullName"
              value={form.fullName}
              onChange={onChange}
              placeholder="e.g. Adisa Jairo Yusuf"
            />

            <label className="rt-label">Phone Number</label>
            <input
              className="rt-input"
              name="phone"
              value={form.phone}
              onChange={onChange}
              placeholder="e.g. 08012345678"
              inputMode="tel"
            />

            <label className="rt-label">Farm Name</label>
            <input
              className="rt-input"
              name="farmName"
              value={form.farmName}
              onChange={onChange}
              placeholder="e.g. Jairo Farms Ltd"
            />

            <label className="rt-label">Farm Address</label>
            <input
              className="rt-input"
              name="farmAddress"
              value={form.farmAddress}
              onChange={onChange}
              placeholder="e.g. 123 Farm Lane, Lagos Nigeria"
            />

            <label className="rt-label">Farm City</label>
            <input
              className="rt-input"
              name="farmCity"
              value={form.farmCity}
              onChange={onChange}
              placeholder="e.g. Lagos"
            />

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
              name="farmSize"
              value={form.farmSize}
              onChange={onChange}
              placeholder="e.g 2"
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
