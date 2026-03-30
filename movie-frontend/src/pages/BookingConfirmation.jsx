import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./BookingConfirmation.css";

function BookingConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();

  const { booking, selectedSeats, totalPrice } = location.state || {};

  if (!booking) {
    return <div className="booking-confirmation-error">No booking found</div>;
  }

  return (
    <div className="booking-confirmation-page">
      <Navbar />

      <div className="booking-confirmation-container">
        <div className="confirmation-card">
          <div className="confirmation-icon">🎉</div>

          <h1 className="confirmation-title">Booking Confirmed</h1>

          <p className="confirmation-subtitle">
            Payment successful. Your seats are now officially booked.
          </p>

          <div className="confirmation-details">
            <div className="confirmation-row">
              <span className="confirmation-label">Booking ID</span>
              <span className="confirmation-value">{booking.id}</span>
            </div>

            <div className="confirmation-row">
              <span className="confirmation-label">Total Paid</span>
              <span className="confirmation-value">₹{totalPrice}</span>
            </div>

            <div style={{ marginTop: "18px" }}>
              <span className="confirmation-label">Seats</span>
              <div className="seat-pill-wrap">
                {selectedSeats.map((seat) => (
                  <span key={seat} className="seat-pill">
                    {seat}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="confirmation-actions">
            <button
              onClick={() => navigate("/movies")}
              className="secondary-action-btn"
            >
              Book Another Movie
            </button>

            <button
              onClick={() => navigate("/my-bookings")}
              className="secondary-action-btn"
            >
              View My Bookings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingConfirmation;
