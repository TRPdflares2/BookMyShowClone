import axiosInstance from "../utils/axiosInstance";

export const getMovies = () => axiosInstance.get("/movies");
export const getMovieById = (id) => axiosInstance.get(`/movies/${id}`);
