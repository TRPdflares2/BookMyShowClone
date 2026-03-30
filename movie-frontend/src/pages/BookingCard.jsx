function BookingCard({ booking }) {
  return (
    <div>
      <h3>Booking</h3>
      <p>{booking?.id}</p>
    </div>
  );
}

export default BookingCard;
