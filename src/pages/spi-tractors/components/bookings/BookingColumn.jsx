import BookingCard from "./BookingCard";

export default function BookingColumn({ title, items }) {
  return (
    <section className="bk-col">
      <div className="bk-col-head">
        <div className="bk-col-title">{title}</div>
        <button className="bk-plus" title="Add booking">
          +
        </button>
      </div>

      <div className="bk-col-body">
        {items.map((x, i) => (
          <BookingCard key={`${x.id}-${i}`} data={x} />
        ))}
      </div>
    </section>
  );
}
