import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMovieById } from "../api/movieApi";
import { getShowtimes } from "../api/showtimeApi";
import Navbar from "../components/Navbar";
import "./MovieDetails.css";

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovieDetails();
  }, []);

  const fetchMovieDetails = async () => {
    try {
      const movieRes = await getMovieById(id);
      const showtimeRes = await getShowtimes();

      setMovie(movieRes.data);

      const filteredShowtimes = showtimeRes.data.filter(
        (showtime) => String(showtime.movieId) === String(id),
      );

      setShowtimes(filteredShowtimes);
    } catch (error) {
      console.error("Error fetching movie details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="movie-details-loading">Loading movie...</div>;
  }

  if (!movie) {
    return <div className="movie-details-error">Movie not found</div>;
  }

  return (
    <div className="movie-details-page">
      <Navbar />

      <div className="movie-details-container">
        <div className="movie-hero">
          <h1 className="movie-hero-title">{movie.title}</h1>

          <div className="movie-hero-meta">
            <span className="movie-badge">🎭 {movie.genre}</span>
            <span className="movie-badge">⏱ {movie.duration} mins</span>
          </div>

          <p className="movie-description">
            {movie.description || "No description available"}
          </p>
        </div>

        <div className="showtimes-section">
          <h2 className="showtimes-title">Available Showtimes</h2>

          {showtimes.length === 0 ? (
            <div className="movie-details-empty">
              <p>No showtimes available for this movie right now.</p>
            </div>
          ) : (
            <div className="showtimes-grid">
              {showtimes.map((showtime) => (
                <div key={showtime.id} className="showtime-card">
                  <div className="showtime-info">
                    <span className="showtime-label">Show Time</span>
                    <span className="showtime-value">{showtime.startTime}</span>
                  </div>

                  <div className="showtime-info">
                    <span className="showtime-label">Screen</span>
                    <span className="showtime-value">{showtime.screen}</span>
                  </div>

                  <button
                    className="showtime-btn"
                    onClick={() => navigate(`/showtimes/${showtime.id}/seats`)}
                  >
                    Select Seats
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
