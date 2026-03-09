import BookingCard from "./BookingCard";
import plus from "../../../../assets/images/plus.png";
export default function BookingColumn({ title, items }) {
  return (
    <section className="bk-col">
      <div className="bk-col-head">
        <div className="bk-col-title">{title}</div>
        <img src={plus} style={{width: "25px"}} title="Add booking"/>
      </div>

      <div className="bk-col-body">
        {items.map((x, i) => (
          <BookingCard key={`${x.id}-${i}`} data={x} />
        ))}
      </div>
    </section>
  );
}
