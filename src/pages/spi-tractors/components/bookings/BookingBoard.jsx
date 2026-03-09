import { useEffect, useMemo, useState } from "react";
import BookingColumn from "./BookingColumn";
import { spiTractorsApi } from "../../api/spiTractorsApi";

export default function BookingBoard() {
  const [loading, setLoading] = useState(false);
  const [columns, setColumns] = useState([]);
  const [err, setErr] = useState("");

  const load = async () => {
    try {
      setErr("");
      setLoading(true);
      const res = await spiTractorsApi.ownerUpcomingBookings();
      setColumns(Array.isArray(res?.data?.columns) ? res.data.columns : []);
    } catch (e) {
      setErr(e?.message || "Unable to load bookings");
      setColumns([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const content = useMemo(() => {
    if (loading && columns.length === 0) return <div style={{ padding: 12 }}>Loading...</div>;
    if (err) return <div style={{ padding: 12 }}>{err}</div>;
    if (!columns.length) return <div style={{ padding: 12 }}>No upcoming bookings.</div>;

    return columns.map((c) => (
      <BookingColumn key={c.title} title={c.title} items={c.items || []} />
    ));
  }, [loading, err, columns]);

  return <div className="bk-board">{content}</div>;
}
