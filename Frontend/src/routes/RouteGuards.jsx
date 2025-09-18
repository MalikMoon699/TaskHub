import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
  if (!localStorage.getItem("token")) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export const PublicRoute = ({ children }) => {
  if (localStorage.getItem("token")) {
    return <Navigate to="/" replace />;
  }
  return children;
};
