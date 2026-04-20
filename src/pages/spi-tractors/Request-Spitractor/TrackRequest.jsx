import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  useJsApiLoader,
} from "@react-google-maps/api";
import "./TrackRequest.css";
import { spiTractorsApi } from "../api/spiTractorsApi";
import tractorMarkerImage from "../../../assets/images/Group (11).png";

// FIX: moved from hardcoded string to environment variable
const GOOGLE_KEY = process.env.REACT_APP_GOOGLE_MAPS_KEY || "";

const TRACK_REQUEST_KEY    = "spiTrackRequestId";
const FARM_GPS_STORAGE_KEY = "spiFarmerGps";

const mapContainerStyle = { width: "100%", height: "260px" };
const defaultMapCenter  = { lat: 6.5244, lng: 3.3792 };

const STEP_MAP = {
  SENT:         0,
  RECEIVED:     1,
  ACCEPTED:     2,
  EN_ROUTE:     3,
  ARRIVED:      4,
  WORK_STARTED: 5,
  IN_PROGRESS:  6,
  COMPLETED:    7,
};

const STEPS = [
  { key: "sent",      title: "Request Sent",       desc: "Your request has been created." },
  { key: "received",  title: "Request Received",   desc: "Spida is processing your request." },
  { key: "accepted",  title: "Accepted",           desc: "A tractor owner accepted your request." },
  { key: "enroute",   title: "En Route",           desc: "Tractor is heading to your farm." },
  { key: "arrived",   title: "Arrived",            desc: "Tractor arrived at your farm." },
  { key: "started",   title: "Work Started",       desc: "Work has started on your farm." },
  { key: "progress",  title: "Work in Progress",   desc: "Work is currently ongoing." },
  { key: "completed", title: "Completed",          desc: "Job finished successfully! 🎉" },
];

