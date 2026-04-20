/* BookingsHeader.jsx
   Shows the real current week label and the accurate 4-week window
   that matches exactly what the backend (dashboard_owner_bookings.php) returns.
   Backend uses: current Monday → +28 days (4 weeks).                        */

function getMondayOfWeek(date) {
  const d   = new Date(date);
  const day = d.getDay(); // 0 = Sun, 1 = Mon …
  const diff = day === 0 ? -6 : 1 - day; // shift to Monday
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatShort(date) {
  // e.g. "Apr 21"
  return date.toLocaleDateString("en-NG", { month: "short", day: "numeric" });
}

function formatWeekLabel(date) {
  // e.g. "Week of Apr 21"
  return "Week of " + formatShort(date);
}

export default function BookingsHeader() {
  const today     = new Date();
  const weekStart = getMondayOfWeek(today);

  // 4-week window: Monday this week → Sunday 4 weeks later
  const windowEnd = new Date(weekStart);
  windowEnd.setDate(weekStart.getDate() + 27); // +27 days = end of week 4

  const weekLabel  = formatWeekLabel(weekStart);              // "Week of Apr 21"
  const rangeLabel = `${formatShort(weekStart)} – ${formatShort(windowEnd)}`; // "Apr 21 – May 18"

  return (
    <div className="bk-header">
      <h1 className="bk-title">Bookings</h1>

      <div className="bk-controls">
        <div className="bk-filters">
          <button className="bk-chip" type="button">
            {weekLabel} <span className="bk-chev">▾</span>
          </button>

          <button className="bk-chip" type="button">
            {rangeLabel} <span className="bk-chev">▾</span>
          </button>
        </div>
      </div>
    </div>
  );
}
