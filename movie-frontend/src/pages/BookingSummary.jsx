import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createBooking, confirmBooking } from "../api/bookingApi";
import { releaseSeats } from "../api/reservationApi";
import Navbar from "../components/Navbar";
import "./BookingSummary.css";

function BookingSummary() {
  const location = useLocation();
  const navigate = useNavigate();

  const { showtimeId, selectedSeats, expiresAt } = location.state || {};
  const [timeLeft, setTimeLeft] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);

  const getSeatPrice = (seatId) => {
    const row = seatId[0];

    if (row === "A") return 600; // Recliner
    if (row === "B") return 350; // Gold
    return 250; // Silver (C, D)
  };

  const totalPrice = (selectedSeats || []).reduce(
    (sum, seat) => sum + getSeatPrice(seat),
    0,
  );

  useEffect(() => {
    if (!expiresAt || !selectedSeats || selectedSeats.length === 0) return;

    const interval = setInterval(async () => {
      const now = new Date().getTime();
      const expiry = new Date(expiresAt).getTime();
      const diff = expiry - now;

      if (diff <= 0) {
        clearInterval(interval);

        const formattedSeats = selectedSeats.map((seat) => ({
          row: seat[0],
          number: Number(seat.slice(1)),
        }));

        try {
          await releaseSeats({
            showtimeId: Number(showtimeId),
            seats: formattedSeats,
          });
        } catch (err) {
          console.error("Auto release failed:", err);
        }

        alert("Seat lock expired");
        navigate("/movies");
        return;
      }

      const minutes = Math.floor(diff / 1000 / 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft(`${minutes}:${seconds.toString().padStart(2, "0")}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, selectedSeats, showtimeId, navigate]);

  const handlePaymentSuccess = async () => {
    const formattedSeats = selectedSeats.map((seat) => ({
      row: seat[0],
      number: Number(seat.slice(1)),
    }));

    try {
      setLoadingPayment(true);

      const payload = {
        showtimeId: Number(showtimeId),
        totalAmount: totalPrice,
        seats: formattedSeats,
      };

      console.log("Create booking payload:", payload);

      const createRes = await createBooking(payload);
      const bookingId = createRes.data.booking.id;

      console.log("Created booking ID:", bookingId);

      await confirmBooking({ bookingId });

      navigate("/booking-confirmation", {
        state: {
          booking: createRes.data.booking,
          selectedSeats,
          totalPrice,
        },
      });
    } catch (error) {
      console.error(
        "Payment/booking error:",
        error.response?.data || error.message,
      );

      await releaseSeats({
        showtimeId: Number(showtimeId),
        seats: formattedSeats,
      });

      alert(
        "Payment failed or booking could not be completed. Seats released.",
      );
    } finally {
      setLoadingPayment(false);
      setShowPaymentModal(false);
    }
  };

  const handleCancelBooking = async () => {
    try {
      const formattedSeats = selectedSeats.map((seat) => ({
        row: seat[0],
        number: Number(seat.slice(1)),
      }));

      await releaseSeats({
        showtimeId: Number(showtimeId),
        seats: formattedSeats,
      });

      navigate("/movies");
    } catch (error) {
      console.error("Release error:", error.response?.data || error.message);
      alert("Failed to release seats");
    }
  };

  if (!selectedSeats || selectedSeats.length === 0) {
    return <div className="booking-summary-error">No seats selected</div>;
  }

  return (
    <div className="booking-summary-page">
      <Navbar />

      <div className="booking-summary-container">
        <div className="booking-summary-header">
          <h1 className="booking-summary-title">Booking Summary</h1>
          <p className="booking-summary-subtitle">
            Review your selected seats before payment.
          </p>
        </div>

        <div className="booking-summary-card">
          <div className="timer-box">
            <p className="timer-label">⏳ Seat Lock Expires In</p>
            <h2 className="timer-value">{timeLeft}</h2>
          </div>

          <div className="summary-section">
            <h3 className="summary-section-title">Show Details</h3>

            <div className="summary-row">
              <span className="summary-label">Showtime ID</span>
              <span className="summary-value">{showtimeId}</span>
            </div>
          </div>

          <div className="summary-section">
            <h3 className="summary-section-title">Selected Seats</h3>

            <div className="seat-pill-wrap">
              {selectedSeats.map((seat) => (
                <span key={seat} className="seat-pill">
                  {seat}
                </span>
              ))}
            </div>
          </div>

          <div className="summary-section">
            <h3 className="summary-section-title">Pricing</h3>

            {selectedSeats.map((seat) => (
              <div className="summary-row" key={seat}>
                <span className="summary-label">{seat}</span>
                <span className="summary-value">₹{getSeatPrice(seat)}</span>
              </div>
            ))}

            <div className="summary-row">
              <span className="summary-label">Seats selected</span>
              <span className="summary-value">{selectedSeats.length}</span>
            </div>

            <div className="total-row">
              <span className="total-label">Total Price</span>
              <span className="total-value">₹{totalPrice}</span>
            </div>
          </div>

          <div className="booking-actions">
            <button
              onClick={() => setShowPaymentModal(true)}
              className="confirm-btn"
            >
              Pay Now
            </button>

            <button onClick={handleCancelBooking} className="cancel-btn">
              Cancel Booking
            </button>
          </div>
        </div>
      </div>

      {showPaymentModal && (
        <div className="payment-modal-overlay">
          <div className="payment-modal">
            <h2>Dummy Payment Gateway</h2>
            <p>Review payment before proceeding.</p>

            <div className="payment-summary">
              <p>
                <strong>Seats:</strong> {selectedSeats.join(", ")}
              </p>
              <p>
                <strong>Total Amount:</strong> ₹{totalPrice}
              </p>
            </div>

            <p style={{ marginTop: "12px", fontSize: "14px", color: "#666" }}>
              This is a dummy payment simulation.
            </p>

            <div className="payment-actions">
              <button
                onClick={handlePaymentSuccess}
                className="confirm-btn"
                disabled={loadingPayment}
              >
                {loadingPayment ? "Processing..." : `Pay ₹${totalPrice}`}
              </button>

              <button
                onClick={() => setShowPaymentModal(false)}
                className="cancel-btn"
                disabled={loadingPayment}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookingSummary;
