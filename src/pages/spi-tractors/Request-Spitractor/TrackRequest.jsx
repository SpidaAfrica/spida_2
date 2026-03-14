import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./TrackRequest.css";
import { spiTractorsApi } from "../api/spiTractorsApi";

const TRACK_REQUEST_KEY = "spiTrackRequestId";

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
  const [meta, setMeta] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { key: "sent", title: "Request Sent", desc: "Your request has been created." },
    { key: "received", title: "Request Received", desc: "Spida is processing your request." },
    { key: "accepted", title: "Accepted", desc: "A tractor owner has accepted your request." },
    { key: "enroute", title: "En Route", desc: "Tractor is heading to your farm location." },
    { key: "arrived", title: "Arrived", desc: "Tractor has arrived at the farm." },
    { key: "started", title: "Work Started", desc: "Work has started on your farm." },
    { key: "progress", title: "Work in Progress", desc: "Job is currently ongoing." },
    { key: "completed", title: "Work Completed", desc: "The job has been completed successfully." },
  ];

  /* -------------------------------- */
  /* GET REQUEST ID FROM LOCALSTORAGE */
  /* -------------------------------- */

  useEffect(() => {
    try {
      const stored = JSON.parse(
        localStorage.getItem(TRACK_REQUEST_KEY) || "null"
      );

      if (stored?.requestId) {
        setRequestId(stored.requestId);
      }
    } catch (e) {
      console.log("Failed to read requestId", e);
    }
  }, []);

  /* ---------------------------- */
  /* LOAD REQUEST META DATA      */
  /* ---------------------------- */

  useEffect(() => {
    if (!requestId) return;

    const loadMeta = async () => {
      try {
        const res = await spiTractorsApi.getRequestStatus(requestId);
        const data = res?.data;

        if (!data) return;

        setMeta({
          requestId: data.id,
          tractorName: data?.matched_tractor?.name || "",
          service: data?.service || "",
          farmAddress: data?.farm_address || "",
          etaMinutes: data?.eta_minutes || 0,
        });
      } catch (e) {
        console.log("Meta load error", e);
      }
    };

    loadMeta();
  }, [requestId]);

  /* ---------------------------- */
  /* TRACK STATUS (POLLING)      */
  /* ---------------------------- */

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

  const progressPct = Math.round(((currentStep + 1) / steps.length) * 100);

  if (!requestId) {
    return (
      <div className="trk-page">
        <h2>Loading request...</h2>
      </div>
    );
  }

  return (
    <div className="trk-page">
      <button className="trk-back" onClick={() => navigate(-1)}>
        ←
      </button>

      <div className="trk-shell">
        <header className="trk-head">
          <div>
            <div className="trk-chip">{meta?.requestId}</div>

            <h1 className="trk-title">Track your request</h1>

            <p className="trk-subtitle">
              {meta?.service} • {meta?.tractorName}
            </p>

            <p className="trk-muted">{meta?.farmAddress}</p>
          </div>
        </header>

        <div className="trk-grid">
          <div className="trk-card">
            <div className="trk-progressTop">
              <div className="trk-progressLabel">
                Overall progress
              </div>

              <div className="trk-progressVal">
                {progressPct}%
              </div>
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

                    <div className="trk-stepBody">
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
            <h3 className="trk-rightTitle">
              Live Status
            </h3>

            <div className="trk-statusBox">
              <div className="trk-statusKey">
                Current status
              </div>

              <div className="trk-statusVal">
                {steps[currentStep].title}
              </div>

              <div className="trk-statusDesc">
                {steps[currentStep].desc}
              </div>

              {steps[currentStep].key ===
                "enroute" && (
                <div className="trk-mini">
                  Estimated arrival:{" "}
                  <b>{meta?.etaMinutes} mins</b>
                </div>
              )}
            </div>

            <div className="trk-row">
              <button
                className="trk-btn"
                onClick={() =>
                  alert("Calling driver")
                }
              >
                Call Driver
              </button>

              <button
                className="trk-btnOutline"
                onClick={() =>
                  alert("Support chat")
                }
              >
                Support
              </button>
            </div>

            <button
              className="trk-cancel"
              onClick={() =>
                alert("Cancel request")
              }
            >
              Cancel Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
