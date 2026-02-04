import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./TrackRequest.css";

export default function TrackRequest() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const meta = useMemo(() => {
    return (
      state || {
        requestId: "REQ-4567",
        tractorName: "Greenfield 6060X",
        service: "Ploughing",
        farmAddress: "12 Banana Street, Lekki, Lagos, Nigeria",
        etaMinutes: 18,
      }
    );
  }, [state]);

  // Demo: current stage can come from backend polling/websocket
  const [currentStep, setCurrentStep] = useState(3);

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

  const progressPct = Math.round(((currentStep + 1) / steps.length) * 100);

  return (
    <div className="trk-page">
      <button className="trk-back" onClick={() => navigate(-1)} aria-label="Go back">
        ←
      </button>

      <div className="trk-shell">
        <header className="trk-head">
          <div>
            <div className="trk-chip">{meta.requestId}</div>
            <h1 className="trk-title">Track your request</h1>
            <p className="trk-subtitle">
              {meta.service} • {meta.tractorName}
            </p>
            <p className="trk-muted">{meta.farmAddress}</p>
          </div>

          <div className="trk-actions">
            <button className="trk-btnGhost" type="button" onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}>
              ◀ Prev
            </button>
            <button className="trk-btnGhost" type="button" onClick={() => setCurrentStep((s) => Math.min(steps.length - 1, s + 1))}>
              Next ▶
            </button>
          </div>
        </header>

        <div className="trk-grid">
          {/* LEFT: Timeline */}
          <div className="trk-card">
            <div className="trk-progressTop">
              <div className="trk-progressLabel">Overall progress</div>
              <div className="trk-progressVal">{progressPct}%</div>
            </div>

            <div className="trk-bar">
              <div className="trk-barFill" style={{ width: `${progressPct}%` }} />
            </div>

            <div className="trk-timeline">
              {steps.map((s, idx) => {
                const done = idx < currentStep;
                const active = idx === currentStep;
                return (
                  <div
                    key={s.key}
                    className={`trk-step ${done ? "done" : ""} ${active ? "active" : ""}`}
                  >
                    <div className="trk-dot">
                      {done ? "✓" : active ? "•" : ""}
                    </div>

                    <div className="trk-stepBody">
                      <div className="trk-stepTitle">{s.title}</div>
                      <div className="trk-stepDesc">{s.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Live status + map */}
          <div className="trk-card trk-right">
            <h3 className="trk-rightTitle">Live Status</h3>

            <div className="trk-statusBox">
              <div className="trk-statusKey">Current status</div>
              <div className="trk-statusVal">{steps[currentStep].title}</div>
              <div className="trk-statusDesc">{steps[currentStep].desc}</div>

              {steps[currentStep].key === "enroute" && (
                <div className="trk-mini">
                  Estimated arrival: <b>{meta.etaMinutes} mins</b>
                </div>
              )}
            </div>

            <div className="trk-map">
              {/* Placeholder map for now */}
              <div className="trk-pin trk-pinFarm" title="Farm" />
              <div className="trk-pin trk-pinTractor" title="Tractor" />
              <div className="trk-path" />
            </div>

            <div className="trk-row">
              <button className="trk-btn" type="button" onClick={() => alert("Calling driver (demo)")}>
                Call Driver
              </button>
              <button className="trk-btnOutline" type="button" onClick={() => alert("Support chat (demo)")}>
                Support
              </button>
            </div>

            <button
              className="trk-cancel"
              type="button"
              onClick={() => alert("Cancel request (demo)")}
            >
              Cancel Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
