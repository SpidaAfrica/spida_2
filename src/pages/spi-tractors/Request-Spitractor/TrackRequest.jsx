import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LoadScript,
  GoogleMap,
  Marker,
  Polyline,
} from "@react-google-maps/api";
import { useJsApiLoader, DirectionsRenderer } from "@react-google-maps/api";
import "./TrackRequest.css";
import { spiTractorsApi } from "../api/spiTractorsApi";
import tractorMarkerImage from "../../../assets/images/Group (11).png";

const GOOGLE_KEY = "AIzaSyA4vJ953vqwIwSm5vhEHQyFDEXVC-S9_qg";

const TRACK_REQUEST_KEY = "spiTrackRequestId";
const FARM_GPS_STORAGE_KEY = "spiFarmerGps";

const mapContainerStyle = {
  width: "100%",
  height: "260px",
};

const mapCenter = {
  lat: 6.5244,
  lng: 3.3792,
};

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

export default function TrackRequest() {
  const navigate = useNavigate();

  const [requestId, setRequestId] = useState(null);
  const [tractorData, setTractorData] = useState(null);
  const [tractorLocation, setTractorLocation] = useState(null);
  const [farmerLocation, setFarmerLocation] = useState(null);

  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { key: "sent", title: "Request Sent", desc: "Your request has been created." },
    { key: "received", title: "Request Received", desc: "Spida is processing your request." },
    { key: "accepted", title: "Accepted", desc: "A tractor owner accepted your request." },
    { key: "enroute", title: "En Route", desc: "Tractor is heading to your farm." },
    { key: "arrived", title: "Arrived", desc: "Tractor arrived at your farm." },
    { key: "started", title: "Work Started", desc: "Work started on your farm." },
    { key: "progress", title: "Work in Progress", desc: "Work currently ongoing." },
    { key: "completed", title: "Completed", desc: "Job finished successfully." },
  ];

  /* ------------------------------ */
  /* LOAD REQUEST ID FROM STORAGE   */
  /* ------------------------------ */

  useEffect(() => {
    try {
      const stored = JSON.parse(
        localStorage.getItem(TRACK_REQUEST_KEY) || "null"
      );

      if (stored?.requestId) {
        setRequestId(stored.requestId);
      }
    } catch {}
  }, []);

  /* ------------------------------ */
  /* LOAD FARM GPS                  */
  /* ------------------------------ */

  useEffect(() => {
    try {
      const gps = JSON.parse(
        localStorage.getItem(FARM_GPS_STORAGE_KEY) || "null"
      );

      if (gps?.lat && gps?.lng) {
        setFarmerLocation({
          lat: Number(gps.lat),
          lng: Number(gps.lng),
        });
      }
    } catch {}
  }, []);

  /* ------------------------------ */
  /* LOAD REQUEST STATUS            */
  /* ------------------------------ */

  useEffect(() => {
    if (!requestId) return;

    const fetchTracking = async () => {
      try {
        const res = await spiTractorsApi.requestTracking(requestId);

        const timeline = res?.data || [];

        if (!timeline.length) return;

        const latest = timeline[timeline.length - 1];

        const idx = STEP_MAP[latest?.to_status] ?? 0;

        setCurrentStep(idx);
      } catch (e) {
        console.log("Tracking error", e);
      }
    };

    fetchTracking();

    const interval = setInterval(fetchTracking, 8000);

    return () => clearInterval(interval);
  }, [requestId]);


  /* ------------------------------ */
  /* LOAD TRACTOR LOCATION          */
  /* ------------------------------ */

  useEffect(() => {
    if (!requestId) return;

    const checkStatus = async () => {
      try {
        const res =
          await spiTractorsApi.getRequestStatus(requestId);

        const data = res?.data;

        if (!data) return;

        if (
          data.matched === true ||
          data.status === "matched"
        ) {

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
        console.log(e);
      }
    };

    checkStatus();

    const i = setInterval(checkStatus, 4000);

    return () => clearInterval(i);
  }, [requestId]);
/* ------------------------------ */
/* DEBUG TRACTOR DATA IN CONSOLE  */
/* ------------------------------ */
useEffect(() => {
  if (tractorData) {
    console.log("🚜 Tractor Data:", tractorData);
  } else {
    console.log("🚜 Tractor data not available yet");
  }
}, [tractorData]);
  /* ------------------------------ */
  /* MAP SETTINGS                   */
  /* ------------------------------ */

const { isLoaded } = useJsApiLoader({
  googleMapsApiKey: GOOGLE_KEY,
});

const [directions, setDirections] = useState(null);

useEffect(() => {
  if (!tractorLocation || !farmerLocation) return;

  const service = new window.google.maps.DirectionsService();

  service.route(
    {
      origin: tractorLocation,
      destination: farmerLocation,
      travelMode: window.google.maps.TravelMode.DRIVING,
    },
    (result, status) => {
      if (status === "OK" && result) {
        setDirections(result);
      } else {
        console.error("Directions request failed:", status);
      }
    }
  );
}, [tractorLocation, farmerLocation]);

  /* ------------------------------ */
  /* DRIVER CALL                    */
  /* ------------------------------ */

  const handleCallDriver = () => {
    if (!tractorData?.owner_phone) {
      alert("Driver phone not available");
      return;
    }

    window.location.href = `tel:${tractorData.owner_phone}`;
  };

  /* ------------------------------ */
  /* SUPPORT CALL                   */
  /* ------------------------------ */

  const handleSupport = () => {
    window.location.href = "tel:+2348123888508";
  };

  /* ------------------------------ */
  /* CANCEL REQUEST                 */
  /* ------------------------------ */

  const handleCancel = async () => {
    if (!requestId) return;

    const ok = window.confirm(
      "Are you sure you want to cancel this request?"
    );

    if (!ok) return;

    try {
      await spiTractorsApi.cancelRequest(requestId);

      alert("Request cancelled");

      navigate("/");
    } catch {
      alert("Failed to cancel request");
    }
  };

  const progressPct = Math.round(
    ((currentStep + 1) / steps.length) * 100
  );

  return (
    <div className="trk-page">
      <button className="trk-back" onClick={() => navigate(-1)}>
        ←
      </button>

      <div className="trk-shell">
        <header className="trk-head">
          <div>
            <div className="trk-chip">{requestId}</div>

            <h1 className="trk-title">Track your request</h1>

            <p className="trk-subtitle">
              {tractorData?.name}
            </p>
          </div>
        </header>

        <div className="trk-grid">
          <div className="trk-card">

            <div className="trk-progressTop">
              <div>Overall progress</div>
              <div>{progressPct}%</div>
            </div>

            <div className="trk-bar">
              <div
                className="trk-barFill"
                style={{ width: `${progressPct}%` }}
              />
            </div>

            <div className="trk-timeline">
              {steps.map((s, idx) => {
                const done = idx < currentStep;
                const active = idx === currentStep;

                return (
                  <div
                    key={s.key}
                    className={`trk-step ${
                      done ? "done" : ""
                    } ${active ? "active" : ""}`}
                  >
                    <div className="trk-dot">
                      {done ? "✓" : active ? "•" : ""}
                    </div>

                    <div>
                      <div className="trk-stepTitle">
                        {s.title}
                      </div>

                      <div className="trk-stepDesc">
                        {s.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="trk-card trk-right">

            <h3>Live Location</h3>

            <div style={{ width: "100%", height: "260px" }}>
              {isLoaded ? (
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
                <p>Loading map...</p>
              )}
            </div>

            <div className="trk-row" style={{marginTop:"15px"}}>
              <button
                className="trk-btn"
                onClick={handleCallDriver}
              >
                Call Driver
              </button>

              <button
                className="trk-btnOutline"
                onClick={handleSupport}
              >
                Support
              </button>
            </div>

            <button
              className="trk-cancel"
              onClick={handleCancel}
            >
              Cancel Request
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}
