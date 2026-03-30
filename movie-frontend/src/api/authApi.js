import axiosInstance from "../utils/axiosInstance";

export const signupUser = (data) => axiosInstance.post("/auth/signup", data);
export const loginUser = (data) => axiosInstance.post("/auth/login", data);
