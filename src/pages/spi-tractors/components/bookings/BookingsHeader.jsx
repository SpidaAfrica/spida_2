export default function BookingsHeader() {
    return (
      <div className="bk-header">
        <h1 className="bk-title">Bookings</h1>
  
        <div className="bk-controls">
          <div className="bk-filters">
            <button className="bk-chip">
              Week <span className="bk-chev">▾</span>
            </button>
  
            <button className="bk-chip">
              January 20-26 - February 10-16 <span className="bk-chev">▾</span>
            </button>
          </div>
  
          <button className="bk-action">
            <span className="bk-gear">⚙</span>
            Set Operation Hours
          </button>
        </div>
      </div>
    );
  }
  