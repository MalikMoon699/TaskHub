import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const ProtectedRoute = ({ children, allowWithoutWorkspace = false }) => {
  const { authAllow, loading, currentUser } = useAuth();

  if (loading) return <p>Loading...</p>;

  if (!authAllow) return <Navigate to="/login" replace />;

  if (
    (!currentUser?.workSpaces || currentUser.workSpaces.length === 0) &&
    !allowWithoutWorkspace
  ) {
    return <Navigate to="/workspace" replace />;
  }

  return children;
};

export const PublicRoute = ({ children }) => {
  const { authAllow, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  return authAllow ? <Navigate to="/" replace /> : children;
};
