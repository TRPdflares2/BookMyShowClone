import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSeatsByShowtime } from "../api/showtimeApi";
import { lockSeats } from "../api/reservationApi";
import Navbar from "../components/Navbar";
import "./SeatSelection.css";

function SeatSelection() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [layout, setLayout] = useState({});
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSeats();
  }, []);

  const fetchSeats = async () => {
    try {
      const res = await getSeatsByShowtime(id);
      console.log("Seats response:", res.data);
      console.log("Layout keys:", Object.keys(res.data.layout || {}));
      setLayout(res.data.layout || {});
    } catch (error) {
      console.error("Error fetching seats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSeatClick = (row, seat) => {
    const status = seat.status?.toUpperCase();

    if (status === "BOOKED" || status === "LOCKED") return;

    const seatId = `${row}${seat.number}`;
    const alreadySelected = selectedSeats.includes(seatId);

    if (alreadySelected) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleContinue = async () => {
    try {
      const formattedSeats = selectedSeats.map((seat) => ({
        row: seat[0],
        number: Number(seat.slice(1)),
      }));

      const payload = {
        showtimeId: Number(id),
        seats: formattedSeats,
      };

      console.log("Lock payload:", payload);

      const res = await lockSeats(payload);

      console.log("Lock response:", res.data);

      navigate("/booking-summary", {
        state: {
          showtimeId: id,
          selectedSeats,
          expiresAt: res.data.expiresAt,
        },
      });
    } catch (error) {
      console.error("Lock error:", error.response?.data || error.message);
      alert("Some seats are no longer available. Please reselect.");
    }
  };

  const getSeatClass = (row, seat) => {
    const seatId = `${row}${seat.number}`;
    const status = seat.status?.toUpperCase();
    const type = seat.type?.toLowerCase();

    let baseClass = "";

    if (status === "BOOKED") baseClass = "booked";
    else if (status === "LOCKED") baseClass = "locked";
    else if (selectedSeats.includes(seatId)) baseClass = "selected";
    else baseClass = "available";

    return `${baseClass} ${type}`;
  };

  const getRowType = (seats) => {
    if (!Array.isArray(seats) || seats.length === 0) return "";
    return seats[0]?.type || "";
  };

  if (loading) return <div className="seat-loading">Loading seats...</div>;

  return (
    <div className="seat-page">
      <Navbar />

      <div className="seat-container">
        <div className="seat-header">
          <h1 className="seat-title">Select Your Seats</h1>
          <p className="seat-subtitle">
            Choose available seats and continue to booking.
          </p>
        </div>

        <div className="legend">
          {/* Status */}
          <div className="legend-item">
            <span
              className="legend-box"
              style={{ background: "#16a34a" }}
            ></span>
            Available
          </div>
          <div className="legend-item">
            <span
              className="legend-box"
              style={{ background: "#2563eb" }}
            ></span>
            Selected
          </div>
          <div className="legend-item">
            <span
              className="legend-box"
              style={{ background: "#f59e0b" }}
            ></span>
            Locked
          </div>
          <div className="legend-item">
            <span
              className="legend-box"
              style={{ background: "#dc2626" }}
            ></span>
            Booked
          </div>

          {/* Types */}
          <div className="legend-item">
            <span className="legend-seat silver"></span>
            Silver
          </div>
          <div className="legend-item">
            <span className="legend-seat gold"></span>
            Gold
          </div>
          <div className="legend-item">
            <span className="legend-seat recliner"></span>
            Recliner
          </div>
        </div>

        <div className="seat-layout-card">
          {Object.entries(layout).map(([row, seats]) => (
            <div key={row} className="seat-row">
              <h3 className="seat-row-title">
                Row {row}
                <span
                  className={`row-type-badge ${getRowType(seats).toLowerCase()}`}
                >
                  {getRowType(seats)}
                </span>
              </h3>

              <div className="seat-row-grid">
                {Array.isArray(seats) &&
                  seats.map((seat) => {
                    const seatId = `${row}${seat.number}`;
                    const status = seat.status?.toUpperCase();
                    const isDisabled =
                      status === "BOOKED" || status === "LOCKED";

                    return (
                      <button
                        key={seatId}
                        onClick={() => handleSeatClick(row, seat)}
                        className={`seat-btn ${getSeatClass(row, seat)}`}
                        disabled={isDisabled}
                      >
                        {seat.number}
                      </button>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
        <div className="screen-wrapper">
          <div className="screen">SCREEN</div>
        </div>
        <div className="selection-summary">
          <h3 className="selection-title">Selected Seats</h3>

          <div className="selection-seats">
            {selectedSeats.length === 0 ? (
              <p>No seats selected yet.</p>
            ) : (
              selectedSeats.map((seat) => (
                <span key={seat} className="selected-seat-pill">
                  {seat}
                </span>
              ))
            )}
          </div>

          <button
            onClick={handleContinue}
            disabled={selectedSeats.length === 0}
            className="continue-btn"
          >
            Continue to Booking
          </button>
        </div>
      </div>
    </div>
  );
}

export default SeatSelection;
