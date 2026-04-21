import { useEffect, useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import RequestsStats from "../components/requests/RequestsStats";
import OngoingRequests from "../components/dashboard/OngoingRequest";
import JobRequestPanel from "../components/dashboard/JobRequestPanel";
import Upcoming from "../components/dashboard/Upcoming";
import EarningsOverview from "../components/dashboard/EarningsOverview";
import StatCards from "../components/dashboard/StatCard";
import SplashScreen from "../SplashScreen";
import "./dashboard.css";
import "../SplashScreen.css";
import { clearSession, getCurrentUser, spiTractorsApi } from "../api/spiTractorsApi";
import { useNavigate } from "react-router-dom";

const SPLASH_SHOWN_KEY = "spidaSplashShown";

export default function SpiTractorDashboard() {
  const navigate = useNavigate();

  // Show splash only on first visit per session
  const [showSplash, setShowSplash] = useState(
    () => !sessionStorage.getItem(SPLASH_SHOWN_KEY)
  );

  const [userEmail, setUserEmail] = useState(() => {
    const u = getCurrentUser();
    return u?.email || "";
  });

  const [todayLabel, setTodayLabel] = useState("");
  const [greeting,   setGreeting]   = useState("Good Morning");

  const onSplashDone = () => {
    sessionStorage.setItem(SPLASH_SHOWN_KEY, "1");
    setShowSplash(false);
  };

  useEffect(() => {
    const update = () => {
      const h = new Date().getHours();
      setGreeting(h < 12 ? "Good Morning" : h < 17 ? "Good Afternoon" : "Good Evening");
      setTodayLabel(
        new Date().toLocaleDateString("en-US", {
          weekday: "long", year: "numeric", month: "long", day: "numeric",
        })
      );
    };
    update();
    const t = setInterval(update, 60000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("spiTractorsToken") || "";
    if (!token) { navigate("/Spi_Tractors_Login/", { replace: true }); return; }

    spiTractorsApi.me()
      .then((res) => { if (res?.data?.email) setUserEmail(res.data.email); })
      .catch((err) => {
        const msg = String(err?.message || "").toLowerCase();
        if (msg.includes("unauthorized") || msg.includes("session expired")) {
          clearSession();
          navigate("/Spi_Tractors_Login/", { replace: true });
        }
      });
  }, [navigate]);

  return (
    <>
      {showSplash && <SplashScreen onDone={onSplashDone} />}

      <div className="dash-shell">
        <Sidebar />

        <main className="dash-main">
          <Topbar />

          <div className="dash-content">
            <div className="dash-head">
              <div>
                <h1 className="dash-title">
                  {greeting}, {String(userEmail).split("@")[0]}! <span className="wave">👋</span>
                </h1>

                <div className="dash-filters">
                  <button className="chip">Today <span className="chev">▾</span></button>
                  <button className="chip">{todayLabel} <span className="chev">▾</span></button>
                </div>
              </div>
            </div>

            <StatCards />

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
    </>
  );
}
