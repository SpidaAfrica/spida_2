import BookingColumn from "./BookingColumn";

const columns = [
  {
    title: "January 20-26",
    items: [
      { id: "Req02837", farmers: "3 Farmer", location: "12 Banana Street, Lekki, Lagos, Nigeria (6.4423° N, 3.3892° E)", service: "Ploughing", tag: "January 20 - 21", time: "08:00 AM - 5:00 PM" },
      { id: "Req02837", farmers: "3 Farmer", location: "12 Banana Street, Lekki, Lagos, Nigeria (6.4423° N, 3.3892° E)", service: "Ploughing", tag: "January 20 - 21", time: "08:00 AM - 5:00 PM" },
      { id: "Req02837", farmers: "3 Farmer", location: "12 Banana Street, Lekki, Lagos, Nigeria (6.4423° N, 3.3892° E)", service: "Ploughing", tag: "January 20 - 21", time: "08:00 AM - 5:00 PM" },
    ],
  },
  {
    title: "January 27-February 2",
    items: [
      { id: "Req02837", farmers: "3 Farmer", location: "12 Banana Street, Lekki, Lagos, Nigeria (6.4423° N, 3.3892° E)", service: "Ploughing", tag: "January 20 - 21", time: "08:00 AM - 5:00 PM" },
      { id: "Req02837", farmers: "3 Farmer", location: "12 Banana Street, Lekki, Lagos, Nigeria (6.4423° N, 3.3892° E)", service: "Ploughing", tag: "January 20 - 21", time: "08:00 AM - 5:00 PM" },
      { id: "Req02837", farmers: "3 Farmer", location: "12 Banana Street, Lekki, Lagos, Nigeria (6.4423° N, 3.3892° E)", service: "Ploughing", tag: "January 20 - 21", time: "08:00 AM - 5:00 PM" },
    ],
  },
  {
    title: "February 3-9",
    items: [
      { id: "Req02837", farmers: "3 Farmer", location: "12 Banana Street, Lekki, Lagos, Nigeria (6.4423° N, 3.3892° E)", service: "Ploughing", tag: "January 20 - 21", time: "08:00 AM - 5:00 PM" },
      { id: "Req02837", farmers: "3 Farmer", location: "12 Banana Street, Lekki, Lagos, Nigeria (6.4423° N, 3.3892° E)", service: "Ploughing", tag: "January 20 - 21", time: "08:00 AM - 5:00 PM" },
    ],
  },
  {
    title: "February 10-16",
    items: [
      { id: "Req02837", farmers: "3 Farmer", location: "12 Banana Street, Lekki, Lagos, Nigeria (6.4423° N, 3.3892° E)", service: "Ploughing", tag: "January 20 - 21", time: "08:00 AM - 5:00 PM" },
      { id: "Req02837", farmers: "3 Farmer", location: "12 Banana Street, Lekki, Lagos, Nigeria (6.4423° N, 3.3892° E)", service: "Ploughing", tag: "January 20 - 21", time: "08:00 AM - 5:00 PM" },
      { id: "Req02837", farmers: "3 Farmer", location: "12 Banana Street, Lekki, Lagos, Nigeria (6.4423° N, 3.3892° E)", service: "Ploughing", tag: "January 20 - 21", time: "08:00 AM - 5:00 PM" },
      { id: "Req02837", farmers: "3 Farmer", location: "12 Banana Street, Lekki, Lagos, Nigeria (6.4423° N, 3.3892° E)", service: "Ploughing", tag: "January 20 - 21", time: "08:00 AM - 5:00 PM" },
    ],
  },
];

export default function BookingBoard() {
  return (
    <div className="bk-board">
      {columns.map((c) => (
        <BookingColumn key={c.title} title={c.title} items={c.items} />
      ))}
    </div>
  );
}
