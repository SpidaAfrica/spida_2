import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LoadScript, GoogleMap, Marker, Polyline } from "@react-google-maps/api";
import "./TrackRequest.css";
import { spiTractorsApi } from "../api/spiTractorsApi";
import tractorMarkerImage from "../../../assets/images/Group (11).png";

// ------------------- CONFIG -------------------
const GOOGLE_KEY = "AIzaSyA4vJ953vqwIwSm5vhEHQyFDEXVC-S9_qg";
const FARM_GPS_STORAGE_KEY = "spiFarmerGps";
const TRACK_REQUEST_KEY = "spiTrackRequestId"; // saved from PayAndEta

const STEP_MAP = {
  SENT: 0,
  RECEIVED: 1,
  ACCEPTED: 2,
  EN_ROUTE: 3,
  ARRIVED: 4,
  WORK_STARTED: 5,
  IN_PROGRESS: 6,
  COMPLETED: 7,
};

const STEPS = [
  { key: "sent", title: "Request Sent", desc: "Your request has been created." },
  { key: "received", title: "Request Received", desc: "Spida is processing your request." },
  { key: "accepted", title: "Accepted", desc: "A tractor owner has accepted your request." },
  { key: "enroute", title: "En Route", desc: "Tractor is heading to your farm location." },
  { key: "arrived", title: "Arrived", desc: "Tractor has arrived at the farm." },
  { key: "started", title: "Work Started", desc: "Work has started on your farm." },
  { key: "progress", title: "Work in Progress", desc: "Job is currently ongoing." },
  { key: "completed", title: "Work Completed", desc: "The job has been completed successfully." },
];

const DEFAULT_META = {
  requestId: "",
  requestUuid: "",
  tractorId: "",
  tractorName: "",
  tractorRegId: "",
  tractorLat: null,
  tractorLng: null,
  service: "",
  farmAddress: "",
  etaMinutes: 0,
};

const mapContainerStyle = { width: "100%", height: "260px" };
const defaultCenter = { lat: 6.5244, lng: 3.3792 };

// ------------------- UTIL -------------------
function clampStep(step) {
  if (!Number.isFinite(step)) return 0;
  return Math.max(0, Math.min(STEPS.length - 1, step));
}

function normalizeTrackingStatus(value) {
  return String(value || "").trim().toUpperCase().replace(/\s+/g, "_");
}

function getTimelineArray(response) {
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.timeline)) return response.data.timeline;
  if (Array.isArray(response?.timeline)) return response.timeline;
  return [];
}

function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function isValidLatLng(coords) {
  return !!coords && Number.isFinite(coords.lat) && Number.isFinite(coords.lng);
}

