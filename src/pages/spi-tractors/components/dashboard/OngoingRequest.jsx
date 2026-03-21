import { useEffect, useMemo, useState } from "react";
import "./ongoing.css";
import { spiTractorsApi } from "../../api/spiTractorsApi";

import call from "../../../../assets/images/elements (9).png";
import cancel from "../../../../assets/images/elements (10).png";
import complete from "../../../../assets/images/mark.jpg";

const STEP_LABELS = ["Tractor Travel", "Task Execution", "Payment"];


/* =========================
   STEP FROM request_status
========================= */

function statusToStep(status) {
  const s = String(status || "").toLowerCase();

  if (s === "pending") return 0;
  if (s === "matched") return 0;
  if (s === "accepted") return 0;
  if (s === "started") return 1;
  if (s === "completed") return 2;
  if (s === "cancelled") return 2;

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

function normalizePhone(phoneRaw) {
  const p = String(phoneRaw || "").trim();
  if (!p) return "";
  return p.replace(/[^\d+]/g, "");
}


export default function OngoingRequests() {

  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");


  /* =========================
     FETCH
  ========================= */

  const fetchOngoing = async () => {
    try {

      setErr("");
      setLoading(true);

      const res =
        await spiTractorsApi.ongoingRequests();

      setRows(
        Array.isArray(res?.data)
          ? res.data
          : []
      );

    } catch (e) {

      setErr(
        e?.message ||
        "Unable to load ongoing requests"
      );

      setRows([]);

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {

    fetchOngoing();

    const t =
      setInterval(fetchOngoing, 10000);

    return () => clearInterval(t);

  }, []);



  /* =========================
     UI
  ========================= */

  const content = useMemo(() => {

    if (loading && rows.length === 0)
      return (
        <div className="ongoing-empty">
          Loading...
        </div>
      );

    if (err)
      return (
        <div className="ongoing-empty">
          {err}
        </div>
      );

    if (!rows.length)
      return (
        <div className="ongoing-empty">
          No ongoing requests yet.
        </div>
      );


    return rows.map((x) => {

      const step =
        statusToStep(
          x.request_status
        );

      const rs =
        String(
          x.request_status || ""
        ).toLowerCase();

      const farmerPhone =
        normalizePhone(
          x.farmer_phone
        );

      const canCall =
        !!farmerPhone;

      const canStart =
        rs === "matched" ||
        rs === "accepted";

      const canComplete =
        rs === "started" ||
        rs === "accepted";


      /* =========================
         ACTIONS
      ========================= */

      const onStart = async () => {

        try {

          await spiTractorsApi.requestSetStatus({
            request_id: x.request_id,
            to_status: "WORK_STARTED",
            tractor_id: x.tractor_id,
          });

          fetchOngoing();

        } catch (e) {

          alert(
            e?.message ||
            "Unable to start request"
          );

        }

      };


      const onComplete = async () => {

        if (
          !window.confirm(
            "Mark as completed?"
          )
        ) return;

        try {

          await spiTractorsApi.requestSetStatus({
            request_id: x.request_id,
            to_status: "COMPLETED",
            tractor_id: x.tractor_id,
          });

          fetchOngoing();

        } catch (e) {

          alert(
            e?.message ||
            "Unable to complete"
          );

        }

      };


      const onCancel = async () => {

        if (
          !window.confirm(
            "Cancel request?"
          )
        ) return;

        try {

          await spiTractorsApi.requestCancel({
            request_id: x.request_id,
          });

          fetchOngoing();

        } catch (e) {

          alert(
            e?.message ||
            "Unable to cancel"
          );

        }

      };


      return (

        <div
          className="ongoing-item"
          key={x.request_id}
        >

          <div className="ongoing-top">

            <div className="ongoing-user">

              <div className="avatar-sm">
                {initials(
                  x.farmer_name
                )}
              </div>

              <div>

                <div className="name">
                  {x.farmer_name ||
                    "Farmer"}
                </div>

                <div className="meta">

                  Farm Name:
                  <span>
                    {x.farm_name}
                  </span>

                  &nbsp; Service:
                  <span>
                    {prettyService(
                      x.service
                    )}
                  </span>

                </div>

                {farmerPhone && (

                  <div
                    className="meta"
                  >
                    Phone:
                    <span>
                      {farmerPhone}
                    </span>
                  </div>

                )}

              </div>

            </div>



            {/* ACTIONS */}

            <div className="ongoing-actions">

              {canStart ? (

                <button
                  className="start-btn"
                  onClick={onStart}
                >
                  Start
                </button>

              ) : (

                <>

                  {/* CALL */}

                  <a
                    className="mini-ic"
                    href={
                      canCall
                        ? `tel:${farmerPhone}`
                        : undefined
                    }
                  >
                    <img
                      src={call}
                      style={{
                        width: 25,
                      }}
                    />
                  </a>


                  {/* COMPLETE */}

                  <button
                    className="mini-ic"
                    disabled={
                      !canComplete
                    }
                    onClick={onComplete}
                  >
                    <img
                      src={complete}
                      style={{
                        width: 25,
                      }}
                    />
                  </button>


                  {/* CANCEL */}

                  <button
                    className="mini-ic danger"
                    onClick={onCancel}
                  >
                    <img
                      src={cancel}
                      style={{
                        width: 25,
                      }}
                    />
                  </button>

                </>

              )}

            </div>

          </div>



          {/* PROGRESS */}

          <div className="ongoing-bar">

            <div className="bar-labels">

              <span
                className={
                  step === 0
                    ? "active"
                    : ""
                }
              >
                {STEP_LABELS[0]}
              </span>

              <span
                className={
                  step === 1
                    ? "active"
                    : ""
                }
              >
                {STEP_LABELS[1]}
              </span>

              <span
                className={
                  step === 2
                    ? "active"
                    : ""
                }
              >
                {STEP_LABELS[2]}
              </span>

            </div>


            <div className="progress">

              <div
                className={`dot ${
                  step >= 0
                    ? "on"
                    : ""
                }`}
              />

              <div className="line" />

              <div
                className={`dot ${
                  step >= 1
                    ? "on"
                    : ""
                }`}
              />

              <div className="line" />

              <div
                className={`dot ${
                  step >= 2
                    ? "on"
                    : ""
                }`}
              />

            </div>

          </div>

        </div>

      );

    });

  }, [rows, loading, err]);


  return (

    <div className="card-block">

      <div className="block-head">

        <div className="block-title">
          Ongoing requests
        </div>

        <div
          className="info"
          onClick={fetchOngoing}
        >
          ⓘ
        </div>

      </div>


      <div className="ongoing-list">
        {content}
      </div>

    </div>

  );

}
