import { useEffect, useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import StatCards from "../components/dashboard/StatCard";
import OngoingRequests from "../components/dashboard/OngoingRequest";
import JobRequestPanel from "../components/dashboard/JobRequestPanel";
import Upcoming from "../components/dashboard/Upcoming";
import EarningsOverview from "../components/dashboard/EarningsOverview";
import "./dashboard.css";
import { clearSession, spiTractorsApi } from "../api/spiTractorsApi";

export default function SpiTractorDashboard() {
  const [userEmail, setUserEmail] = useState("Sanusi");

  useEffect(() => {
    spiTractorsApi
      .me()
      .then((res) => setUserEmail(res?.data?.email || "Sanusi"))
      .catch(() => {
        clearSession();
      });
  }, []);

  return (
    <div className="dash-shell">
      <Sidebar />

      <main className="dash-main">
        <Topbar />

        <div className="dash-content">
          <div className="dash-head">
            <div>
              <h1 className="dash-title">Good Morning, {userEmail.split("@")[0]}! <span className="wave">👋</span></h1>

              <div className="dash-filters">
                <button className="chip">Today <span className="chev">▾</span></button>
                <button className="chip">Thursday, August 22, 2024 <span className="chev">▾</span></button>
              </div>
            </div>

            <div className="dash-search">
              <input placeholder="Search" />
              <span className="search-ic">🔎</span>
            </div>
          </div>

          <div className="dash-grid">
            <section className="dash-left">
              <StatCards />
              <OngoingRequests />
              <Upcoming />
              <EarningsOverview />
            </section>

            <aside className="dash-right">
              <JobRequestPanel />
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
