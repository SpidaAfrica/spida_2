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
  const R = 6371;
  const dLat = toRad(destination.lat - origin.lat);
  const dLng = toRad(destination.lng - origin.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(origin.lat)) * Math.cos(toRad(destination.lat)) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/*
  extractNumber("5000")           => 5000
  extractNumber("#2,000 per trip") => 2000
  extractNumber(null)              => 0
*/
function extractNumber(val) {
  if (val === null || val === undefined) return 0;
  const n = Number(val);
  if (Number.isFinite(n)) return n;
  // Strip currency symbols, commas, letters — keep only digits and dot
  const cleaned = String(val).replace(/[^\d.]/g, "");
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
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

  useEffect(() => {
    if (!job?.requestId) return;
    localStorage.setItem(TRACK_REQUEST_KEY, JSON.stringify({ requestId: job.requestId }));
  }, [job?.requestId]);

  const [waiting,         setWaiting]         = useState(requestType === "single");
  const [tractorData,     setTractorData]      = useState(null);
  const [tractorLocation, setTractorLocation]  = useState(null);
  const [farmerLocation,  setFarmerLocation]   = useState(null);
  const [loading,         setLoading]          = useState(false);
  const [routeInfo,       setRouteInfo]        = useState({ distanceKm: 0, etaMinutes: 0 });
  const [amountKobo,      setAmountKobo]       = useState(0);

  /* Load farmer GPS */
  useEffect(() => {
    try {
      const gps = JSON.parse(localStorage.getItem(FARM_GPS_STORAGE_KEY) || "null");
      const lat = toNumber(gps?.lat);
      const lng = toNumber(gps?.lng);
      if (lat && lng) setFarmerLocation({ lat, lng });
    } catch {}
  }, []);

  /* Poll request status + calculate amount */
  useEffect(() => {
    if (!job.requestId || requestType === "pair") return;

    const checkStatus = async () => {
      try {
        const res  = await spiTractorsApi.getRequestStatus(job.requestId);
        const data = res?.data;
        if (!data) return;

        const t = data.matched_tractor;

        if (t && t.id) {
          setTractorData(t);

          const lat = toNumber(t.lat);
          const lng = toNumber(t.lng);
          if (lat && lng) setTractorLocation({ lat, lng });

          /*
            FIX 1: base_rate_per_hour = 5000 means ₦5,000 (naira), NOT kobo.
                    Multiply by 100 to get kobo for Paystack.

            FIX 2: travel_cost = "#2,000 per trip" is a string.
                    Use extractNumber() to strip it to 2000 (naira), then × 100 for kobo.

            Formula: (rate_naira × acres + travel_naira) × 100 = total kobo
          */
          const rateNaira   = extractNumber(t.base_rate_per_hour);  // e.g. 5000
          const acres       = extractNumber(t.farm_size_acres);      // e.g. 3
          const travelNaira = extractNumber(t.travel_cost);          // e.g. 2000

          const totalNaira  = rateNaira * acres + travelNaira;       // e.g. 17000
          const totalKobo   = Math.round(totalNaira * 100);          // e.g. 1700000

          if (totalKobo > 0) {
            setAmountKobo(totalKobo);
          }

          // Exit waiting for any active or completed status
          const activeStatuses = ["matched", "accepted", "started", "completed"];
          if (data.matched === true || activeStatuses.includes(data.status)) {
            setWaiting(false);
          }
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

  /* Pair amount — flat ₦100,000 per acre */
  const pairAmountKobo = useMemo(() => {
    const acres = extractNumber(job?.draft?.farm_size_acres) || 1;
    return Math.round(acres * 100000 * 100); // ₦100,000 × acres → kobo
  }, [job]);

  /* Format naira from kobo */
  const formatMoney = (kobo) => {
    const naira = Number(kobo || 0) / 100;
    return `₦${naira.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  /* Handle payment */
  const handlePay = async () => {
    const chargeKobo = requestType === "pair" ? pairAmountKobo : amountKobo;

    if (!job.requestId) {
      alert("Missing request ID. Please go back and try again.");
      return;
    }
    if (chargeKobo <= 0) {
      alert("Amount is ₦0. Please wait for tractor details to load, then try again.");
      return;
    }

    try {
      setLoading(true);
      localStorage.setItem(PENDING_PAY_KEY, JSON.stringify({
        requestId:   job.requestId,
        type:        requestType,
        tractorName: tractorData?.name         || "",
        service:     job?.draft?.service       || "",
        farmAddress: job?.draft?.farm_address  || "",
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
          <div style={{ fontSize: 36, marginBottom: 12 }}>🚜</div>
          <h2>Waiting for a tractor owner to accept your request</h2>
          <p>You will receive an SMS once accepted. This page checks automatically.</p>
          <button className="pay-back" style={{ marginTop: 16 }} onClick={() => navigate(-1)}>
            ← Go back
          </button>
        </div>
      </div>
    );
  }

  /* Pair payment screen */
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

  /* Single payment screen */
  return (
    <div className="pay-page">
      <button className="pay-back" onClick={() => navigate(-1)}>←</button>

      <div className="pay-shell">
        <header className="pay-head">
          <h1 className="pay-title">Payment & ETA</h1>
          <p className="pay-subtitle">Track tractor arrival and complete payment</p>
        </header>

        <div className="pay-grid">

          {/* Left: map */}
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

          {/* Right: payment */}
          <div className="pay-card pay-right">
            <h3>Payment Summary</h3>

            {tractorData && (
              <div className="pay-breakdown">
                <div className="pay-line">
                  <span>Rate</span>
                  <span>₦{extractNumber(tractorData.base_rate_per_hour).toLocaleString()} / acre</span>
                </div>
                <div className="pay-line">
                  <span>Farm size</span>
                  <span>{extractNumber(tractorData.farm_size_acres)} acres</span>
                </div>
                {extractNumber(tractorData.travel_cost) > 0 && (
                  <div className="pay-line">
                    <span>Travel fee</span>
                    <span>₦{extractNumber(tractorData.travel_cost).toLocaleString()}</span>
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
              {loading       ? "Redirecting…"   :
               amountKobo > 0 ? "Make Payment"  :
               "Loading…"}
            </button>

            {tractorData?.owner_phone && (
              <a
                href={`tel:${tractorData.owner_phone}`}
                style={{ display: "block", textAlign: "center", marginTop: 12, fontSize: 13, color: "#16a34a", textDecoration: "none" }}
              >
                📞 Call Tractor Owner
              </a>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
