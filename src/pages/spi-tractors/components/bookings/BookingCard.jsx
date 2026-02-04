export default function BookingCard({ data }) {
    return (
      <div className="bk-card">
        <div className="bk-card-top">
          <div>
            <div className="bk-id">{data.id}</div>
            <div className="bk-mini">{data.farmers}</div>
          </div>
  
          <button className="bk-dots" title="More">
            ⋮
          </button>
        </div>
  
        <div className="bk-loc">{data.location}</div>
        <div className="bk-service">{data.service}</div>
  
        <div className="bk-tag">{data.tag}</div>
        <div className="bk-time">{data.time}</div>
      </div>
    );
  }
  