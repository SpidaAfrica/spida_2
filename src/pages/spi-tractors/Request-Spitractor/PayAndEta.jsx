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

const GOOGLE_KEY = process.env.REACT_APP_GOOGLE_MAPS_KEY || "AIzaSyA4vJ953vqwIwSm5vhEHQyFDEXVC-S9_qg";

const FARM_GPS_STORAGE_KEY = "spiFarmerGps";
const PENDING_PAY_KEY      = "spiPendingPaystackPayment";
const TRACK_REQUEST_KEY    = "spiTrackRequestId";

const mapContainerStyle = { width: "100%", height: "320px" };
const defaultCenter     = { lat: 6.5244, lng: 3.3792 };

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
  const R     = 6371;
  const dLat  = toRad(destination.lat - origin.lat);
  const dLng  = toRad(destination.lng - origin.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(origin.lat)) * Math.cos(toRad(destination.lat)) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function SpiTractorsPayAndEta() {
  const navigate  = useNavigate();
  const { state } = useLocation();
  const mapRef    = useRef(null);

  const job = useMemo(() => {
    return state?.job || {
      requestId:      "",
      service:        "",
      farmAddress:    "",
      farmCity:       "",
      estimatedHours: 1,
      ratePerHour:    0,
      travelFee:      0,
      draft:          {},
    };
  }, [state]);

  const requestType = job?.draft?.request_type || "single";

  /* Save requestId to localStorage so TrackRequest page can pick it up */
  useEffect(() => {
    if (!job?.requestId) return;
    localStorage.setItem(TRACK_REQUEST_KEY, JSON.stringify({ requestId: job.requestId }));
  }, [job?.requestId]);

  const [waiting,          setWaiting]         = useState(requestType === "single");
  const [tractorData,      setTractorData]      = useState(null);
  const [tractorLocation,  setTractorLocation]  = useState(null);
  const [farmerLocation,   setFarmerLocation]   = useState(null);
  const [loading,          setLoading]          = useState(false);
  const [routeInfo,        setRouteInfo]        = useState({ distanceKm: 0, etaMinutes: 0 });

  /*
   * amountKobo — the single source of truth for what to charge.
   * Calculated directly from request data (farm_size_acres × base_rate_per_hour)
   * so it works even when the farmer returns to this page after the job is done.
   *
   * base_rate_per_hour is stored in KOBO in the DB.
   * farm_size_acres is the number of acres.
   * We charge: acres × rate_per_hour_kobo (treating rate as "per acre" effectively)
   * If you store rate in naira, multiply by 100 at the end.
   *
   * Adjust the formula below to match your pricing model.
   */
  const [amountKobo, setAmountKobo] = useState(0);

  /* Load farmer GPS */
  useEffect(() => {
    try {
      const gps = JSON.parse(localStorage.getItem(FARM_GPS_STORAGE_KEY) || "null");
      const lat = toNumber(gps?.lat);
      const lng = toNumber(gps?.lng);
      if (lat && lng) setFarmerLocation({ lat, lng });
    } catch {}
  }, []);

  /* Poll for tractor match + load amount from request status */
  useEffect(() => {
    if (!job.requestId) return;
    if (requestType === "pair") return;

    const checkStatus = async () => {
      try {
        const res  = await spiTractorsApi.getRequestStatus(job.requestId);
        const data = res?.data;
        if (!data) return;

        const t = data.matched_tractor;

        /* Set tractor data whenever we have it (matched OR completed) */
        if (t && t.id) {
          setTractorData(t);

          const lat = toNumber(t.lat);
          const lng = toNumber(t.lng);
          if (lat && lng) setTractorLocation({ lat, lng });

          /* -------------------------------------------------------
             FIX: Calculate amount directly from tractor + request
             data returned by get_request_status.php.

             get_request_status returns:
               t.base_rate_per_hour  (kobo)
               t.travel_cost         (string like "5000" or null)
               t.farm_size_acres     (acres)

             Formula: (base_rate_per_hour × farm_size_acres) + travel_cost
             All in kobo.
          ------------------------------------------------------- */
          const rateKobo    = Number(t.base_rate_per_hour || 0);
          const acres       = Number(t.farm_size_acres    || 1);
          const travelKobo  = Number(t.travel_cost        || 0);
          const calculated  = Math.round(rateKobo * acres + travelKobo);

          if (calculated > 0) {
            setAmountKobo(calculated);
          }
        }

        /* Only exit waiting screen once tractor is confirmed */
        if (data.matched === true || ["matched", "accepted", "started", "completed"].includes(data.status)) {
          if (t && t.id) setWaiting(false);
        }

      } catch {}
    };

    checkStatus();
    const i = setInterval(checkStatus, 4000);
    return () => clearInterval(i);
  }, [job.requestId, requestType]);

  /* Poll live tractor location */
  useEffect(() => {
    if (!tractorData?.id) return;

    const load = async () => {
      try {
        const res = await spiTractorsApi.getTractorLocation(tractorData.id);
        const lat = toNumber(res?.data?.lat);
        const lng = toNumber(res?.data?.lng);
        if (lat && lng) setTractorLocation({ lat, lng });
      } catch {}
    };

    load();
    const i = setInterval(load, 5000);
    return () => clearInterval(i);
  }, [tractorData]);

  /* Distance + ETA */
  useEffect(() => {
    if (!isValidLatLng(farmerLocation) || !isValidLatLng(tractorLocation)) return;
    const d   = calculateDistanceKm(tractorLocation, farmerLocation);
    const eta = d > 0 ? Math.round((d / 30) * 60) : 0;
    setRouteInfo({ distanceKm: d, etaMinutes: eta });
  }, [farmerLocation, tractorLocation]);

  /* Map helpers */
  const mapCenter = useMemo(() => {
    if (isValidLatLng(tractorLocation)) return tractorLocation;
    if (isValidLatLng(farmerLocation))  return farmerLocation;
    return defaultCenter;
  }, [tractorLocation, farmerLocation]);

  const linePath = useMemo(() => {
    if (isValidLatLng(tractorLocation) && isValidLatLng(farmerLocation)) {
      return [tractorLocation, farmerLocation];
    }
    return [];
  }, [tractorLocation, farmerLocation]);

  /* Total for PAIR requests (kept separate — flat rate per acre) */
  const pairAmountKobo = useMemo(() => {
    const acres = Number(job?.draft?.farm_size_acres || 1);
    return Math.round(acres * 10000000); // ₦100,000 per acre = 10,000,000 kobo
  }, [job]);

  const formatMoney = (kobo) => {
    const naira = Number(kobo || 0) / 100;
    return `₦${naira.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  /* Pay */
  const handlePay = async () => {
    const chargeKobo = requestType === "pair" ? pairAmountKobo : amountKobo;

    if (!job.requestId) {
      alert("Missing request ID. Please go back and try again.");
      return;
    }

    if (chargeKobo <= 0) {
      alert("Payment amount is ₦0. Please wait for tractor details to load or go back and retry.");
      return;
    }

    try {
      setLoading(true);

      localStorage.setItem(PENDING_PAY_KEY, JSON.stringify({
        requestId:   job.requestId,
        type:        requestType,
        tractorName: tractorData?.name     || "",
        service:     job?.draft?.service   || "",
        farmAddress: job?.draft?.farm_address || "",
        distanceKm:  routeInfo.distanceKm,
        etaMinutes:  routeInfo.etaMinutes,
      }));

      const init = await spiTractorsApi.paystackInitialize({
        job_request_id: job.requestId,
        amount_kobo:    chargeKobo,
        callback_url:   window.location.origin + "/SpiTractorsPayCallback",
      });

      const url = init?.data?.authorization_url;
      if (url) {
        window.location.href = url;
      } else {
        alert("Could not get payment link. Please try again.");
      }

    } catch (e) {
      alert(e?.message || "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* Waiting screen */
  if (waiting) {
    return (
      <div className="wait-modal">
        <div className="wait-card">
          <div style={{ fontSize: 32, marginBottom: 10 }}>🚜</div>
          <h2>Waiting for a tractor owner to accept your request</h2>
          <p>
            You will receive an SMS once your request is accepted.
            This page checks automatically — you don't need to refresh.
          </p>
          <button className="pay-back" style={{ marginTop: 16 }} onClick={() => navigate(-1)}>
            ← Go back
          </button>
        </div>
      </div>
    );
  }

  /* PAIR payment screen */
  if (requestType === "pair") {
    return (
      <div className="pay-page">
        <button className="pay-back" onClick={() => navigate(-1)}>←</button>
        <div className="pay-shell">
          <h1 className="pay-title">Pair Request Payment</h1>
          <div className="pay-card">
            <p className="pay-muted">Rate: ₦100,000 per acre</p>
            <p>Farm size: <b>{job?.draft?.farm_size_acres || 1} acres</b></p>
            <div className="pay-total">{formatMoney(pairAmountKobo)}</div>
            <button className="pay-btn" onClick={handlePay} disabled={loading}>
              {loading ? "Redirecting…" : "Pay Now"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* SINGLE payment screen */
  return (
    <div className="pay-page">
      <button className="pay-back" onClick={() => navigate(-1)}>←</button>

      <div className="pay-shell">
        <header className="pay-head">
          <h1 className="pay-title">Payment & ETA</h1>
          <p className="pay-subtitle">Track tractor arrival and complete payment</p>
        </header>

        <div className="pay-grid">

          {/* Left: map + tractor info */}
          <div className="pay-card">
            <div className="pay-rowTop">
              <div>
                <div className="pay-chip">{job.requestId}</div>
                <h2 className="pay-h2">{job?.draft?.service || job.service || "Service"}</h2>
                <p className="pay-muted">{job?.draft?.farm_address || job.farmAddress}</p>
              </div>

              {tractorData && (
                <div className="pay-tractor">
                  <div className="pay-tractorName">{tractorData.name}</div>
                  <div className="pay-tractorMeta">Reg: {tractorData.registration_id}</div>
                  {tractorData.owner_name && (
                    <div className="pay-tractorMeta">Driver: {tractorData.owner_name}</div>
                  )}
                </div>
              )}
            </div>

            <LoadScript googleMapsApiKey={GOOGLE_KEY}>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={mapCenter}
                zoom={13}
                onLoad={(map) => { mapRef.current = map; }}
              >
                {farmerLocation  && <Marker position={farmerLocation} />}
                {tractorLocation && (
                  <Marker position={tractorLocation} icon={tractorMarkerImage} />
                )}
                {linePath.length === 2 && <Polyline path={linePath} />}
              </GoogleMap>
            </LoadScript>

            <div className="pay-etaCard">
              <div className="pay-etaItem">
                Distance <b>{routeInfo.distanceKm.toFixed(1)} km</b>
              </div>
              <div className="pay-etaItem">
                ETA <b>~{routeInfo.etaMinutes} min</b>
              </div>
            </div>
          </div>

          {/* Right: payment summary */}
          <div className="pay-card pay-right">
            <h3>Payment Summary</h3>

            {/* Show breakdown if we have the data */}
            {tractorData && (
              <div className="pay-breakdown">
                <div className="pay-line">
                  <span>Rate</span>
                  <span>{formatMoney(tractorData.base_rate_per_hour)} / acre</span>
                </div>
                <div className="pay-line">
                  <span>Farm size</span>
                  <span>{tractorData.farm_size_acres || "—"} acres</span>
                </div>
                {Number(tractorData.travel_cost) > 0 && (
                  <div className="pay-line">
                    <span>Travel fee</span>
                    <span>{formatMoney(tractorData.travel_cost)}</span>
                  </div>
                )}
                <div style={{ borderTop: "1px solid #eef0f2", marginTop: 8, paddingTop: 8 }} />
              </div>
            )}

            <div className="pay-total">
              {amountKobo > 0
                ? formatMoney(amountKobo)
                : <span style={{ color: "#9ca3af", fontSize: 14 }}>Loading amount…</span>
              }
            </div>

            <button
              className="pay-btn"
              onClick={handlePay}
              disabled={loading || amountKobo <= 0}
            >
              {loading ? "Redirecting…" : amountKobo > 0 ? "Make Payment" : "Loading…"}
            </button>

            {tractorData?.owner_phone && (
              <a
                href={`tel:${tractorData.owner_phone}`}
                className="pay-call-driver"
                style={{ display: "block", textAlign: "center", marginTop: 12, fontSize: 13, color: "#16a34a" }}
              >
                📞 Call Driver
              </a>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
