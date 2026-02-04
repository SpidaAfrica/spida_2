export default function EquipmentHeader() {
    return (
      <div className="eq-header">
        <h1 className="eq-title">Manage Equipment</h1>
  
        <div className="eq-controls">
          <div className="eq-filters">
            <button className="eq-chip">
              Week <span className="eq-chev">▾</span>
            </button>
            <button className="eq-chip">
              January 20-26 - February 10-16 <span className="eq-chev">▾</span>
            </button>
          </div>
  
          <button className="eq-action">
            <span className="eq-gear">⚙</span> Add New Equipment
          </button>
        </div>
      </div>
    );
  }
  