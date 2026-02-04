import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";

import BookingsHeader from "../components/bookings/BookingsHeader";
import BookingBoard from "../components/bookings/BookingBoard";

import "./Bookings.css";

export default function SpiTractorBookings() {
  return (
    <div className="bk-shell">
      <Sidebar />

      <main className="bk-main">
        <Topbar />

        <div className="bk-content">
          <BookingsHeader />
          <BookingBoard />
        </div>
      </main>
    </div>
  );
}
