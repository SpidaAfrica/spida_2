import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LoadScript,
  GoogleMap,
  Marker,
  Polyline,
} from "@react-google-maps/api";
import "./PayAndEta.css";
import { spiTractorsApi } from "../api/spiTractorsApi";
import tractorMarkerImage from "../../../assets/images/Group (11).png";

const GOOGLE_KEY = "AIzaSyA4vJ953vqwIwSm5vhEHQyFDEXVC-S9_qg";
const PENDING_PAY_KEY = "spiPendingPaystackPayment";
const FARM_GPS_STORAGE_KEY = "spiFarmerGps";

const mapContainerStyle = {
  width: "100%",
  height: "320px",
};

const defaultCenter = {
  lat: 6.5244,
  lng: 3.3792,
};

function toNumber(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

function isValidLatLng(coords) {
  return !!coords && Number.isFinite(coords.lat) && Number.isFinite(coords.lng);
}

function calculateDistanceKm(origin, destination) {
  if (!isValidLatLng(origin) || !isValidLatLng(destination)) return 0;

  const toRad = (deg) => (deg * Math.PI) / 180;
  const earthRadiusKm = 6371;

  const dLat = toRad(destination.lat - origin.lat);
  const dLng = toRad(destination.lng - origin.lng);

  const lat1 = toRad(origin.lat);
  const lat2 = toRad(destination.lat);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

export default function SpiTractorsPayAndEta() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const mapRef = useRef(null);
  const [waiting, setWaiting] = useState(true);
  const [requestStatus, setRequestStatus] = useState(null);
  const job = useMemo(() => {
    return (
      state?.job || {
        requestId: "REQ-4567",
        requestUuid: "",
        service: "Ploughing",
        farmAddress: "12 Banana Street, Lekki, Lagos, Nigeria",
        farmCity: "Lagos",
        farmSize: 10,
        tractorId: "",
        tractorName: "Greenfield 6060X",
        tractorRegId: "ABC-456ZT",
        tractorLat: null,
        tractorLng: null,
        distanceKm: 6.4,
        etaMinutes: 18,
        ratePerHour: 5000,
        estimatedHours: 6,
        travelFee: 2000,
        full_name: "",
        farm_name: "",
      }
    );
  }, [state]);

  const [loading, setLoading] = useState(false);
  const [estimate, setEstimate] = useState(null);
  const [farmerLocation, setFarmerLocation] = useState(null);
  const [tractorLocation, setTractorLocation] = useState(() => {
    const lat = toNumber(job?.tractorLat);
    const lng = toNumber(job?.tractorLng);

    if (lat !== null && lng !== null) {
      return { lat, lng };
    }

    return null;
  });

  const [routeInfo, setRouteInfo] = useState({
    distanceKm: Number(job.distanceKm) || 0,
    etaMinutes: Number(job.etaMinutes) || 0,
  });

  const mapCenter = useMemo(() => {
    if (isValidLatLng(farmerLocation)) return farmerLocation;
    if (isValidLatLng(tractorLocation)) return tractorLocation;
    return defaultCenter;
  }, [farmerLocation, tractorLocation]);

  const linePath = useMemo(() => {
    if (!isValidLatLng(farmerLocation) || !isValidLatLng(tractorLocation)) {
      return [];
    }

    return [tractorLocation, farmerLocation];
  }, [farmerLocation, tractorLocation]);

  const farmerIcon = useMemo(() => {
    if (!window.google?.maps) {
      return { url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png" };
    }

    return {
      url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
      scaledSize: new window.google.maps.Size(42, 42),
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

  useEffect(() => {
    const runEstimate = async () => {
      try {
        const res = await spiTractorsApi.paymentEstimate({
          rate_per_hour: job.ratePerHour,
          estimated_hours: job.estimatedHours,
          travel_fee: job.travelFee,
        });

        setEstimate(res?.data || null);
      } catch (error) {
        console.log("Payment estimate error:", error);
        setEstimate(null);
      }
    };

    runEstimate();
  }, [job.estimatedHours, job.ratePerHour, job.travelFee]);

  useEffect(() => {
    try {
      const savedGps = JSON.parse(
        localStorage.getItem(FARM_GPS_STORAGE_KEY) || "null"
      );

      const lat = toNumber(savedGps?.lat);
      const lng = toNumber(savedGps?.lng);

      if (lat !== null && lng !== null) {
        setFarmerLocation({ lat, lng });
      } else {
        setFarmerLocation(null);
      }
    } catch (error) {
      console.log("Unable to read farmer location from localStorage:", error);
      setFarmerLocation(null);
    }
  }, []);

  useEffect(() => {
    const passedLat = toNumber(job?.tractorLat);
    const passedLng = toNumber(job?.tractorLng);

    if (passedLat !== null && passedLng !== null) {
      setTractorLocation({ lat: passedLat, lng: passedLng });
    }
  }, [job?.tractorLat, job?.tractorLng]);

  useEffect(() => {
    if (!job.tractorId) return;

    const fetchTractorLocation = async () => {
      try {
        const res = await spiTractorsApi.getTractorLocation(job.tractorId);

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

        if (lat !== null && lng !== null) {
          setTractorLocation({ lat, lng });
        }
      } catch (err) {
        console.log("Unable to get tractor location:", err);
      }
    };

    fetchTractorLocation();
    const interval = setInterval(fetchTractorLocation, 5000);

    return () => clearInterval(interval);
  }, [job.tractorId]);

  useEffect(() => {
    if (!isValidLatLng(farmerLocation) || !isValidLatLng(tractorLocation)) {
      return;
    }

    const distanceKm = calculateDistanceKm(tractorLocation, farmerLocation);
    const etaMinutes =
      distanceKm > 0 ? Math.max(1, Math.round((distanceKm / 30) * 60)) : 0;

    setRouteInfo({
      distanceKm,
      etaMinutes,
    });
  }, [farmerLocation, tractorLocation]);

  useEffect(() => {
    if (!mapRef.current || !window.google?.maps) return;
    if (!isValidLatLng(farmerLocation) && !isValidLatLng(tractorLocation)) return;

    const bounds = new window.google.maps.LatLngBounds();

    if (isValidLatLng(farmerLocation)) bounds.extend(farmerLocation);
    if (isValidLatLng(tractorLocation)) bounds.extend(tractorLocation);

    mapRef.current.fitBounds(bounds);

    if (!(isValidLatLng(farmerLocation) && isValidLatLng(tractorLocation))) {
      mapRef.current.setZoom(14);
    }
  }, [farmerLocation, tractorLocation]);
 useEffect(() => {
  if (!job.requestId) return;

  const checkStatus = async () => {
    try {
      const res = await spiTractorsApi.getRequestStatus(job.requestId);

      const data = res?.data;

      setRequestStatus(data);

      if (data?.matched_tractor) {
        setWaiting(false);

        const t = data.matched_tractor;

        setTractorLocation({
          lat: Number(t.lat),
          lng: Number(t.lng),
        });

        job.tractorId = t.id;
        job.tractorName = t.name;
        job.tractorRegId = t.registration_id;
        job.ratePerHour = t.base_rate_per_hour;
        job.travelFee = t.travel_cost;
      }
    } catch (e) {
      console.log(e);
    }
  };

  checkStatus();

  const i = setInterval(checkStatus, 4000);

  return () => clearInterval(i);

}, [job.requestId]);
  const total = useMemo(() => {
    if (estimate?.total) return Number(estimate.total) || 0;

    return (
      Number(job.ratePerHour) * Number(job.estimatedHours) +
      Number(job.travelFee)
    );
  }, [estimate, job]);

  const formatMoney = (n) => `₦${Number(n || 0).toLocaleString()}`;

  const handlePay = async () => {
    if (loading) return;

    if (!job.requestUuid) {
      alert("Missing request ID.");
      return;
    }

    try {
      setLoading(true);

      const amountKobo = Math.round(Number(total) * 100);
      const callbackUrl = `${window.location.origin}/SpiTractorsPayCallback`;

      const initRes = await spiTractorsApi.paystackInitialize({
        job_request_id: job.requestUuid,
        amount_kobo: amountKobo,
        callback_url: callbackUrl,
        meta: {
          request_code: job.requestId,
          tractor_id: job.tractorId,
          service: job.service,
          farm_city: job.farmCity,
          farm_address: job.farmAddress,
          full_name: job.full_name,
          farm_name: job.farm_name,
        },
      });

      const authorizationUrl = initRes?.data?.authorization_url;
      const reference = initRes?.data?.reference;

      if (!authorizationUrl || !reference) {
        throw new Error("Unable to start payment.");
      }

      localStorage.setItem(
        PENDING_PAY_KEY,
        JSON.stringify({
          reference,
          requestUuid: job.requestUuid,
          tractorName: job.tractorName,
        })
      );

      window.location.href = authorizationUrl;
    } catch (error) {
      alert(error?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };
  if (waiting) {
    return (
      <div className="wait-modal">
        <div className="wait-card">
  
          <h2>Finding tractor...</h2>
  
          <p>
            Waiting for tractor owner to accept your request.
          </p>
  
          <div className="loader" />
  
        </div>
      </div>
    );
  }
  return (
    <div className="pay-page">
      <button className="pay-back" onClick={() => navigate(-1)}>
        ←
      </button>

      <div className="pay-shell">
        <header className="pay-head">
          <h1 className="pay-title">Payment & ETA</h1>
          <p className="pay-subtitle">Track tractor arrival in real time.</p>
        </header>

        <div className="pay-grid">
          <div className="pay-card">
            <div className="pay-rowTop">
              <div>
                <div className="pay-chip">{job.requestId}</div>
                <h2 className="pay-h2">{job.service}</h2>
                <p className="pay-muted">{job.farmAddress}</p>
              </div>

              <div className="pay-tractor">
                <div className="pay-tractorName">{job.tractorName}</div>
                <div className="pay-tractorMeta">Reg. ID: {job.tractorRegId}</div>
              </div>
            </div>

            <div className="pay-mapWrap">
              <LoadScript googleMapsApiKey={GOOGLE_KEY}>
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={mapCenter}
                  zoom={13}
                  onLoad={(map) => {
                    mapRef.current = map;
                  }}
                  options={{
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: true,
                  }}
                >
                  {isValidLatLng(farmerLocation) && (
                    <Marker
                      position={farmerLocation}
                      icon={farmerIcon}
                      title="Farmer"
                    />
                  )}

                  {isValidLatLng(tractorLocation) && (
                    <Marker
                      position={tractorLocation}
                      icon={tractorMarkerIcon}
                      title={job.tractorName || "Chosen Tractor"}
                    />
                  )}

                  {linePath.length === 2 && (
                    <Polyline
                      path={linePath}
                      options={{
                        strokeColor: "#1A73E8",
                        strokeOpacity: 0.9,
                        strokeWeight: 5,
                      }}
                    />
                  )}
                </GoogleMap>
              </LoadScript>

              <div className="pay-etaCard">
                <div className="pay-etaItem">
                  <div className="pay-etaLabel">Distance</div>
                  <div className="pay-etaValue">
                    {Number(routeInfo.distanceKm || 0).toFixed(1)} km
                  </div>
                </div>

                <div className="pay-etaItem">
                  <div className="pay-etaLabel">Arrival</div>
                  <div className="pay-etaValue">{routeInfo.etaMinutes} mins</div>
                </div>

                <div className="pay-etaItem">
                  <div className="pay-etaLabel">Est. Job Time</div>
                  <div className="pay-etaValue">{job.estimatedHours} hrs</div>
                </div>
              </div>
            </div>

            <div className="pay-section">
              <h3 className="pay-sectionTitle">Pricing</h3>

              <div className="pay-breakdown">
                <div className="pay-line">
                  <span>Hourly rate</span>
                  <b>{formatMoney(job.ratePerHour)}/hr</b>
                </div>
                <div className="pay-line">
                  <span>Estimated duration</span>
                  <b>{job.estimatedHours} hrs</b>
                </div>
                <div className="pay-line">
                  <span>Work cost</span>
                  <b>{formatMoney(job.ratePerHour * job.estimatedHours)}</b>
                </div>
                <div className="pay-line">
                  <span>Travel fee</span>
                  <b>{formatMoney(job.travelFee)}</b>
                </div>
                <div className="pay-divider" />
                <div className="pay-total">
                  <span>Total</span>
                  <b>{formatMoney(total)}</b>
                </div>
              </div>
            </div>
          </div>

          <div className="pay-card pay-right">
            <h3 className="pay-sectionTitle">Payment</h3>

            <div className="pay-total">
              Total: <b>{formatMoney(total)}</b>
            </div>

            <button className="pay-btn" onClick={handlePay} disabled={loading}>
              {loading ? "Redirecting..." : "Make Payment"}
            </button>

            <button className="pay-secondary" onClick={() => navigate(-1)}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
