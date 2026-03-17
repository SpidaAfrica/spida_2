import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import "./RequestSpitractor.css";
import { spiTractorsApi } from "../api/spiTractorsApi";
import tractorMarkerImage from "../../../assets/images/Group (11).png";

const libraries = ["places"];

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const defaultCenter = {
  lat: 6.5244,
  lng: 3.3792,
};

const FARM_GPS_STORAGE_KEY = "spiFarmerGps";

function toNumber(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

export default function RequestSpiTractor() {
  const navigate = useNavigate();
  const location = useLocation();
  const mapRef = useRef(null);

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
  const [tractors, setTractors] = useState([]);
  const [selectedTractor, setSelectedTractor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [gettingGps, setGettingGps] = useState(false);
  const requestType =
  location.state?.requestType || "single";
  const [reqType, setReqType] = useState(requestType);
  const token = localStorage.getItem("spiTractorsToken") || "";
  const GOOGLE_KEY = "AIzaSyA4vJ953vqwIwSm5vhEHQyFDEXVC-S9_qg";

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const cleanFarmSize = (value) =>
    Number(String(value).replace(/[^\d.]/g, "")) || 1;

  const saveGpsToLocalStorage = useCallback((coords) => {
    try {
      localStorage.setItem(FARM_GPS_STORAGE_KEY, JSON.stringify(coords));
    } catch (error) {
      console.error("Unable to save farmer GPS to localStorage:", error);
    }
  }, []);

  const buildDraftPayload = useCallback(
    (srcForm) => ({
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
    }),
    [gps.lat, gps.lng]
  );

  const normalizeTractor = useCallback((tractor, index) => {
    const lat = toNumber(tractor?.lat ?? tractor?.latitude);
    const lng = toNumber(tractor?.lng ?? tractor?.longitude);

    return {
      id: tractor?.id ?? index,
      name: tractor?.name || tractor?.tractor_name || "Nearby Tractor",
      operator: tractor?.operator || tractor?.owner_name || "",
      distance:
        tractor?.distance ||
        tractor?.distance_km ||
        tractor?.distance_in_km ||
        "",
      etaMinutes: Number(tractor?.eta_minutes) || 0,
      registrationId: tractor?.registration_id || "",
      status: tractor?.status || "",
      baseRatePerHour: Number(tractor?.base_rate_per_hour) || 0,
      travelCost: Number(tractor?.travel_cost) || 0,
      lat,
      lng,
      raw: tractor,
    };
  }, []);

  const validTractors = useMemo(() => {
    return tractors
      .map(normalizeTractor)
      .filter(
        (tractor) =>
          Number.isFinite(tractor.lat) && Number.isFinite(tractor.lng)
      );
  }, [tractors, normalizeTractor]);

  const mapCenter = useMemo(() => {
    if (Number.isFinite(gps.lat) && Number.isFinite(gps.lng)) {
      return { lat: gps.lat, lng: gps.lng };
    }

    if (validTractors.length > 0) {
      return { lat: validTractors[0].lat, lng: validTractors[0].lng };
    }

    return defaultCenter;
  }, [gps, validTractors]);

  const userMarkerIcon = useMemo(() => {
    if (!window.google?.maps) {
      return { url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png" };
    }

    return {
      url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
      scaledSize: new window.google.maps.Size(40, 40),
    };
  }, []);

  const tractorMarkerIcon = useMemo(() => {
    if (!window.google?.maps) {
      return { url: tractorMarkerImage };
    }

    return {
      url: tractorMarkerImage,
      scaledSize: new window.google.maps.Size(42, 42),
      anchor: new window.google.maps.Point(21, 21),
    };
  }, []);

  const fitMapToMarkers = useCallback(() => {
    if (!mapRef.current || !window.google?.maps) return;

    const bounds = new window.google.maps.LatLngBounds();
    let hasPoint = false;

    if (Number.isFinite(gps.lat) && Number.isFinite(gps.lng)) {
      bounds.extend({ lat: gps.lat, lng: gps.lng });
      hasPoint = true;
    }

    validTractors.forEach((tractor) => {
      bounds.extend({ lat: tractor.lat, lng: tractor.lng });
      hasPoint = true;
    });

    if (hasPoint) {
      mapRef.current.fitBounds(bounds);

      if (
        Number.isFinite(gps.lat) &&
        Number.isFinite(gps.lng) &&
        validTractors.length === 0
      ) {
        mapRef.current.setZoom(14);
      }
    }
  }, [gps, validTractors]);

  useEffect(() => {
    fitMapToMarkers();
  }, [fitMapToMarkers]);

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const fetchNearbyTractorsForMap = useCallback(async (coords) => {
    try {
      const res = await spiTractorsApi.getNearbyTractors({
        lat: coords.lat,
        lng: coords.lng,
        radius: 50,
      });

      const list =
        res?.data?.tractors ||
        res?.tractors ||
        res?.data?.matches ||
        [];

      if (Array.isArray(list)) {
        setTractors(list);
      } else {
        setTractors([]);
      }
    } catch (error) {
      console.error("Unable to load nearby tractors for map:", error);
      setTractors([]);
    }
  }, []);

  useEffect(() => {
    try {
      const savedGps = JSON.parse(
        localStorage.getItem(FARM_GPS_STORAGE_KEY) || "null"
      );

      const lat = toNumber(savedGps?.lat);
      const lng = toNumber(savedGps?.lng);

      if (lat !== null && lng !== null) {
        const coords = { lat, lng };
        setGps(coords);
        fetchNearbyTractorsForMap(coords);
      }
    } catch (error) {
      console.error("Unable to read farmer GPS from localStorage:", error);
    }
  }, [fetchNearbyTractorsForMap]);

  const getGps = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported on this device/browser.");
      return;
    }

    setGettingGps(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };

        setGps(coords);
        saveGpsToLocalStorage(coords);
        setGettingGps(false);

        await fetchNearbyTractorsForMap(coords);
      },
      () => {
        alert("Location permission denied or unavailable.");
        setGettingGps(false);
      },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  };

  const buildJobFromMatch = useCallback((draft, createRes, firstTractor, requestId) => {
    const tractorLat = toNumber(firstTractor?.lat ?? firstTractor?.latitude);
    const tractorLng = toNumber(firstTractor?.lng ?? firstTractor?.longitude);

    return {
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
      tractorName:
        firstTractor?.name || firstTractor?.tractor_name || "Searching...",
      tractorRegId: firstTractor?.registration_id || "",

      tractorLat,
      tractorLng,

      distanceKm:
        Number(
          firstTractor?.distance_km ??
            firstTractor?.distance ??
            firstTractor?.distance_in_km
        ) || 0,
      etaMinutes: Number(firstTractor?.eta_minutes) || 0,

      ratePerHour: Number(firstTractor?.base_rate_per_hour) || 5000,
      estimatedHours: 6,
      travelFee: Number(firstTractor?.travel_cost) || 0,
    };
  }, []);

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

    localStorage.removeItem("spiRequestDraft");
    window.history.replaceState({}, document.title);

    const submitDraft = async () => {
      try {
        setLoading(true);

        const createRes = await spiTractorsApi.createRequest(draft);
        const requestId = createRes?.data?.id;

        if (!requestId) {
          throw new Error("Request created but request id missing.");
        }

        const matchRes = await spiTractorsApi.searchRequestMatches(requestId, 30);
        const matches = matchRes?.data?.matches || [];

        setTractors(matches);
        
        navigate("/SpiTractorsPayAndEta/", {
          state: {
            job: {
              requestId,
              requestCode: createRes?.data?.request_code,
              draft,
              matches,
              waiting: true,
            },
          },
        });
      } catch (error) {
        alert(error?.message || "Unable to create request after login");
      } finally {
        setLoading(false);
      }
    };

    submitDraft();
  }, [location.state, navigate, buildJobFromMatch]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!form.fullName.trim()) return alert("Full Name is required.");
    if (!form.farmName.trim()) return alert("Farm Name is required.");
    if (!form.farmAddress.trim()) return alert("Farm Address is required.");
    if (!form.farmCity.trim()) {
      return alert("Farm City is required (fallback when GPS isn't available).");
    }
    if (!String(form.farmSize).trim()) return alert("Farm Size is required.");
    if (!form.service.trim()) return alert("Service is required.");

    if (!Number.isFinite(gps.lat) || !Number.isFinite(gps.lng)) {
      return alert("Please click 'Use my location' before searching for nearby tractors.");
    }

    if (!token) {
      if (!form.phone.trim()) return alert("Phone Number is required.");

      const requestDraft = buildDraftPayload(form);
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

    try {
      setLoading(true);

      const draft = buildDraftPayload(form);
      const createRes = await spiTractorsApi.createRequest(draft);
      const requestId = createRes?.data?.id;

      if (!requestId) {
        throw new Error("Request created but request id missing.");
      }

      const matchRes = await spiTractorsApi.searchRequestMatches(requestId, 30);
      const matches = matchRes?.data?.matches || [];

      setTractors(matches);
      
      navigate("/SpiTractorsPayAndEta/", {
        state: {
          job: {
            requestId,
            requestCode: createRes?.data?.request_code,
            draft,
            matches,
            waiting: true,
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
    Number.isFinite(gps.lat) && Number.isFinite(gps.lng)
      ? `GPS: ${gps.lat.toFixed(5)}, ${gps.lng.toFixed(5)}`
      : "No GPS captured";

  return (
    <div className="rt-page">
      <button
        className="rt-back"
        onClick={() => navigate(-1)}
        aria-label="Go back"
      >
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

            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
                margin: "10px 0",
              }}
            >
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
              min={new Date().toISOString().split("T")[0]} // today in YYYY-MM-DD format
            />

            <button className="rt-btn" type="submit" disabled={loading}>
              {loading ? "Searching..." : "Search for tractor Near me"}
            </button>
          </form>
        </div>

        <div className="rt-map">
          <LoadScript googleMapsApiKey={GOOGLE_KEY} libraries={libraries}>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={mapCenter}
              zoom={12}
              onLoad={onMapLoad}
              options={{
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: true,
              }}
            >
              {Number.isFinite(gps.lat) && Number.isFinite(gps.lng) && (
                <Marker
                  position={{ lat: gps.lat, lng: gps.lng }}
                  icon={userMarkerIcon}
                  title="Your location"
                />
              )}

              {validTractors.map((tractor) => (
                <Marker
                  key={tractor.id}
                  position={{ lat: tractor.lat, lng: tractor.lng }}
                  title={tractor.name}
                  icon={tractorMarkerIcon}
                  onClick={() => setSelectedTractor(tractor)}
                />
              ))}

              {selectedTractor && (
                <InfoWindow
                  position={{
                    lat: selectedTractor.lat,
                    lng: selectedTractor.lng,
                  }}
                  onCloseClick={() => setSelectedTractor(null)}
                >
                  <div style={{ minWidth: "180px" }}>
                    <h4 style={{ margin: "0 0 8px" }}>{selectedTractor.name}</h4>

                    {selectedTractor.operator && (
                      <p style={{ margin: "0 0 6px" }}>
                        <strong>Operator:</strong> {selectedTractor.operator}
                      </p>
                    )}

                    {selectedTractor.distance && (
                      <p style={{ margin: "0 0 6px" }}>
                        <strong>Distance:</strong> {selectedTractor.distance}
                      </p>
                    )}

                    {selectedTractor.status && (
                      <p style={{ margin: "0 0 6px" }}>
                        <strong>Status:</strong> {selectedTractor.status}
                      </p>
                    )}
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </LoadScript>
        </div>
      </div>
    </div>
  );
}
