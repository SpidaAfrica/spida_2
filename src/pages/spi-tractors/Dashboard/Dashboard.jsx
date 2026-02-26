import { useEffect, useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import RequestsStats from "../components/requests/RequestsStats";
import OngoingRequests from "../components/dashboard/OngoingRequest";
import RequestList from "../components/requests/RequestList";
import Upcoming from "../components/dashboard/Upcoming";
import EarningsOverview from "../components/dashboard/EarningsOverview";
import "./dashboard.css";
import { clearSession, getCurrentUser, spiTractorsApi } from "../api/spiTractorsApi";
import { useNavigate } from "react-router-dom";

export default function SpiTractorDashboard() {
  const navigate = useNavigate();

  const [userEmail, setUserEmail] = useState(() => {
    const u = getCurrentUser();
    return u?.email || "Sanusi";
  });

  useEffect(() => {
    const token = localStorage.getItem("spiTractorsToken") || "";

    // if no token, send user to login (or request)
    if (!token) {
      navigate("/Spi_Tractors_Login/", { replace: true });
      return;
    }

    spiTractorsApi
      .me()
      .then((res) => {
        const email = res?.data?.email;
        if (email) setUserEmail(email);
      })
      .catch((err) => {
        // ✅ Only clear session if backend actually says Unauthorized
        const msg = String(err?.message || "");
        const isUnauthorized =
          msg.toLowerCase().includes("unauthorized") ||
          msg.toLowerCase().includes("missing authorization") ||
          msg.toLowerCase().includes("session expired");

        if (isUnauthorized) {
          clearSession();
          navigate("/Spi_Tractors_Login/", { replace: true });
          return;
        }

        // ❌ don't clear session on random failures
        console.log("me() failed but session kept:", err);
      });
  }, [navigate]);

  return (
    <div className="dash-shell">
      <Sidebar />

      <main className="dash-main">
        <Topbar />

        <div className="dash-content">
          <div className="dash-head">
            <div>
              <h1 className="dash-title">
                Good Morning, {String(userEmail).split("@")[0]}!{" "}
                <span className="wave">👋</span>
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
          </div>

          <div className="dash-grid">
            <section className="dash-left">
              <RequestsStats />
              <OngoingRequests />
              <Upcoming />
              <EarningsOverview />
            </section>

            <aside className="dash-right">
              <RequestList />
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
