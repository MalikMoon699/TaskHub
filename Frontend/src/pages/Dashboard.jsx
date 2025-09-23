import React, { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import "../assets/styles/Dashboard.css";

const Dashboard = () => {
  const { logout } = useAuth();
  
  useEffect(() => {
    document.title = "TaskHub | Dashboard";
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={logout}>logout</button>
    </div>
  );
};

export default Dashboard;
