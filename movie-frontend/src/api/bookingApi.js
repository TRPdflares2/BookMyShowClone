import axiosInstance from "../utils/axiosInstance";

export const createBooking = (data) =>
  axiosInstance.post("/bookings/create", data);

export const confirmBooking = (data) =>
  axiosInstance.post("/bookings/confirm", data);

export const getMyBookings = () => axiosInstance.get("/bookings/me");
