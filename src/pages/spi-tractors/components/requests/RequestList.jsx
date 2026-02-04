import RequestCard from "./RequestCard";

const requests = [
  {
    id: "Req4567",
    farmersCount: "3 Farmers",
    farmers: ["Richard Okoye", "Wasiu Alabi", "Wasiu Alabi"],
    service: "Ploughing",
    farmName: "Green Valley Farms",
    farmLocation:
      "Green Valley Farms, 12 Banana Street, Lekki, Lagos, Nigeria (6.4423° N, 3.3892° E)",
    farmSize: "10 acres",
    preferredDates: "January Saturday 25th – Thursday 30th",
    timeRange: "08:00 AM to 09:00 PM",
    paymentMethod: "Spida Wallet",
    totalAmount: "₦100,000",
  },
  {
    id: "Req7841",
    farmersCount: "1 Farmer",
    farmers: ["Dada Dimeji"],
    service: "Ploughing",
    farmName: "Green Valley Farms",
    farmLocation:
      "Green Valley Farms, 12 Banana Street, Lekki, Lagos, Nigeria (6.4423° N, 3.3892° E)",
    farmSize: "10 acres",
    preferredDates: "January Saturday 25th – Thursday 30th",
    timeRange: "08:00 AM to 09:00 PM",
    paymentMethod: "Spida Wallet",
    totalAmount: "₦100,000",
  },
];

export default function RequestList() {
  return (
    <div className="req-list-wrap">
      <div className="req-list-top">
        <div className="req-list-title">
          <span>New Request</span>
          <span className="req-info">ⓘ</span>
        </div>

        <div className="req-list-actions">
          <div className="req-search">
            <input placeholder="Search" />
            <span className="req-search-ic">🔎</span>
          </div>

          <div className="req-new-badge">135 New Job request</div>
        </div>
      </div>

      <div className="req-list">
        {requests.map((r) => (
          <RequestCard key={r.id} data={r} />
        ))}
      </div>
    </div>
  );
}
