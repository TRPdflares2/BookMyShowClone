import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-page">
      <Navbar />

      <div className="dashboard-container">
        <div className="dashboard-hero">
          <h1 className="dashboard-title">Welcome to MovieBook 🎬</h1>
          <p className="dashboard-subtitle">
            Book your favorite movies, pick your seats, and manage all your
            reservations in one clean experience.
          </p>

          <div className="dashboard-actions">
            <button
              onClick={() => navigate("/movies")}
              className="dashboard-primary-btn"
            >
              Browse Movies
            </button>

            <button
              onClick={() => navigate("/my-bookings")}
              className="dashboard-secondary-btn"
            >
              My Bookings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
