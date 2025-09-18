import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const ProtectedRoute = ({ children }) => {
  const { authAllow, loading } = useAuth();

  if (loading) return <p>Loading...</p>

  return authAllow ? children : <Navigate to="/login" replace />;
};

export const PublicRoute = ({ children }) => {
  const { authAllow, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  return authAllow ? <Navigate to="/" replace /> : children;
};
