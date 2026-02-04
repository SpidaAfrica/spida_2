import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import StatCards from "../components/dashboard/StatCard";
import OngoingRequests from "../components/dashboard/OngoingRequest";
import JobRequestPanel from "../components/dashboard/JobRequestPanel";
import Upcoming from "../components/dashboard/Upcoming";
import EarningsOverview from "../components/dashboard/EarningsOverview";
import "./dashboard.css";

export default function SpiTractorDashboard() {
  return (
    <div className="dash-shell">
      <Sidebar />

      <main className="dash-main">
        <Topbar />

        <div className="dash-content">
          {/* Header + filters + search */}
          <div className="dash-head">
            <div>
              <h1 className="dash-title">
                Good Morning, Sanusi! <span className="wave">👋</span>
              </h1>

              <div className="dash-filters">
                <button className="chip">
                  Today <span className="chev">▾</span>
                </button>
                <button className="chip">
                  Thursday, August 22, 2024 <span className="chev">▾</span>
                </button>
              </div>
            </div>

            <div className="dash-search">
              <input placeholder="Search" />
              <span className="search-ic">🔎</span>
            </div>
          </div>

          {/* Grid layout like the design */}
          <div className="dash-grid">
            {/* LEFT */}
            <section className="dash-left">
              <StatCards />
              <OngoingRequests />
              <Upcoming />
              <EarningsOverview />
            </section>

            {/* RIGHT */}
            <aside className="dash-right">
              <JobRequestPanel />
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
