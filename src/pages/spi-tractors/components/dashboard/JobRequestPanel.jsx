import "./jobpanel.css";

export default function JobRequestPanel() {
  return (
    <div className="jobpanel">
      <div className="jobpanel-head">
        <div>
          <div className="jobpanel-title">Job Request</div>
          <div className="jobpanel-sub">Req4567</div>
        </div>
        <div className="jobpanel-badge">135 New Job request</div>
      </div>

      <div className="mapbox">
        {/* Map placeholder (replace with Google Maps later) */}
        <div className="map-skeleton">Map Preview</div>
      </div>

      <div className="job-meta">
        <div className="row">
          <span className="k">Farm Name</span>
          <span className="v">Green Valley Farms, 12 Banana Street, Lekki, Lagos, Nigeria</span>
        </div>
        <div className="row">
          <span className="k">Service Needed</span>
          <span className="v">Ploughing</span>
        </div>
        <div className="row two">
          <div>
            <div className="k">Payment method</div>
            <div className="v">Spida wallet</div>
          </div>
          <div>
            <div className="k">Total Amount</div>
            <div className="v">₦100,000</div>
          </div>
        </div>
      </div>

      <div className="jobpanel-actions">
        <button className="accept">Accept</button>
        <button className="decline">Decline</button>
      </div>
    </div>
  );
}
