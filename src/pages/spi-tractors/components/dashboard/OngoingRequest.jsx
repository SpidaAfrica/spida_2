import { useEffect, useMemo, useState } from "react";
import "./ongoing.css";
import { spiTractorsApi } from "../../api/spiTractorsApi";

const STEP_LABELS = ["Tractor Travel", "Task Execution", "Payment"];

function workflowToStep(workflowStatus, requestStatus) {
  const wf = String(workflowStatus || "").toUpperCase();
  const rs = String(requestStatus || "").toLowerCase();

  // if request cancelled/completed at table level
  if (rs === "cancelled") return 2;
  if (rs === "completed") return 2;

  // workflow steps
  if (["MATCHED", "ACCEPTED", "EN_ROUTE", "ARRIVED"].includes(wf)) return 0;
  if (["WORK_STARTED", "IN_PROGRESS"].includes(wf)) return 1;
  if (["PAYMENT_PENDING", "PAID", "COMPLETED"].includes(wf)) return 2;

  // fallback for your current enum statuses (pending/matched)
  if (rs === "pending") return 0;
  if (rs === "matched") return 0;

  return 0;
}

function prettyService(serviceRaw) {
  const s = String(serviceRaw || "").toLowerCase();
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : "Ploughing";
}

function initials(name) {
  const n = String(name || "").trim();
  return n ? n[0].toUpperCase() : "?";
}

export default function OngoingRequests() {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");

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
    const t = setInterval(fetchOngoing, 10000);
    return () => clearInterval(t);
  }, []);

  const content = useMemo(() => {
    if (loading && rows.length === 0) return <div className="ongoing-empty">Loading...</div>;
    if (err) return <div className="ongoing-empty">{err}</div>;
    if (!rows.length) return <div className="ongoing-empty">No ongoing requests yet.</div>;

    return rows.map((x) => {
      const step = workflowToStep(x.workflow_status, x.request_status);

      const depart = x?.meta?.departure_time ? `Departure Time: ${x.meta.departure_time}` : "";
      const eta = x?.meta?.eta_time ? `Estimated Arrival Time: ${x.meta.eta_time}` : "";

      const onStart = async () => {
        try {
          await spiTractorsApi.requestSetStatus({
            request_id: x.request_id,
            to_status: "WORK_STARTED",
            note: "Work started",
            tractor_id: x.tractor_id || 0,
            owner_user_id: x?.meta?.owner_user_id || 0,
          });
          fetchOngoing();
        } catch (e) {
          alert(e?.message || "Unable to start request");
        }
      };

      const onCancel = async () => {
        if (!window.confirm("Cancel this request?")) return;
        try {
          await spiTractorsApi.requestCancel({ request_id: x.request_id, note: "Cancelled" });
          fetchOngoing();
        } catch (e) {
          alert(e?.message || "Unable to cancel request");
        }
      };

      const canStart = String(x.workflow_status || "").toUpperCase() === "ACCEPTED";

      return (
        <div className="ongoing-item" key={x.request_id}>
          <div className="ongoing-top">
            <div className="ongoing-user">
              <div className="avatar-sm">{initials(x.farmer_name)}</div>
              <div>
                <div className="name">{x.farmer_name || "Farmer"}</div>
                <div className="meta">
                  Farm Name: <span>{x.farm_name || "-"}</span> &nbsp; Service Needed:{" "}
                  <span>{prettyService(x.service)}</span>
                </div>
              </div>
            </div>

            <div className="ongoing-actions">
              {canStart ? (
                <button className="start-btn" onClick={onStart}>Start Request</button>
              ) : (
                <>
                  <button className="mini-ic" title="Call" onClick={() => alert("Call (demo)")}>📞</button>
                  <button className="mini-ic danger" title="Cancel" onClick={onCancel}>✖</button>
                </>
              )}
            </div>
          </div>

          <div className="ongoing-bar">
            <div className="bar-labels">
              <span className={step === 0 ? "active" : ""}>{STEP_LABELS[0]}</span>
              <span className={step === 1 ? "active" : ""}>{STEP_LABELS[1]}</span>
              <span className={step === 2 ? "active" : ""}>{STEP_LABELS[2]}</span>
            </div>

            <div className="progress">
              <div className={`dot ${step >= 0 ? "on" : ""}`} />
              <div className="line" />
              <div className={`dot ${step >= 1 ? "on" : ""}`} />
              <div className="line" />
              <div className={`dot ${step >= 2 ? "on" : ""}`} />
            </div>

            <div className="bar-foot">
              <span>{depart}</span>
              <span>{eta}</span>
            </div>
          </div>
        </div>
      );
    });
  }, [rows, loading, err]);

  return (
    <div className="card-block">
      <div className="block-head">
        <div className="block-title">Ongoing requests</div>
        <div className="info" onClick={fetchOngoing} title="Refresh">ⓘ</div>
      </div>

      <div className="ongoing-list">{content}</div>
    </div>
  );
}
