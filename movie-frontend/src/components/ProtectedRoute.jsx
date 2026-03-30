import { Navigate } from "react-router-dom";
import { isTokenValid } from "../utils/auth";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token || !isTokenValid(token)) {
    localStorage.removeItem("token");
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;
