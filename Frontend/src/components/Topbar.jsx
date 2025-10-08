import React, { useState, useEffect, useRef } from "react";
import "../assets/styles/Topbar.css";
import { useAuth } from "../contexts/AuthContext";
import { Bell, ChevronDown, X } from "lucide-react";
import CreateWorkSpace from "./CreateWorkSpace";
import Loader from "./Loader";
import { toast } from "react-toastify";

const Topbar = ({ selectedWorkSpace, setSelectedWorkSpace }) => {
  const { currentUser } = useAuth();
  const [fullName, setFullName] = useState("");
  const [isSelecter, setIsSelecter] = useState(false);
  const [isCreateWorkSpace, setIsCreateWorkSpace] = useState(false);
  const [workSpaces, setWorkSpaces] = useState([]);
  const [isDetails, setIsDetails] = useState(false);
  const [loading, setLoading] = useState(false);

   const dropdownRef = useRef(null);

   useEffect(() => {
     const handleClickOutside = (event) => {
       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
         setIsSelecter(false);
       }
     };

     document.addEventListener("mousedown", handleClickOutside);
     return () => document.removeEventListener("mousedown", handleClickOutside);
   }, []);

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
          if (data.workSpaces.length > 0 && selectedWorkSpace === null) {
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
    setFullName(currentUser?.name || "");
  }, [currentUser]);

  const getFirstLetter = () => {
    if (!currentUser) return "?";
    const name = currentUser.name || currentUser.email || "";
    return name.charAt(0).toUpperCase();
  };

  const UpdateProfile = async () => {
    if (!fullName.trim()) {
      toast.error("Full Name cannot be empty");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/${currentUser._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: fullName,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Profile updated successfully");
        setIsDetails(false);
      } else {
        console.error("Failed to update profile:", data.message);
        toast.error(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Something went wrong while updating profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="topbar-container">
      <div className="topbar-left-side">
        <div className="workspace-selector-container" ref={dropdownRef}>
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
                  style={{
                    backgroundColor:
                      item._id === selectedWorkSpace
                        ? "rgb(0 80 255 / 17%)"
                        : "",
                  }}
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
          <button
            onClick={() => {
              setIsDetails(true);
            }}
            className="topbar-profile-btn"
          >
            {getFirstLetter()}
          </button>
        </div>
      </div>
      {isCreateWorkSpace && (
        <CreateWorkSpace
          onClose={() => {
            setIsCreateWorkSpace(false);
          }}
        />
      )}
      {isDetails && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header flex align-item-center justify-content-space">
              <h3 className="modal-title">Personal Information</h3>
              <button
                className="modal-close-btn"
                onClick={() => setIsDetails(false)}
              >
                <X size={15} color="#757575" />
              </button>
            </div>
            <p
              style={{
                fontSize: "10px",
                fontWeight: "500",
                color: "rgb(144, 136, 136)",
              }}
            >
              Update your personal details.
            </p>
            <div className="modal-body signup-form">
              <div
                style={{ gap: "10px" }}
                className="flex align-items-center justify-content-start "
              >
                <div
                  style={{ height: "85px", width: "85px", cursor: "default" }}
                  className="topbar-profile-btn flex align-items-center justify-content-center"
                >
                  {getFirstLetter()}
                </div>
                <button
                  style={{
                    fontSize: "12px",
                    fontWeight: "600",
                    background: "transparent",
                    border: "1px solid #e8e0e0",
                    padding: "3px 5px",
                    cursor: "pointer",
                    borderRadius: "4px",
                    boxShadow: " 0px 0px 10px #00000017",
                  }}
                >
                  Change Avatar
                </button>
              </div>

              <div className="form-group">
                <label htmlFor="" className="form-label">
                  Full Name
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter your Full Name..."
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="" className="form-label">
                  Email Adress
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter your Email Adress..."
                  value={currentUser?.email || ""}
                  readOnly
                />
                <p
                  style={{
                    fontSize: "10px",
                    fontWeight: "500",
                    color: "rgb(144, 136, 136)",
                  }}
                >
                  Your email address cannot be changed able.
                </p>
              </div>
            </div>
            <div
              style={{ gap: "10px" }}
              className="flex align-item-center justify-content-end"
            >
              <button
                onClick={() => setIsDetails(false)}
                className="cencel-btn"
              >
                Cancel
              </button>
              <button
                disabled={loading}
                onClick={UpdateProfile}
                className="create-btn"
              >
                {loading ? (
                  <Loader
                    color="white"
                    size="18"
                    style={{ height: "20px", width: "46px" }}
                    loading={true}
                  />
                ) : (
                  "Update"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Topbar;
