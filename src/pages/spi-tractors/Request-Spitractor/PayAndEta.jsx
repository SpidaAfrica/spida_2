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

const FARM_GPS_STORAGE_KEY = "spiFarmerGps";
const PENDING_PAY_KEY = "spiPendingPaystackPayment";
const TRACK_REQUEST_KEY = "spiTrackRequestId";

const mapContainerStyle = {
  width: "100%",
  height: "320px",
};

const defaultCenter = {
  lat: 6.5244,
  lng: 3.3792,
};

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
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export default function SpiTractorsPayAndEta() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const mapRef = useRef(null);

  const job = useMemo(() => {
    return (
      state?.job || {
        requestId: "",
        requestUuid: "",
        service: "",
        farmAddress: "",
        farmCity: "",
        estimatedHours: 1,
        ratePerHour: 0,
        travelFee: 0,
        draft: {},
      }
    );
  }, [state]);

  const requestType =
    job?.draft?.request_type || "single";

  /* ==============================
     SAVE REQUEST ID
  ============================== */

  useEffect(() => {
    if (!job?.requestId) return;

    localStorage.setItem(
      TRACK_REQUEST_KEY,
      JSON.stringify({
        requestId: job.requestId,
      })
    );
  }, [job?.requestId]);

  /* ==============================
     STATE
  ============================== */

  const [waiting, setWaiting] = useState(
    requestType === "single"
  );

  const [tractorData, setTractorData] = useState(null);
  const [tractorLocation, setTractorLocation] =
    useState(null);

  const [farmerLocation, setFarmerLocation] =
    useState(null);

  const [estimate, setEstimate] = useState(null);
  const [loading, setLoading] = useState(false);

  const [routeInfo, setRouteInfo] = useState({
    distanceKm: 0,
    etaMinutes: 0,
  });

  /* ==============================
     FARMER GPS
  ============================== */

  useEffect(() => {
    try {
      const gps = JSON.parse(
        localStorage.getItem(
          FARM_GPS_STORAGE_KEY
        ) || "null"
      );

      const lat = toNumber(gps?.lat);
      const lng = toNumber(gps?.lng);

      if (lat && lng) {
        setFarmerLocation({ lat, lng });
      }
    } catch {}
  }, []);

  /* ==============================
     MATCH ONLY FOR SINGLE
  ============================== */

  useEffect(() => {
    if (!job.requestId) return;

    if (requestType === "pair") return;

    const checkStatus = async () => {
      try {
        const res =
          await spiTractorsApi.getRequestStatus(
            job.requestId
          );

        const data = res?.data;

        if (
          data?.matched === true ||
          data?.status === "matched"
        ) {
          const t = data.matched_tractor;

          if (t) {
            setTractorData(t);

            setTractorLocation({
              lat: Number(t.lat),
              lng: Number(t.lng),
            });

            setWaiting(false);
          }
        }
      } catch {}
    };

    checkStatus();

    const i = setInterval(checkStatus, 4000);

    return () => clearInterval(i);

  }, [job.requestId, requestType]);

  /* ==============================
     TRACTOR LIVE LOCATION
  ============================== */

  useEffect(() => {
    if (!tractorData?.id) return;

    const load = async () => {
      try {
        const res =
          await spiTractorsApi.getTractorLocation(
            tractorData.id
          );

        const lat = toNumber(
          res?.data?.lat
        );

        const lng = toNumber(
          res?.data?.lng
        );

        if (lat && lng) {
          setTractorLocation({
            lat,
            lng,
          });
        }
      } catch {}
    };

    load();

    const i = setInterval(load, 5000);

    return () => clearInterval(i);

  }, [tractorData]);

  /* ==============================
     ESTIMATE (single only)
  ============================== */

  useEffect(() => {
    if (!tractorData) return;

    if (requestType === "pair") return;

    const run = async () => {
      try {
        const res =
          await spiTractorsApi.paymentEstimate(
            {
              rate_per_hour:
                tractorData.base_rate_per_hour,
              estimated_hours:
                job.estimatedHours,
              travel_fee:
                tractorData.travel_cost,
            }
          );

        setEstimate(res?.data);
      } catch {}
    };

    run();

  }, [tractorData, requestType]);

  /* ==============================
     DISTANCE
  ============================== */

  useEffect(() => {
    if (
      !isValidLatLng(farmerLocation) ||
      !isValidLatLng(tractorLocation)
    )
      return;

    const d = calculateDistanceKm(
      tractorLocation,
      farmerLocation
    );

    const eta =
      d > 0
        ? Math.round((d / 30) * 60)
        : 0;

    setRouteInfo({
      distanceKm: d,
      etaMinutes: eta,
    });

  }, [farmerLocation, tractorLocation]);

  /* ==============================
     TOTAL
  ============================== */

  const total = useMemo(() => {

    if (requestType === "pair") {

      const acres =
        job?.draft?.farm_size_acres || 1;

      return acres * 100000;
    }

    if (estimate?.total)
      return Number(estimate.total);

    return (
      job.ratePerHour *
        job.estimatedHours +
      job.travelFee
    );

  }, [estimate, job, requestType]);

  const formatMoney = (n) =>
    `₦${Number(n || 0).toLocaleString()}`;

  /* ==============================
     PAY
  ============================== */

  const handlePay = async () => {
    if (!job.requestId) return;

    try {
      setLoading(true);

      localStorage.setItem(
        PENDING_PAY_KEY,
        JSON.stringify({
          requestId: job.requestId,
          type: requestType,
        })
      );

      const init =
        await spiTractorsApi.paystackInitialize({
          job_request_id:
            job.requestId,
          amount_kobo:
            Math.round(total * 100),
          callback_url:
            window.location.origin +
            "/SpiTractorsPayCallback",
        });

      const url =
        init?.data?.authorization_url;

      if (url) {
        window.location.href = url;
      }

    } catch {
      alert("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  /* ==============================
     WAIT MODAL
  ============================== */

  if (waiting) {
    return (
      <div className="wait-modal">
        <div className="wait-card">
          <h2>
            Waiting for tractor owner
          </h2>
        </div>
      </div>
    );
  }

  /* ==============================
     UI
  ============================== */

  return (
    <div className="pay-page">

      <button
        className="pay-back"
        onClick={() => navigate(-1)}
      >
        ←
      </button>

      <div className="pay-shell">

        <h1>
          {requestType === "pair"
            ? "Pair Payment"
            : "Payment & ETA"}
        </h1>

        {requestType === "pair" && (

          <div className="pay-card">

            <h2>
              Pair Request Payment
            </h2>

            <p>
              Price: ₦100,000 per acre
            </p>

            <p>
              Acres: {job?.draft?.farm_size_acres|| 1}
            </p>

            <h3>
              Total: {formatMoney(total)}
            </h3>

            <button
              className="pay-btn"
              onClick={handlePay}
              disabled={loading}
            >
              Pay Now
            </button>

          </div>
        )}

        {requestType === "single" && (

          <div>
                <div className="pay-page">
                
                      <button
                        className="pay-back"
                        onClick={() => navigate(-1)}
                      >
                        ←
                      </button>
                
                      <div className="pay-shell">
                
                        <header className="pay-head">
                          <h1 className="pay-title">
                            Payment & ETA
                          </h1>
                
                          <p className="pay-subtitle">
                            Track tractor arrival
                          </p>
                        </header>
                
                        <div className="pay-grid">
                
                          <div className="pay-card">
                
                            <div className="pay-rowTop">
                
                              <div>
                
                                <div className="pay-chip">
                                  {job.requestId}
                                </div>
                                
                                <h2 className="pay-h2">
                                  {job.service}
                                </h2>
                
                                <p className="pay-muted">
                                  {job.farmAddress}
                                </p>
                
                              </div>
                
                              <div className="pay-tractor">
                
                                <div className="pay-tractorName">
                                  {tractorData?.name}
                                </div>
                
                                <div className="pay-tractorMeta">
                                  Reg: {tractorData?.registration_id}
                                </div>
                
                              </div>
                
                            </div>
                
                            <LoadScript googleMapsApiKey={GOOGLE_KEY}>
                              <GoogleMap
                                mapContainerStyle={
                                  mapContainerStyle
                                }
                                center={mapCenter}
                                zoom={13}
                              >
                
                                {farmerLocation && (
                                  <Marker
                                    position={
                                      farmerLocation
                                    }
                                  />
                                )}
                
                                {tractorLocation && (
                                  <Marker
                                    position={
                                      tractorLocation
                                    }
                                    icon={
                                      tractorMarkerImage
                                    }
                                  />
                                )}
                
                                {linePath.length === 2 && (
                                  <Polyline
                                    path={linePath}
                                  />
                                )}
                
                              </GoogleMap>
                            </LoadScript>
                
                            <div className="pay-etaCard">
                
                              <div className="pay-etaItem">
                                Distance
                                <b>
                                  {routeInfo.distanceKm.toFixed(
                                    1
                                  )} km
                                </b>
                              </div>
                
                              <div className="pay-etaItem">
                                ETA
                                <b>
                                  {routeInfo.etaMinutes} mins
                                </b>
                              </div>
                
                            </div>
                
                          </div>
                
                          <div className="pay-card pay-right">
                
                            <h3>Payment</h3>
                
                            <div className="pay-total">
                              Total: {formatMoney(total)}
                            </div>
                
                            <button
                              className="pay-btn"
                              onClick={handlePay}
                              disabled={loading}
                            >
                              {loading
                                ? "Redirecting..."
                                : "Make Payment"}
                            </button>
                
                          </div>
                
                        </div>
                
                      </div>
                
                    </div>

          </div>
        )}

      </div>

    </div>
  );
}



