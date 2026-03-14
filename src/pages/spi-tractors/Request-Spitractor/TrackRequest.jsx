import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LoadScript, GoogleMap, Marker, Polyline } from "@react-google-maps/api";
import "./TrackRequest.css";
import { spiTractorsApi } from "../api/spiTractorsApi";
import tractorMarkerImage from "../../../assets/images/Group (11).png";

const GOOGLE_KEY = "AIzaSyA4vJ953vqwIwSm5vhEHQyFDEXVC-S9_qg";
const FARM_GPS_STORAGE_KEY = "spiFarmerGps";

const mapContainerStyle = { width: "100%", height: "260px" };
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
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function TrackRequest() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const mapRef = useRef(null);

  const job = useMemo(() => state?.job || {}, [state]);

  
  const [tractorData, setTractorData] = useState(null);
  const [tractorLocation, setTractorLocation] = useState(null);
  const [farmerLocation, setFarmerLocation] = useState(null);
  const [routeInfo, setRouteInfo] = useState({ distanceKm: 0, etaMinutes: 0 });

  // Load farmer GPS from localStorage
  useEffect(() => {
    try {
      const gps = JSON.parse(localStorage.getItem(FARM_GPS_STORAGE_KEY) || "null");
      const lat = toNumber(gps?.lat);
      const lng = toNumber(gps?.lng);
      if (lat && lng) setFarmerLocation({ lat, lng });
    } catch {}
  }, []);

  // Poll request status like PayAndEta
  useEffect(() => {
    if (!job.requestId) return;

    const checkStatus = async () => {
      try {
        const res = await spiTractorsApi.getRequestStatus(job.requestId);
        const data = res?.data;
        if (!data) return;

        if (data.matched === true || data.status === "matched") {
          if (data.matched_tractor) {
            setTractorData(data.matched_tractor);
            setTractorLocation({ lat: Number(data.matched_tractor.lat), lng: Number(data.matched_tractor.lng) });
          }
        }
      } catch (e) {
        console.log("Error fetching request status:", e);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 4000);
    return () => clearInterval(interval);
  }, [job.requestId]);

  // Poll live tractor location
  useEffect(() => {
    if (!tractorData?.id) return;

    const load = async () => {
      try {
        const res = await spiTractorsApi.getTractorLocation(tractorData.id);
        const lat = toNumber(res?.data?.lat ?? res?.data?.tractor?.lat);
        const lng = toNumber(res?.data?.lng ?? res?.data?.tractor?.lng);
        if (lat && lng) setTractorLocation({ lat, lng });
      } catch {}
    };

    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, [tractorData]);

  // Update distance & ETA
  useEffect(() => {
    if (!isValidLatLng(farmerLocation) || !isValidLatLng(tractorLocation)) return;
    const d = calculateDistanceKm(tractorLocation, farmerLocation);
    const eta = d > 0 ? Math.max(1, Math.round((d / 30) * 60)) : 0;
    setRouteInfo({ distanceKm: d, etaMinutes: eta });
  }, [farmerLocation, tractorLocation]);

  const mapCenter = useMemo(() => {
    if (isValidLatLng(farmerLocation)) return farmerLocation;
    if (isValidLatLng(tractorLocation)) return tractorLocation;
    return defaultCenter;
  }, [farmerLocation, tractorLocation]);

  const linePath = useMemo(() => {
    if (!isValidLatLng(farmerLocation) || !isValidLatLng(tractorLocation)) return [];
    return [tractorLocation, farmerLocation];
  }, [farmerLocation, tractorLocation]);

  return (
    <div className="trk-page">
      <button className="trk-back" onClick={() => navigate(-1)}>←</button>

      <div className="trk-shell">
        <header className="trk-head">
          <div>
            <div className="trk-chip">{job.requestId}</div>
            <h1 className="trk-title">Track Tractor Arrival</h1>
            <p className="trk-subtitle">{job.service} • {tractorData?.name}</p>
            <p className="trk-muted">{job.farmAddress}</p>
          </div>
        </header>

        <div className="trk-grid">
          <div className="trk-card trk-right">
            <h3 className="trk-rightTitle">Live Status</h3>
            <div className="trk-statusBox">
              <div className="trk-statusKey">Distance</div>
              <div className="trk-statusVal">{routeInfo.distanceKm.toFixed(1)} km</div>
              <div className="trk-statusKey">ETA</div>
              <div className="trk-statusVal">{routeInfo.etaMinutes} mins</div>
            </div>

            <div className="trk-realMap">
              <LoadScript googleMapsApiKey={GOOGLE_KEY}>
                <GoogleMap
                  mapContainerStyle={{ width: "100%", height: "260px" }}
                  center={mapCenter}
                  zoom={13}
                >
                  {farmerLocation && <Marker position={farmerLocation} />}
                  {tractorLocation && <Marker position={tractorLocation} icon={tractorMarkerImage} />}
                  {linePath.length === 2 && <Polyline path={linePath} />}
                </GoogleMap>
              </LoadScript>
            </div>

            <div className="trk-row">
              {tractorData?.phone && (
                <a href={`tel:${tractorData.phone}`} className="trk-btn">
                  Call Driver
                </a>
              )}

              <a href={`mailto:support@spida.africa`} className="trk-btnOutline">
                Support
              </a>
            </div>

            <button className="trk-cancel" onClick={async () => {
              try {
                await spiTractorsApi.cancelRequest(job.requestId);
                navigate(-1);
              } catch { alert("Cancel failed"); }
            }}>
              Cancel Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
