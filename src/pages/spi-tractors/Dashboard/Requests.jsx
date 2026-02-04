import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";

import RequestsHeader from "../components/requests/RequestsHeader";
import RequestsStats from "../components/requests/RequestsStats";
import RequestList from "../components/requests/RequestList";

import "./Request.css";

export default function SpiTractorsRequests() {
  return (
    <div className="req-shell">
      <Sidebar />

      <main className="req-main">
        <Topbar />

        <div className="req-content">
          <RequestsHeader />
          <RequestsStats />
          <RequestList />
        </div>
      </main>
    </div>
  );
}
