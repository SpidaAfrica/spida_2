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
              January 01-26 - March 31-26 <span className="bk-chev">▾</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
  
