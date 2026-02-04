import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";

import EarningsHeader from "../components/earnings/EarningsHeader";
import EarningsSummary from "../components/earnings/EarningsSummary";
import EarningsTable from "../components/earnings/EarningsTable";

import "./Earnings.css";

export default function SpiTractorEarnings() {
  return (
    <div className="er-shell">
      <Sidebar />

      <main className="er-main">
        <Topbar />

        <div className="er-content">
          <EarningsHeader />
          <EarningsSummary />
          <EarningsTable />
        </div>
      </main>
    </div>
  );
}
