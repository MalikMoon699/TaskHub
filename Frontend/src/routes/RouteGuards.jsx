import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Loader from "../components/Loader";

export const ProtectedRoute = ({ children, allowWithoutWorkspace = false }) => {
  const { authAllow, loading, currentUser } = useAuth();

  if (loading) return (
    <Loader
      loading={true}
      size="50"
      style={{ height: "85vh", width: "100%" }}
    />
  );

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
  const location = useLocation();

  if (loading) return <p>Loading...</p>;

  if (authAllow && location.pathname.startsWith("/invite/")) {
    return children;
  }

  return authAllow ? <Navigate to="/" replace /> : children;
};