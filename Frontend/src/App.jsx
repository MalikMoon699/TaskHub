import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import SignUp from "./auth/SignUp";
import "./assets/styles/Style.css";
import { ProtectedRoute, PublicRoute } from "./routes/RouteGuards";
import Login from "./auth/Login";
import { useAuth } from "./contexts/AuthContext";

function App() {
  const { userData } = useAuth();

  console.log("userData-->", userData);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <SignUp />
          </PublicRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
