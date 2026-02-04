import "./ongoing.css";

const data = [
  {
    name: "Richard Okoye",
    farm: "Green Valley Farms",
    service: "Ploughing",
    status: "Tractor Travel",
    eta: "Estimated Arrival Time: 05:45am",
    depart: "Departure Time: 05:45am",
    action: "icons",
  },
  {
    name: "Jame Bomodeoku",
    farm: "Blue Sky Meadows",
    service: "Harvesting",
    status: "Task Execution",
    eta: "",
    depart: "",
    action: "start",
  },
  {
    name: "Jame Bomodeoku",
    farm: "Blue Sky Meadows",
    service: "Harvesting",
    status: "Task Execution",
    eta: "",
    depart: "",
    action: "start",
  },
];

export default function OngoingRequests() {
  return (
    <div className="card-block">
      <div className="block-head">
        <div className="block-title">Ongoing requests</div>
        <div className="info">ⓘ</div>
      </div>

      <div className="ongoing-list">
        {data.map((x, idx) => (
          <div className="ongoing-item" key={idx}>
            <div className="ongoing-top">
              <div className="ongoing-user">
                <div className="avatar-sm">{x.name[0]}</div>
                <div>
                  <div className="name">{x.name}</div>
                  <div className="meta">
                    Farm Name: <span>{x.farm}</span> &nbsp; Service Needed:{" "}
                    <span>{x.service}</span>
                  </div>
                </div>
              </div>

              <div className="ongoing-actions">
                {x.action === "icons" ? (
                  <>
                    <button className="mini-ic" title="Call">📞</button>
                    <button className="mini-ic" title="Chat">💬</button>
                    <button className="mini-ic danger" title="Cancel">✖</button>
                  </>
                ) : (
                  <button className="start-btn">Start Request</button>
                )}
              </div>
            </div>

            <div className="ongoing-bar">
              <div className="bar-labels">
                <span className="active">{x.status}</span>
                <span>Task Execution</span>
                <span>Payment</span>
              </div>
              <div className="progress">
                <div className="dot on" />
                <div className="line" />
                <div className="dot" />
                <div className="line" />
                <div className="dot" />
              </div>

              <div className="bar-foot">
                <span>{x.depart}</span>
                <span>{x.eta}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
