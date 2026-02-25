import { useEffect, useMemo, useState } from "react";
import "./upcoming.css";
import { spiTractorsApi } from "../../api/spiTractorsApi";

function prettyService(s) {
  const v = String(s || "").toLowerCase();
  return v ? v[0].toUpperCase() + v.slice(1) : "-";
}

function formatDateParts(dateStr) {
  // dateStr: YYYY-MM-DD (preferred_date)
  if (!dateStr) return { date: "--", month: "--", full: "No date set" };
  const d = new Date(dateStr + "T00:00:00");
  const day = String(d.getDate()).padStart(2, "0");
  const mon = d.toLocaleString(undefined, { month: "short" }); // e.g. Feb
  const full = d.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return { date: day, month: mon, full };
}

export default function Upcoming() {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");

  const fetchUpcoming = async () => {
    try {
      setErr("");
      setLoading(true);
      const res = await spiTractorsApi.ownerUpcoming(); // /dashboard_owner_upcoming.php
      setRows(Array.isArray(res?.data) ? res.data : []);
    } catch (e) {
      setErr(e?.message || "Unable to load upcoming jobs");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpcoming();
    const t = setInterval(fetchUpcoming, 15000);
    return () => clearInterval(t);
  }, []);

  const content = useMemo(() => {
    if (loading && rows.length === 0) return <div className="up-empty">Loading...</div>;
    if (err) return <div className="up-empty">{err}</div>;
    if (!rows.length) return <div className="up-empty">No upcoming jobs yet.</div>;

    return (
      <div className="up-grid">
        {rows.map((x) => {
          const dp = formatDateParts(x.preferred_date);

          return (
            <div className="up-card" key={x.request_id}>
              <div className="up-date">
                <div className="d">{dp.date}</div>
                <div className="m">{dp.month}</div>
              </div>

              <div className="up-body">
                <div className="t">{x.farm_address || "-"}</div>
                <div className="s">
                  {prettyService(x.service)} • {x.farm_city || "-"}
                </div>

                <div className="tm">
                  {dp.full} {x.time_window ? `• ${x.time_window}` : ""}
                </div>

                <button
                  className="stat-link"
                  type="button"
                  onClick={() =>
                    alert(
                      `Request: ${x.request_code}\nFarmer: ${x.full_name}\nFarm: ${x.farm_name}\nService: ${x.service}\nDate: ${x.preferred_date || "-"}`
                    )
                  }
                >
                  See full details
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  }, [rows, loading, err]);

  const todayLabel = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="card-block">
      <div className="up-head">
        <div className="block-title">Upcoming</div>

        <div className="up-controls">
          <button className="chip small" type="button" onClick={fetchUpcoming}>
            Refresh ▾
          </button>
          <button className="chip small" type="button">
            {todayLabel} ▾
          </button>
        </div>
      </div>

      {content}
    </div>
  );
}
