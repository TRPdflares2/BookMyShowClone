function Seat({ seat }) {
  return <button>{seat?.seatNumber || "A1"}</button>;
}

export default Seat;
