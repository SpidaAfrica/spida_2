import { useEffect, useMemo, useState } from "react";
import "./ongoing.css";
import { spiTractorsApi } from "../../api/spiTractorsApi";

import call     from "../../../../assets/images/elements (9).png";
import cancel   from "../../../../assets/images/elements (10).png";
import complete from "../../../../assets/images/mark.jpg";

const STEP_LABELS = ["Tractor Travel", "Task Execution", "Completed"];

function statusToStep(status) {
  const s = String(status || "").toLowerCase();
  if (s === "started" || s === "in_progress") return 1;
  if (s === "completed")                       return 2;
  return 0; // pending | matched | accepted | grouped
}

function prettyService(serviceRaw) {
  const s = String(serviceRaw || "").toLowerCase();
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : "Service";
}

function initials(name) {
  const n = String(name || "").trim();
  return n ? n[0].toUpperCase() : "?";
}

function normalizePhone(phoneRaw) {
  const p = String(phoneRaw || "").trim();
  return p ? p.replace(/[^\d+]/g, "") : "";
}

function formatDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
}

export default function OngoingRequests() {
  const [loading, setLoading] = useState(false);
  const [rows, setRows]       = useState([]);
  const [err, setErr]         = useState("");

  const fetchOngoing = async () => {
    try {
      setErr("");
      setLoading(true);
      const res = await spiTractorsApi.ongoingRequests();
      setRows(Array.isArray(res?.data) ? res.data : []);
    } catch (e) {
      setErr(e?.message || "Unable to load ongoing requests");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOngoing();
    // FIX: reduced from 10s to 30s
    const t = setInterval(fetchOngoing, 30000);
    return () => clearInterval(t);
  }, []);

  const content = useMemo(() => {

    if (loading && rows.length === 0) {
      return <div className="ongoing-empty">Loading…</div>;
    }
    if (err) {
      return <div className="ongoing-empty" style={{ color: "crimson" }}>{err}</div>;
    }
    if (!rows.length) {
      return <div className="ongoing-empty">No ongoing requests at the moment.</div>;
    }

    return rows.map((x) => {

      const step         = statusToStep(x.request_status);
      const rs           = String(x.request_status || "").toLowerCase();
      const farmerPhone  = normalizePhone(x.farmer_phone);

      const canStart    = rs === "matched" || rs === "accepted" || rs === "grouped";
      const canComplete = rs === "started";
      const canCancel   = rs !== "completed" && rs !== "cancelled";

      const onStart = async () => {
        try {
          await spiTractorsApi.requestSetStatus({
            request_id: x.request_id,
            to_status:  "WORK_STARTED",
            tractor_id: x.tractor_id,
          });
          fetchOngoing();
        } catch (e) {
          alert(e?.message || "Unable to start request");
        }
      };

      const onComplete = async () => {
        if (!window.confirm("Mark this job as completed?")) return;
        try {
          await spiTractorsApi.requestSetStatus({
            request_id: x.request_id,
            to_status:  "COMPLETED",
            tractor_id: x.tractor_id,
          });
          fetchOngoing();
        } catch (e) {
          alert(e?.message || "Unable to complete job");
        }
      };

      const onCancel = async () => {
        if (!window.confirm("Cancel this request? This cannot be undone.")) return;
        try {
          await spiTractorsApi.requestCancel({ request_id: x.request_id });
          fetchOngoing();
        } catch (e) {
          alert(e?.message || "Unable to cancel request");
        }
      };

      return (
        <div className="ongoing-item" key={x.request_id}>

          <div className="ongoing-top">
            <div className="ongoing-user">
              <div className="avatar-sm">{initials(x.farmer_name)}</div>
              <div>
                <div className="name">{x.farmer_name || "Farmer"}</div>
                <div className="meta">
                  <span className="meta-badge">{prettyService(x.service)}</span>
                  {x.farm_name && <> · <span>{x.farm_name}</span></>}
                </div>
                {x.farm_city && (
                  <div className="meta">
                    📍 <span>{[x.farm_address, x.farm_city].filter(Boolean).join(", ")}</span>
                  </div>
                )}
                {x.farm_size_acres && (
                  <div className="meta">
                    Farm size: <span>{x.farm_size_acres} acres</span>
                    {x.preferred_date && (
                      <> · Date: <span>{formatDate(x.preferred_date)}</span></>
                    )}
                  </div>
                )}
                {farmerPhone && (
                  <div className="meta">Phone: <span>{farmerPhone}</span></div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="ongoing-actions">
              {canStart ? (
                <button className="start-btn" onClick={onStart}>
                  Start Job
                </button>
              ) : (
                <>
                  {farmerPhone && (
                    <a className="mini-ic" href={`tel:${farmerPhone}`} title="Call farmer">
                      <img src={call} style={{ width: 22 }} alt="Call" />
                    </a>
                  )}

                  <button
                    className="mini-ic"
                    disabled={!canComplete}
                    onClick={onComplete}
                    title="Mark completed"
                    style={{ opacity: canComplete ? 1 : 0.35 }}
                  >
                    <img src={complete} style={{ width: 22 }} alt="Complete" />
                  </button>

                  {canCancel && (
                    <button
                      className="mini-ic danger"
                      onClick={onCancel}
                      title="Cancel request"
                    >
                      <img src={cancel} style={{ width: 22 }} alt="Cancel" />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div className="ongoing-bar">
            <div className="bar-labels">
              {STEP_LABELS.map((label, i) => (
                <span key={i} className={step === i ? "active" : ""}>{label}</span>
              ))}
            </div>
            <div className="progress">
              {STEP_LABELS.map((_, i) => (
                <>
                  <div key={`dot-${i}`} className={`dot ${step >= i ? "on" : ""}`} />
                  {i < STEP_LABELS.length - 1 && (
                    <div
                      key={`line-${i}`}
                      className="line"
                      style={{ background: step > i ? "#16a34a" : "#e5e7eb" }}
                    />
                  )}
                </>
              ))}
            </div>
          </div>

        </div>
      );
    });

  }, [rows, loading, err]);

  return (
    <div className="card-block">
      <div className="block-head">
        <div className="block-title">Ongoing Requests</div>
        <button
          className="info"
          onClick={fetchOngoing}
          style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14 }}
          title="Refresh"
        >
          ↻
        </button>
      </div>

      <div className="ongoing-list">{content}</div>
    </div>
  );
}
