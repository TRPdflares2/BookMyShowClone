import axiosInstance from "../utils/axiosInstance";

export const lockSeats = (data) =>
  axiosInstance.post("/reservations/lock", data);

export const releaseSeats = (data) =>
  axiosInstance.post("/reservations/release", data);