function calculateDistanceKm(origin, destination) {
  if (!isValidLatLng(origin) || !isValidLatLng(destination)) return 0;
  const toRad = (d) => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(destination.lat - origin.lat);
  const dLng = toRad(destination.lng - origin.lng);
  const lat1 = toRad(origin.lat);
  const lat2 = toRad(destination.lat);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ------------------- COMPONENT -------------------
export default function TrackRequest() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const mapRef = useRef(null);

  // ------------------- META -------------------
  const meta = useMemo(() => {
    // priority: state > localStorage > default
    let savedRequest = null;
    try {
      const stored = localStorage.getItem(TRACK_REQUEST_KEY);
      if (stored) savedRequest = JSON.parse(stored);
    } catch {}
    return { ...DEFAULT_META, ...savedRequest, ...(state || {}) };
  }, [state]);

  // ------------------- STATE -------------------
  const [currentStep, setCurrentStep] = useState(0);
  const [farmerLocation, setFarmerLocation] = useState(null);
  const [tractorLocation, setTractorLocation] = useState(() => {
    const lat = toNumber(meta.tractorLat);
    const lng = toNumber(meta.tractorLng);
    return lat !== null && lng !== null ? { lat, lng } : null;
  });
  const [liveEtaMinutes, setLiveEtaMinutes] = useState(Number(meta.etaMinutes) || 0);

  const safeCurrentStep = clampStep(currentStep);
  const activeStep = STEPS[safeCurrentStep];
  const progressPct = Math.round(((safeCurrentStep + 1) / STEPS.length) * 100);

  // ------------------- MAP -------------------
  const mapCenter = useMemo(() => {
    if (isValidLatLng(farmerLocation)) return farmerLocation;
    if (isValidLatLng(tractorLocation)) return tractorLocation;
    return defaultCenter;
  }, [farmerLocation, tractorLocation]);

  const linePath = useMemo(() => {
    if (!isValidLatLng(farmerLocation) || !isValidLatLng(tractorLocation)) return [];
    return [tractorLocation, farmerLocation];
  }, [farmerLocation, tractorLocation]);

  const farmerIcon = useMemo(() => ({
    url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
    scaledSize: window.google?.maps ? new window.google.maps.Size(42, 42) : undefined,
  }), []);

  const tractorMarkerIcon = useMemo(() => ({
    url: tractorMarkerImage,
    scaledSize: window.google?.maps ? new window.google.maps.Size(42, 42) : undefined,
    anchor: window.google?.maps ? new window.google.maps.Point(21, 21) : undefined,
  }), []);

  // ------------------- EFFECTS -------------------

  // Farmer GPS
  useEffect(() => {
    try {
      const savedGps = JSON.parse(localStorage.getItem(FARM_GPS_STORAGE_KEY) || "null");
      const lat = toNumber(savedGps?.lat);
      const lng = toNumber(savedGps?.lng);
      setFarmerLocation(lat !== null && lng !== null ? { lat, lng } : null);
    } catch {
      setFarmerLocation(null);
    }
  }, []);

  // ------------------- REQUEST STATUS -------------------
  useEffect(() => {
    if (!meta.requestId) return;

    const fetchRequestStatus = async () => {
      try {
        const res = await spiTractorsApi.getRequestStatus(meta.requestId);
        const data = res?.data;
        if (!data) return;

        if (data.matched === true || data.status === "matched") {
          const t = data.matched_tractor;
          if (t) {
            setTractorLocation({ lat: Number(t.lat), lng: Number(t.lng) });
            meta.tractorId = t.id;
            meta.tractorName = t.name;
            meta.tractorRegId = t.registration_id;
          }
        }
      } catch (err) {
        console.log("Failed to fetch request status:", err);
      }
    };

    fetchRequestStatus();
    const interval = setInterval(fetchRequestStatus, 4000);
    return () => clearInterval(interval);
  }, [meta.requestId]);

  // ------------------- TRACTOR LOCATION -------------------
  useEffect(() => {
    if (!meta.tractorId) return;

    const fetchTractorLocation = async () => {
      try {
        const res = await spiTractorsApi.getTractorLocation(meta.tractorId);
        const lat = toNumber(
          res?.data?.lat ??
          res?.data?.latitude ??
          res?.data?.tractor?.lat ??
          res?.data?.tractor?.latitude
        );
        const lng = toNumber(
          res?.data?.lng ??
          res?.data?.longitude ??
          res?.data?.tractor?.lng ??
          res?.data?.tractor?.longitude
        );
        if (lat !== null && lng !== null) setTractorLocation({ lat, lng });
      } catch (err) {
        console.log("Failed to fetch tractor location:", err);
      }
    };

    fetchTractorLocation();
    const interval = setInterval(fetchTractorLocation, 5000);
    return () => clearInterval(interval);
  }, [meta.tractorId]);

  // ------------------- TRACK TIMELINE -------------------
  useEffect(() => {
    if (!meta.requestId) return;

    const fetchTracking = async () => {
      try {
        const res = await spiTractorsApi.requestTracking(meta.requestId);
        const timeline = getTimelineArray(res);
        if (!timeline.length) return;

        const latest = timeline[timeline.length - 1];
        const normalizedStatus = normalizeTrackingStatus(latest?.to_status || latest?.status);
        const nextStep = STEP_MAP[normalizedStatus] ?? 0;
        setCurrentStep(clampStep(nextStep));
      } catch (err) {
        console.log("Tracking fetch failed:", err);
      }
    };

    fetchTracking();
    const interval = setInterval(fetchTracking, 8000);
    return () => clearInterval(interval);
  }, [meta.requestId]);

  // ------------------- ETA -------------------
  useEffect(() => {
    if (!isValidLatLng(farmerLocation) || !isValidLatLng(tractorLocation)) return;

    const distanceKm = calculateDistanceKm(tractorLocation, farmerLocation);
    const etaMinutes = distanceKm > 0 ? Math.max(1, Math.round((distanceKm / 30) * 60)) : 0;
    setLiveEtaMinutes(etaMinutes);
  }, [farmerLocation, tractorLocation]);

  // ------------------- MAP FIT -------------------
  useEffect(() => {
    if (!mapRef.current || !window.google?.maps) return;
    if (!isValidLatLng(farmerLocation) && !isValidLatLng(tractorLocation)) return;

    const bounds = new window.google.maps.LatLngBounds();
    if (isValidLatLng(farmerLocation)) bounds.extend(farmerLocation);
    if (isValidLatLng(tractorLocation)) bounds.extend(tractorLocation);

    mapRef.current.fitBounds(bounds);
    if (!(isValidLatLng(farmerLocation) && isValidLatLng(tractorLocation))) mapRef.current.setZoom(15);
  }, [farmerLocation, tractorLocation]);

  // ------------------- HANDLERS -------------------
  const handlePrev = () => setCurrentStep((prev) => clampStep(prev - 1));
  const handleNext = () => setCurrentStep((prev) => clampStep(prev + 1));

  // ------------------- RENDER -------------------
  return (
    <div className="trk-page">
      <button className="trk-back" onClick={() => navigate(-1)} aria-label="Go back">←</button>

      <div className="trk-shell">
        <header className="trk-head">
          <div>
            <div className="trk-chip">{meta.requestId}</div>
            <h1 className="trk-title">Track your request</h1>
            <p className="trk-subtitle">{meta.service} • {meta.tractorName}</p>
            <p className="trk-muted">{meta.farmAddress}</p>
          </div>

          <div className="trk-actions">
            <button className="trk-btnGhost" type="button" onClick={handlePrev}>◀ Prev</button>
            <button className="trk-btnGhost" type="button" onClick={handleNext}>Next ▶</button>
          </div>
        </header>

        <div className="trk-grid">
          <div className="trk-card">
            <div className="trk-progressTop">
              <div className="trk-progressLabel">Overall progress</div>
              <div className="trk-progressVal">{progressPct}%</div>
            </div>
            <div className="trk-bar">
              <div className="trk-barFill" style={{ width: `${progressPct}%` }} />
            </div>
            <div className="trk-timeline">
              {STEPS.map((step, index) => {
                const done = index < safeCurrentStep;
                const active = index === safeCurrentStep;
                return (
                  <div key={step.key} className={`trk-step ${done ? "done" : ""} ${active ? "active" : ""}`}>
                    <div className="trk-dot">{done ? "✓" : active ? "•" : ""}</div>
                    <div className="trk-stepBody">
                      <div className="trk-stepTitle">{step.title}</div>
                      <div className="trk-stepDesc">{step.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="trk-card trk-right">
            <h3 className="trk-rightTitle">Live Status</h3>
            <div className="trk-statusBox">
              <div className="trk-statusKey">Current status</div>
              <div className="trk-statusVal">{activeStep.title}</div>
              <div className="trk-statusDesc">{activeStep.desc}</div>
              {activeStep.key === "enroute" && (
                <div className="trk-mini">
                  Estimated arrival: <b>{liveEtaMinutes} mins</b>
                </div>
              )}
            </div>

            <div className="trk-realMap">
              <LoadScript googleMapsApiKey={GOOGLE_KEY}>
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={mapCenter}
                  zoom={15}
                  onLoad={(map) => (mapRef.current = map)}
                  options={{ streetViewControl: false, mapTypeControl: false, fullscreenControl: true }}
                >
                  {isValidLatLng(farmerLocation) && <Marker position={farmerLocation} icon={farmerIcon} title="Farm" />}
                  {isValidLatLng(tractorLocation) && <Marker position={tractorLocation} icon={tractorMarkerIcon} title={meta.tractorName || "Matched Tractor"} />}
                  {linePath.length === 2 && <Polyline path={linePath} options={{ strokeColor: "#1A73E8", strokeOpacity: 0.9, strokeWeight: 5 }} />}
                </GoogleMap>
              </LoadScript>
            </div>

            <div className="trk-row">
              <button className="trk-btn" type="button" onClick={() => alert("Calling driver (demo)")}>Call Driver</button>
              <button className="trk-btnOutline" type="button" onClick={() => alert("Support chat (demo)")}>Support</button>
            </div>

            <button className="trk-cancel" type="button" onClick={() => alert("Cancel request (demo)")}>Cancel Request</button>
          </div>
        </div>
      </div>
    </div>
  );
}
