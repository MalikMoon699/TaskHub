import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import SignUp from "./auth/SignUp";
import "./assets/styles/Style.css";
import { ProtectedRoute, PublicRoute } from "./routes/RouteGuards";
import Login from "./auth/Login";
import { useAuth } from "./contexts/AuthContext";
import NoWorkSpace from "./pages/NoWorkSpace";
import WorkSpaces from "./pages/WorkSpaces";
import MyTasks from "./pages/MyTasks";
import Members from "./pages/Members";
import Achived from "./pages/Achived";
import Settings from "./pages/Settings";
import AppLayout from "./layouts/AppLayout";
import Projects from "./pages/Projects";

function App() {
  const { currentUser } = useAuth();

  console.log("currentUser-->", currentUser);

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workspaces"
          element={
            <ProtectedRoute>
              <WorkSpaces />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <Projects />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mytasks"
          element={
            <ProtectedRoute>
              <MyTasks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/members"
          element={
            <ProtectedRoute>
              <Members />
            </ProtectedRoute>
          }
        />
        <Route
          path="/achived"
          element={
            <ProtectedRoute>
              <Achived />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route
        path="/workspace"
        element={
          <ProtectedRoute allowWithoutWorkspace>
            <NoWorkSpace />
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
