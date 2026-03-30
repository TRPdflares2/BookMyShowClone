import axiosInstance from "../utils/axiosInstance";

export const getShowtimes = () => axiosInstance.get("/showtimes");
export const getShowtimeById = (id) => axiosInstance.get(`/showtimes/${id}`);
export const getSeatsByShowtime = (id) =>
  axiosInstance.get(`/showtimes/${id}/seats`);
