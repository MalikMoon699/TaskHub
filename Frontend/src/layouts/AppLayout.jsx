import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/Topbar";
import logo from "../assets/images/logo.png";
import { Menu } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const AppLayout = () => {
  const { currentUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSideBar, setIsSideBar] = useState(false);
  const [selectedWorkSpace, setSelectedWorkSpace] = useState(
    () => localStorage.getItem("selectedWorkSpace") || null
  );
  const [workspaceLoading, setWorkspaceLoading] = useState(false);
  const [workspaceData, setWorkspaceData] = useState(null);

  useEffect(() => {
    fetchWorkspace();
  }, [selectedWorkSpace]);

  useEffect(() => {
    if (selectedWorkSpace) {
      localStorage.setItem("selectedWorkSpace", selectedWorkSpace);
    }
  }, [selectedWorkSpace]);

  const fetchWorkspace = async () => {
    if (!selectedWorkSpace) return;
    setWorkspaceLoading(true);
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/workspaces/workspace/${selectedWorkSpace}`
      );
      const data = await res.json();
      if (res.ok) {
        setWorkspaceData(data.workspace);
      } else {
        console.error("Failed to fetch workspace:", data.message);
      }
    } catch (err) {
      console.error("Error fetching workspace:", err);
    }finally{
      setWorkspaceLoading(false);
    }
  };

  const toggleMenuOpen = () => {
    setIsSideBar((prev) => !prev);
  };

  const isDashboard = location.pathname === "/dashboard";

  useEffect(() => {
    if (!selectedWorkSpace || !isDashboard) return;

    const currentPath = location.pathname;
    const targetPath = `/dashboard/${selectedWorkSpace}`;

    if (currentPath !== targetPath) {
      navigate(targetPath, { replace: true });
    }
  }, [selectedWorkSpace, location.pathname]);

  return (
    <div className="app-container">
      <Sidebar
        toggleMenuOpen={toggleMenuOpen}
        isSideBar={isSideBar}
        selectedWorkSpace={selectedWorkSpace}
        setSelectedWorkSpace={setSelectedWorkSpace}
        workspaceData={workspaceData}
        setWorkspaceData={setWorkspaceData}
      />
      <div className="main-content">
        <div className="mobile-nav">
          <div
            className="logo-container"
            onClick={() => {
              navigate("/dashboard");
            }}
          >
            <img src={logo} alt="Logo" />
          </div>
          <Menu size={24} onClick={toggleMenuOpen} className="hamburger-btn" />
        </div>
        <TopBar
          selectedWorkSpace={selectedWorkSpace}
          setSelectedWorkSpace={setSelectedWorkSpace}
          workspaceData={workspaceData}
          setWorkspaceData={setWorkspaceData}
        />
        <div className="app-content">
          <Outlet
            context={{
              workspaceLoading,
              selectedWorkSpace,
              setSelectedWorkSpace,
              workspaceData,
              setWorkspaceData,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
