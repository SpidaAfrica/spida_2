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

const defaultCenter = { lat: 6.5244, lng: 3.3792 };

const toNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

const isValidLatLng = (c) =>
  !!c && Number.isFinite(c.lat) && Number.isFinite(c.lng);

export default function SpiTractorsPayAndEta() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const mapRef = useRef(null);

  const [waiting, setWaiting] = useState(true);
  const [tractorData, setTractorData] = useState(null);
  const [tractorLocation, setTractorLocation] = useState(null);
  const [farmerLocation, setFarmerLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [estimate, setEstimate] = useState(null);

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
        tractorId: "",
        tractorName: "",
        tractorRegId: "",
      }
    );
  }, [state]);

  /* ---------------- farmer gps ---------------- */

  useEffect(() => {
    try {
      const gps = JSON.parse(
        localStorage.getItem(FARM_GPS_STORAGE_KEY) || "null"
      );

      const lat = toNumber(gps?.lat);
      const lng = toNumber(gps?.lng);

      if (lat && lng) setFarmerLocation({ lat, lng });
    } catch {}
  }, []);

  /* ---------------- request status polling ---------------- */

  useEffect(() => {

  if (!job.requestId) return;

  const checkStatus = async () => {

    try {

      const res = await spiTractorsApi.getRequestStatus(job.requestId);

      console.log("RAW RES", res);

      const data = res?.data?.data;

      console.log("PARSED", data);

      if (!data) return;

      if (data.matched === true || data.status === "matched") {

        console.log("MATCHED TRUE");

        setWaiting(false);

        const t = data.matched_tractor;

        if (t) {

          setTractorData(t);

          setTractorLocation({
            lat: Number(t.lat),
            lng: Number(t.lng),
          });

        }

      }

    } catch (e) {

      console.log("STATUS ERROR", e);

    }

  };

  checkStatus();

  const i = setInterval(checkStatus, 4000);

  return () => clearInterval(i);

}, [job.requestId]);

  /* ---------------- tractor live location ---------------- */

  useEffect(() => {
    if (!tractorData?.id) return;

    const load = async () => {
      try {
        const res = await spiTractorsApi.getTractorLocation(
          tractorData.id
        );

        const lat = toNumber(
          res?.data?.lat ?? res?.data?.tractor?.lat
        );

        const lng = toNumber(
          res?.data?.lng ?? res?.data?.tractor?.lng
        );

        if (lat && lng) {
          setTractorLocation({ lat, lng });
        }
      } catch {}
    };

    load();

    const i = setInterval(load, 5000);

    return () => clearInterval(i);
  }, [tractorData]);

  /* ---------------- payment estimate ---------------- */

  useEffect(() => {
    const run = async () => {
      try {
        const res = await spiTractorsApi.paymentEstimate({
          rate_per_hour:
            tractorData?.base_rate_per_hour || job.ratePerHour,
          estimated_hours: job.estimatedHours,
          travel_fee:
            tractorData?.travel_cost || job.travelFee,
        });

        setEstimate(res?.data || null);
      } catch {}
    };

    run();
  }, [tractorData, job]);

  /* ---------------- map helpers ---------------- */

  const mapCenter = useMemo(() => {
    if (isValidLatLng(farmerLocation)) return farmerLocation;
    if (isValidLatLng(tractorLocation)) return tractorLocation;
    return defaultCenter;
  }, [farmerLocation, tractorLocation]);

  const linePath = useMemo(() => {
    if (!isValidLatLng(farmerLocation)) return [];
    if (!isValidLatLng(tractorLocation)) return [];
    return [tractorLocation, farmerLocation];
  }, [farmerLocation, tractorLocation]);

  /* ---------------- total ---------------- */

  const total = useMemo(() => {
    if (estimate?.total) return Number(estimate.total);

    const rate =
      tractorData?.base_rate_per_hour || job.ratePerHour;

    const travel =
      tractorData?.travel_cost || job.travelFee;

    return rate * job.estimatedHours + travel;
  }, [estimate, tractorData, job]);

  const formatMoney = (n) =>
    `₦${Number(n || 0).toLocaleString()}`;

  /* ---------------- pay ---------------- */

  const handlePay = async () => {
    if (!job.requestUuid) return;

    try {
      setLoading(true);

      const init = await spiTractorsApi.paystackInitialize({
        job_request_id: job.requestUuid,
        amount_kobo: Math.round(total * 100),
        callback_url:
          window.location.origin +
          "/SpiTractorsPayCallback",
        meta: {
          request_code: job.requestId,
          tractor_id:
            tractorData?.id || job.tractorId,
        },
      });

      const url = init?.data?.authorization_url;

      if (url) window.location.href = url;
    } catch (e) {
      alert("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- waiting ---------------- */

  if (waiting) {
    return (
      <div className="wait-modal">
        <div className="wait-card">
          <h2>Finding tractor...</h2>
          <div className="loader" />
        </div>
      </div>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="pay-page">

      <button onClick={() => navigate(-1)}>
        ← Back
      </button>

      <LoadScript googleMapsApiKey={GOOGLE_KEY}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={mapCenter}
          zoom={13}
          onLoad={(m) => (mapRef.current = m)}
        >
          {farmerLocation && (
            <Marker position={farmerLocation} />
          )}

          {tractorLocation && (
            <Marker
              position={tractorLocation}
              icon={tractorMarkerImage}
            />
          )}

          {linePath.length === 2 && (
            <Polyline path={linePath} />
          )}
        </GoogleMap>
      </LoadScript>

      <h2>
        Tractor:{" "}
        {tractorData?.name || job.tractorName}
      </h2>

      <h3>Total: {formatMoney(total)}</h3>

      <button
        onClick={handlePay}
        disabled={loading}
      >
        {loading ? "Loading..." : "Pay"}
      </button>

    </div>
  );
}