export default function TrackRequest() {
  const navigate        = useNavigate();
  const { state }       = useLocation();

  const [requestId,      setRequestId]      = useState(state?.requestId || null);
  const [tractorData,    setTractorData]    = useState(null);
  const [tractorLocation,setTractorLocation]= useState(null);
  const [farmerLocation, setFarmerLocation] = useState(null);
  const [currentStep,    setCurrentStep]    = useState(0);
  const [directions,     setDirections]     = useState(null);

  // FIX: use only useJsApiLoader (removed redundant LoadScript wrapper)
  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: GOOGLE_KEY });

  /* Load requestId from localStorage if not in route state */
  useEffect(() => {
    if (requestId) return;
    try {
      const stored = JSON.parse(localStorage.getItem(TRACK_REQUEST_KEY) || "null");
      if (stored?.requestId) setRequestId(stored.requestId);
    } catch {}
  }, [requestId]);

  /* Load farmer GPS */
  useEffect(() => {
    try {
      const gps = JSON.parse(localStorage.getItem(FARM_GPS_STORAGE_KEY) || "null");
      if (gps?.lat && gps?.lng) {
        setFarmerLocation({ lat: Number(gps.lat), lng: Number(gps.lng) });
      }
    } catch {}
  }, []);

  /* Poll request tracking timeline */
  useEffect(() => {
    if (!requestId) return;

    const fetchTracking = async () => {
      try {
        const res      = await spiTractorsApi.requestTracking(requestId);
        const timeline = res?.data || [];
        if (!timeline.length) return;

        const latest = timeline[timeline.length - 1];
        const idx    = STEP_MAP[latest?.to_status] ?? 0;
        setCurrentStep(idx);
      } catch {}
    };

    fetchTracking();
    const interval = setInterval(fetchTracking, 8000);
    return () => clearInterval(interval);
  }, [requestId]);

  /* Poll tractor match status + location */
  useEffect(() => {
    if (!requestId) return;

    const checkStatus = async () => {
      try {
        const res  = await spiTractorsApi.getRequestStatus(requestId);
        const data = res?.data;
        if (!data) return;

        if (data.matched === true || data.status === "matched") {
          const t = data.matched_tractor;
          if (t) {
            setTractorData(t);
            const lat = Number(t.lat);
            const lng = Number(t.lng);
            if (Number.isFinite(lat) && Number.isFinite(lng)) {
              setTractorLocation({ lat, lng });
            }
          }
        }
      } catch {}
    };

    checkStatus();
    const i = setInterval(checkStatus, 4000);
    return () => clearInterval(i);
  }, [requestId]);

  // FIX: removed console.log debug block that was left in production code

  /* Get live tractor location */
  useEffect(() => {
    if (!tractorData?.id) return;

    const loadLoc = async () => {
      try {
        const res = await spiTractorsApi.getTractorLocation(tractorData.id);
        const lat = Number(res?.data?.lat);
        const lng = Number(res?.data?.lng);
        if (Number.isFinite(lat) && Number.isFinite(lng)) {
          setTractorLocation({ lat, lng });
        }
      } catch {}
    };

    loadLoc();
    const i = setInterval(loadLoc, 5000);
    return () => clearInterval(i);
  }, [tractorData]);

  /* Directions — guard against Maps API not fully ready yet */
  useEffect(() => {
    if (!isLoaded || !tractorLocation || !farmerLocation) return;
    // Extra safety: isLoaded can be true before all constructors are ready
    if (!window.google?.maps?.DirectionsService) return;

    try {
      const service = new window.google.maps.DirectionsService();
      service.route(
        {
          origin:      tractorLocation,
          destination: farmerLocation,
          travelMode:  window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === "OK" && result) setDirections(result);
        }
      );
    } catch (e) {
      console.warn("Directions failed:", e.message);
    }
  }, [isLoaded, tractorLocation, farmerLocation]);

  const mapCenter = useMemo(() => {
    if (tractorLocation) return tractorLocation;
    if (farmerLocation)  return farmerLocation;
    return defaultMapCenter;
  }, [tractorLocation, farmerLocation]);

  const progressPct = Math.round(((currentStep + 1) / STEPS.length) * 100);

  const handleCallDriver = () => {
    if (!tractorData?.owner_phone) {
      alert("Driver phone number not available.");
      return;
    }
    window.location.href = `tel:${tractorData.owner_phone}`;
  };

  const handleSupport = () => {
    window.location.href = "tel:+2348123888508";
  };

  const handleCancel = async () => {
    if (!requestId) return;
    if (!window.confirm("Are you sure you want to cancel this request?")) return;

    try {
      // FIX: was calling spiTractorsApi.cancelRequest(requestId) which didn't exist.
      // cancelRequest is now defined in spiTractorsApi.js.
      await spiTractorsApi.cancelRequest(requestId);
      localStorage.removeItem(TRACK_REQUEST_KEY);
      alert("Request cancelled successfully.");
      navigate("/");
    } catch (e) {
      alert(e?.message || "Failed to cancel request. Please try again.");
    }
  };

  return (
    <div className="trk-page">
      <button className="trk-back" onClick={() => navigate(-1)}>←</button>

      <div className="trk-shell">
        <header className="trk-head">
          <div className="trk-chip">{requestId}</div>
          <h1 className="trk-title">Track Your Request</h1>
          {tractorData?.name && (
            <p className="trk-subtitle">Tractor: {tractorData.name}</p>
          )}
        </header>

        <div className="trk-grid">
          {/* Left: progress timeline */}
          <div className="trk-card">
            <div className="trk-progressTop">
              <div>Overall progress</div>
              <div><b>{progressPct}%</b></div>
            </div>

            <div className="trk-bar">
              <div className="trk-barFill" style={{ width: `${progressPct}%` }} />
            </div>

            <div className="trk-timeline">
              {STEPS.map((s, idx) => {
                const done   = idx < currentStep;
                const active = idx === currentStep;
                return (
                  <div
                    key={s.key}
                    className={`trk-step${done ? " done" : ""}${active ? " active" : ""}`}
                  >
                    <div className="trk-dot">
                      {done ? "✓" : active ? "●" : "○"}
                    </div>
                    <div>
                      <div className="trk-stepTitle">{s.title}</div>
                      <div className="trk-stepDesc">{s.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: map + actions */}
          <div className="trk-card trk-right">
            <h3>Live Location</h3>

            <div style={{ width: "100%", height: 260, borderRadius: 12, overflow: "hidden" }}>
              {!GOOGLE_KEY ? (
                <div className="trk-map-fallback">
                  Map unavailable — set REACT_APP_GOOGLE_MAPS_KEY in your .env
                </div>
              ) : isLoaded ? (
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={mapCenter}
                  zoom={13}
                >
                  {farmerLocation && <Marker position={farmerLocation} />}
                  {tractorLocation && (
                    <Marker
                      position={tractorLocation}
                      icon={{
                        url: tractorMarkerImage,
                        scaledSize: new window.google.maps.Size(40, 40),
                      }}
                    />
                  )}
                  {directions && <DirectionsRenderer directions={directions} />}
                </GoogleMap>
              ) : (
                <div className="trk-map-fallback">Loading map…</div>
              )}
            </div>

            <div className="trk-row" style={{ marginTop: 14 }}>
              <button className="trk-btn"        onClick={handleCallDriver}>📞 Call Tractor Owner</button>
              <button className="trk-btnOutline" onClick={handleSupport}>💬 Support</button>
            </div>

            {currentStep < STEP_MAP.WORK_STARTED && (
              <button className="trk-cancel" onClick={handleCancel}>
                Cancel Request
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
