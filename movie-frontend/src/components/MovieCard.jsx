import { useNavigate } from "react-router-dom";
import "./MovieCard.css";

function MovieCard({ movie }) {
  const navigate = useNavigate();

  return (
    <div className="movie-card">
      <h2 className="movie-title">{movie.title}</h2>

      <div className="movie-meta">
        <div className="movie-meta-item">
          <span className="movie-meta-label">Genre</span>
          <span className="movie-meta-value">{movie.genre}</span>
        </div>

        <div className="movie-meta-item">
          <span className="movie-meta-label">Duration</span>
          <span className="movie-meta-value">{movie.duration} mins</span>
        </div>
      </div>

      <button
        onClick={() => navigate(`/movies/${movie.id}`)}
        className="movie-btn"
      >
        View Details
      </button>
    </div>
  );
}

export default MovieCard;
