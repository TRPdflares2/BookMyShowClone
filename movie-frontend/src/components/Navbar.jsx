import { Link, useNavigate } from "react-router-dom";
import { getUserFromToken } from "../utils/auth";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const user = getUserFromToken();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/dashboard" className="navbar-logo">
          🎬 MovieBook
        </Link>
      </div>

      <div className="navbar-right">
        <Link to="/dashboard" className="navbar-link">
          Dashboard
        </Link>

        <Link to="/movies" className="navbar-link">
          Movies
        </Link>

        <Link to="/my-bookings" className="navbar-link">
          My Bookings
        </Link>

        <span className="navbar-user">{user?.email}</span>

        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
