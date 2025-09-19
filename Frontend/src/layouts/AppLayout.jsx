import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/Topbar";

const AppLayout = () => {
  const [selectedWorkSpace, setSelectedWorkSpace] = useState(null);

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <TopBar
          selectedWorkSpace={selectedWorkSpace}
          setSelectedWorkSpace={setSelectedWorkSpace}
        />
        <div className="app-content">
          <Outlet context={{ selectedWorkSpace, setSelectedWorkSpace }} />
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
