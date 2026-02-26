export default function RequestCard({ data }) {
    return (
      <div className="req-card">
        {/* Map */}
        <div className="req-map">
          <div className="req-map-skeleton">Map Preview</div>
        </div>
  
        {/* Details */}
        <div className="req-details">
          <div className="req-details-head">
            <div>
              <div className="req-id">{data.id}</div>
              <div className="req-small">{data.farmersCount}</div>
            </div>
  
            <div className="req-contact">
              <button className="req-ic" title="Call">📞</button>
            </div>
          </div>
  
          <div className="req-grid">
            <div className="req-field">
              <div className="req-k">Farm Name</div>
              <div className="req-people">
                {data.farmers.map((n, i) => (
                  <span className="req-person" key={i}>
                    <span className="req-pic">{n[0]}</span>
                    {n}
                  </span>
                ))}
              </div>
            </div>
  
            <div className="req-field">
              <div className="req-k">Farm Location</div>
              <div className="req-v">{data.farmLocation}</div>
            </div>
  
            <div className="req-field">
              <div className="req-k">Service Needed</div>
              <div className="req-v strong">{data.service}</div>
  
              <div className="req-k mt">Preferred Date Range</div>
              <div className="req-v">{data.preferredDates}</div>
              <div className="req-v">{data.timeRange}</div>
            </div>
  
            <div className="req-field">
              <div className="req-k">Farm Size</div>
              <div className="req-v">{data.farmSize}</div>
            </div>
          </div>
  
          <div className="req-divider" />
  
          <div className="req-pay-row">
            <div>
              <div className="req-k">Payment method</div>
              <div className="req-v">{data.paymentMethod}</div>
            </div>
  
            <div>
              <div className="req-k">Total Amount</div>
              <div className="req-v">{data.totalAmount}</div>
            </div>
          </div>
  
          <div className="req-actions">
            <button className="req-accept">Accept</button>
            <button className="req-decline">Decline</button>
          </div>
        </div>
      </div>
    );
  }
  
