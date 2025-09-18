import React, { useEffect } from "react";
import { useNavigate } from "react-router";

const Dashboard = () => {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "TaskHub | Dashboard";
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={handleLogout}>logout</button>
    </div>
  );
};

export default Dashboard;
