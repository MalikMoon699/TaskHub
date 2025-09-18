import React, { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

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
