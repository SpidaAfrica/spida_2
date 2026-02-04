export default function RequestsHeader() {
    return (
      <div className="req-header">
        <h1 className="req-title">Job Requests</h1>
  
        <div className="req-filters">
          <button className="req-chip">
            Today <span className="req-chev">▾</span>
          </button>
  
          <button className="req-chip">
            Thursday, August 22, 2024 <span className="req-chev">▾</span>
          </button>
        </div>
      </div>
    );
  }
  