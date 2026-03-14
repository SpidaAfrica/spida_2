import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LoadScript,
  GoogleMap,
  Marker,
  Polyline,
} from "@react-google-maps/api";
import "./TrackRequest.css";
import { spiTractorsApi } from "../api/spiTractorsApi";
import tractorMarkerImage from "../../../assets/images/Group (11).png";

const GOOGLE_KEY = "AIzaSyA4vJ953vqwIwSm5vhEHQyFDEXVC-S9_qg";
const FARM_GPS_STORAGE_KEY = "spiFarmerGps";

const STEPS = [
  "Sent",
  "Received",
  "Accepted",
  "En Route",
  "Arrived",
  "Work Started",
  "In Progress",
  "Completed",
];

const mapContainerStyle = { width: "100%", height: "320px" };
const defaultCenter = { lat: 6.5244, lng: 3.3792 };

function toNumber(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function isValidLatLng(c) {
  return !!c && Number.isFinite(c.lat) && Number.isFinite(c.lng);
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
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function TrackRequest() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const mapRef = useRef(null);

  // ----- State -----
  const [job, setJob] = useState(null);
  const [tractorData, setTractorData] = useState(null);
  const [tractorLocation, setTractorLocation] = useState(null);
  const [farmerLocation, setFarmerLocation] = useState(null);
  const [routeInfo, setRouteInfo] = useState({ distanceKm: 0, etaMinutes: 0 });
  const [currentStep, setCurrentStep] = useState(3); // Default: En Route

  // ----- Load farmer GPS -----
  useEffect(() => {
    try {
      const gps = JSON.parse(localStorage.getItem(FARM_GPS_STORAGE_KEY) || "null");
      const lat = toNumber(gps?.lat);
      const lng = toNumber(gps?.lng);
      if (lat && lng) setFarmerLocation({ lat, lng });
    } catch {}
  }, []);

  // ----- Fetch job details & matched tractor -----
  useEffect(() => {
    if (!state?.requestId) return;

    const fetchJob = async () => {
      try {
        const res = await spiTractorsApi.getRequestStatus(state.requestId);
        const data = res?.data;
        if (!data) return;

        setJob(data);

        if (data.matched && data.matched_tractor) {
          const t = data.matched_tractor;
          setTractorData(t);
          setTractorLocation({ lat: Number(t.lat), lng: Number(t.lng) });
        }

        // Map status to step
        const statusMap = {
          SENT: 0,
          RECEIVED: 1,
          ACCEPTED: 2,
          EN_ROUTE: 3,
          ARRIVED: 4,
          WORK_STARTED: 5,
          IN_PROGRESS: 6,
          COMPLETED: 7,
        };
        const status = (data.status || "EN_ROUTE").toUpperCase();
        setCurrentStep(statusMap[status] ?? 3);
      } catch (err) {
        console.error("Failed to fetch request data:", err);
      }
    };

    fetchJob();
    const interval = setInterval(fetchJob, 5000); // Poll for live updates
    return () => clearInterval(interval);
  }, [state?.requestId]);

  // ----- Poll tractor live location -----
  useEffect(() => {
    if (!tractorData?.id) return;

    const fetchTractor = async () => {
      try {
        const res = await spiTractorsApi.getTractorLocation(tractorData.id);
        const lat = toNumber(res?.data?.lat ?? res?.data?.tractor?.lat);
        const lng = toNumber(res?.data?.lng ?? res?.data?.tractor?.lng);
        if (lat && lng) setTractorLocation({ lat, lng });
      } catch {}
    };

    fetchTractor();
    const interval = setInterval(fetchTractor, 5000);
    return () => clearInterval(interval);
  }, [tractorData]);

  // ----- Update distance & ETA -----
  useEffect(() => {
    if (!isValidLatLng(farmerLocation) || !isValidLatLng(tractorLocation)) return;
    const distanceKm = calculateDistanceKm(tractorLocation, farmerLocation);
    const etaMinutes = distanceKm > 0 ? Math.max(1, Math.round((distanceKm / 30) * 60)) : 0;
    setRouteInfo({ distanceKm, etaMinutes });
  }, [farmerLocation, tractorLocation]);

  // ----- Map center & path -----
  const mapCenter = useMemo(() => {
    if (isValidLatLng(farmerLocation)) return farmerLocation;
    if (isValidLatLng(tractorLocation)) return tractorLocation;
    return defaultCenter;
  }, [farmerLocation, tractorLocation]);

  const linePath = useMemo(() => {
    if (!isValidLatLng(farmerLocation) || !isValidLatLng(tractorLocation)) return [];
    return [tractorLocation, farmerLocation];
  }, [farmerLocation, tractorLocation]);

  const safeStep = Math.min(currentStep, STEPS.length - 1);

  // ----- Format money (optional) -----
  const formatMoney = (n) => `₦${Number(n || 0).toLocaleString()}`;

  return (
    <div className="trk-page">
      <button className="trk-back" onClick={() => navigate(-1)}>←</button>

      <div className="trk-shell">
        <header className="trk-head">
          <div>
            <div className="trk-chip">{job?.requestId || "Loading..."}</div>
            <h1 className="trk-title">{job?.service || ""} - {tractorData?.name || ""}</h1>
            <p className="trk-muted">{job?.farmAddress || ""}</p>
          </div>
        </header>

        <div className="trk-grid">
          {/* Progress Timeline */}
          <div className="trk-card">
            <h3>Progress</h3>
            <div className="trk-timeline">
              {STEPS.map((step, index) => {
                const done = index < safeStep;
                const active = index === safeStep;
                return (
                  <div key={index} className={`trk-step ${done ? "done" : ""} ${active ? "active" : ""}`}>
                    <div className="trk-dot">{done ? "✓" : active ? "•" : ""}</div>
                    <div className="trk-stepBody">
                      <div className="trk-stepTitle">{step}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="trk-eta">
              <div>Distance: <b>{routeInfo.distanceKm.toFixed(1)} km</b></div>
              <div>ETA: <b>{routeInfo.etaMinutes} mins</b></div>
            </div>
          </div>

          {/* Map & Actions */}
          <div className="trk-card trk-right">
            <h3>Live Map</h3>
            <LoadScript googleMapsApiKey={GOOGLE_KEY}>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={mapCenter}
                zoom={15}
                onLoad={(map) => (mapRef.current = map)}
              >
                {isValidLatLng(farmerLocation) && <Marker position={farmerLocation} title="Farm" />}
                {isValidLatLng(tractorLocation) && (
                  <Marker
                    position={tractorLocation}
                    icon={tractorMarkerImage}
                    title={tractorData?.name}
                  />
                )}
                {linePath.length === 2 && <Polyline path={linePath} />}
              </GoogleMap>
            </LoadScript>

            {tractorData?.phone ? (
              <a className="trk-btn" href={`tel:${tractorData.phone}`}>
                Call Driver
              </a>
            ) : (
              <button className="trk-btn" disabled>Call Driver</button>
            )}

            <button className="trk-btnOutline" onClick={() => alert("Support Chat")}>
              Support
            </button>

            <button
              className="trk-cancel"
              onClick={async () => {
                if (!job?.requestId) return;
                try {
                  await spiTractorsApi.cancelRequest(job.requestId);
                  alert("Request cancelled");
                  navigate(-1);
                } catch {
                  alert("Unable to cancel request");
                }
              }}
            >
              Cancel Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
