import { useEffect, useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import RequestsStats from "../components/requests/RequestsStats";
import OngoingRequests from "../components/dashboard/OngoingRequest";
import JobRequestPanel from "../components/dashboard/JobRequestPanel";
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

  const [todayLabel, setTodayLabel] = useState("");
  const [greeting, setGreeting] = useState("Good Morning");

  // 🔥 Handle greeting + date
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const hours = now.getHours();

      // Greeting logic
      if (hours < 12) setGreeting("Good Morning");
      else if (hours < 17) setGreeting("Good Afternoon");
      else setGreeting("Good Evening");

      // Date formatting
      setTodayLabel(
        now.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      );
    };

    updateDateTime();

    // Update every minute (handles midnight rollover)
    const interval = setInterval(updateDateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // 🔥 Session validation
  useEffect(() => {
    const token = localStorage.getItem("spiTractorsToken") || "";

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
        const msg = String(err?.message || "").toLowerCase();
        const isUnauthorized =
          msg.includes("unauthorized") ||
          msg.includes("missing authorization") ||
          msg.includes("session expired");

        if (isUnauthorized) {
          clearSession();
          navigate("/Spi_Tractors_Login/", { replace: true });
        } else {
          console.log("me() failed but session kept:", err);
        }
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
                {greeting},{" "}
                {String(userEmail).split("@")[0]}!{" "}
                <span className="wave">👋</span>
              </h1>

              <div className="dash-filters">
                <button className="chip">
                  Today <span className="chev">▾</span>
                </button>

                <button className="chip">
                  {todayLabel} <span className="chev">▾</span>
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
              <JobRequestPanel />
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
