import { useState } from "react";

export default function RequestsHeader() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const formatFullDate = (date) => {
    return date.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const handleDateChange = (e) => {
    const value = e.target.value;
    if (value) {
      setSelectedDate(new Date(value));
    }
  };

  return (
    <div className="req-header">
      <h1 className="req-title">Job Requests</h1>

      <div className="req-filters">
        {/* Today Chip */}
        <button
          className="req-chip"
          onClick={() => setSelectedDate(new Date())}
        >
          Today <span className="req-chev">▾</span>
        </button>

        {/* Date Picker Chip */}
        <label className="req-chip" style={{ cursor: "pointer" }}>
          {formatFullDate(selectedDate)}
          <span className="req-chev">▾</span>

          <input
            type="date"
            onChange={handleDateChange}
            style={{
              position: "absolute",
              opacity: 0,
              pointerEvents: "none",
            }}
          />
        </label>
      </div>
    </div>
  );
}
