import { useEffect, useState } from "react";
import { getMyBookings } from "../api/bookingApi";
import Navbar from "../components/Navbar";
import "./MyBookings.css";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await getMyBookings();
      console.log("My bookings response:", res.data);

      setBookings(res.data.bookings || res.data || []);
    } catch (error) {
      console.error(
        "Error fetching bookings:",
        error.response?.data || error.message,
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    const normalized = status?.toLowerCase();

    if (normalized === "confirmed" || normalized === "booked")
      return "confirmed";
    if (normalized === "cancelled") return "cancelled";
    return "pending";
  };

  if (loading) {
    return <div className="my-bookings-loading">Loading bookings...</div>;
  }

  return (
    <div className="my-bookings-page">
      <Navbar />

      <div className="my-bookings-container">
        <div className="my-bookings-header">
          <h1 className="my-bookings-title">My Bookings</h1>
          <p className="my-bookings-subtitle">
            Track all your movie reservations in one place.
          </p>
        </div>

        {bookings.length === 0 ? (
          <div className="my-bookings-empty">
            <p>No bookings found yet.</p>
          </div>
        ) : (
          <div className="my-bookings-grid">
            {bookings.map((booking) => (
              <div key={booking.id} className="booking-history-card">
                <div className="booking-history-top">
                  <h2 className="booking-history-id">Booking #{booking.id}</h2>
                  <span
                    className={`booking-status ${getStatusClass(booking.status)}`}
                  >
                    {booking.status}
                  </span>
                </div>

                <div className="booking-info-grid">
                  <div className="booking-info-box">
                    <p className="booking-info-label">Showtime ID</p>
                    <p className="booking-info-value">{booking.showtimeId}</p>
                  </div>

                  <div className="booking-info-box">
                    <p className="booking-info-label">Total Amount</p>
                    <p className="booking-info-value">₹{booking.totalAmount}</p>
                  </div>

                  <div className="booking-info-box">
                    <p className="booking-info-label">Created At</p>
                    <p className="booking-info-value">
                      {new Date(booking.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="booking-seats-wrap">
                  <p className="booking-seats-title">Seats</p>

                  <div className="booking-seat-pill-wrap">
                    {Array.isArray(booking.seatsJson) ? (
                      booking.seatsJson.map((seat, index) => (
                        <span key={index} className="booking-seat-pill">
                          {seat.row}
                          {seat.number}
                        </span>
                      ))
                    ) : (
                      <span className="booking-info-value">N/A</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyBookings;
