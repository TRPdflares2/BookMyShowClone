import { useEffect, useState } from "react";
import { getMovies } from "../api/movieApi";
import MovieCard from "../components/MovieCard";
import Navbar from "../components/Navbar";
import "./movies.css";

function Movies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const res = await getMovies();
      setMovies(res.data);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="movies-loading">
        <h2>Loading movies...</h2>
        <p>Getting the latest shows for you 🎬</p>
      </div>
    );
  }

  return (
    <div className="movies-page">
      <Navbar />

      <div className="movies-container">
        <div className="movies-header">
          <h1 className="movies-title">Now Showing 🎥</h1>
          <p className="movies-subtitle">
            Browse available movies and book your seats.
          </p>
        </div>

        {movies.length === 0 ? (
          <div className="movies-empty">
            <p>No movies found right now.</p>
          </div>
        ) : (
          <div className="movies-grid">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Movies;
