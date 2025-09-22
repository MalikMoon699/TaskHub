import React, { useState, useEffect } from "react";
import "../assets/styles/Topbar.css";
import { useAuth } from "../contexts/AuthContext";
import { Bell, ChevronDown } from "lucide-react";
import CreateWorkSpace from "./CreateWorkSpace";

const Topbar = ({ selectedWorkSpace, setSelectedWorkSpace }) => {
  const { currentUser } = useAuth();
  const [isSelecter, setIsSelecter] = useState(false);
  const [isCreateWorkSpace, setIsCreateWorkSpace] = useState(false);
  const [workSpaces, setWorkSpaces] = useState([]);

  useEffect(() => {
    if (!currentUser?._id) return;

    const fetchWorkSpaces = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/workspaces/${
            currentUser._id
          }`
        );
        const data = await res.json();

        if (res.ok) {
          setWorkSpaces(data.workSpaces || []);
          if (data.workSpaces.length > 0) {
            setSelectedWorkSpace(data.workSpaces[0]._id);
          }
        } else {
          console.error("Failed to fetch workspaces:", data.message);
        }
      } catch (error) {
        console.error("Error fetching workspaces:", error);
      }
    };

    fetchWorkSpaces();
  }, [currentUser]);

  const getFirstLetter = () => {
    if (!currentUser) return "?";
    const name = currentUser.name || currentUser.email || "";
    return name.charAt(0).toUpperCase();
  };

  console.log("Selected Workspace in Topbar:", workSpaces);
  return (
    <div className="topbar-container">
      <div className="topbar-left-side">
        <div className="workspace-selector-container">
          <div
            className="workspace-selector"
            onClick={() => setIsSelecter(!isSelecter)}
          >
            <span className="selector-workspace-name">
              {workSpaces.find((ws) => ws._id === selectedWorkSpace)?.name ||
                "Select Workspace"}
            </span>
            <ChevronDown size={12} className="selector-workspace-icon" />
          </div>

          {isSelecter && (
            <div className="workspace-dropdown">
              {workSpaces.map((item) => (
                <div
                  key={item._id}
                  className="workspace-dropdown-item"
                  onClick={() => {
                    setSelectedWorkSpace(item._id);
                    setIsSelecter(false);
                  }}
                >
                  <span
                    style={{ backgroundColor: item.workspaceColor }}
                    className="workspace-dropdown-item-icon"
                  >
                    {getFirstLetter()}
                  </span>
                  {item.name}
                </div>
              ))}
              <div
                onClick={() => {
                  setIsCreateWorkSpace(true);
                  setIsSelecter(false);
                }}
                className="workspace-dropdown-create"
              >
                + Create Workspace
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex align-item-center justify-content-end topbar-right-side">
        <div className="topbar-actions flex align-item-center justify-content-center ">
          <button className="topbar-action-btn">
            <Bell size={18} />
          </button>
          <button className="topbar-profile-btn">{getFirstLetter()}</button>
        </div>
      </div>
      {isCreateWorkSpace && (
        <CreateWorkSpace
          onClose={() => {
            setIsCreateWorkSpace(false);
          }}
        />
      )}
    </div>
  );
};

export default Topbar;
