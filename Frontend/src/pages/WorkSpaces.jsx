import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { CirclePlus, Presentation, Users } from "lucide-react";
import CreateWorkSpace from "../components/CreateWorkSpace";
import "../assets/styles/WorkSpace.css";
import Loader from "../components/Loader";
import { useNavigate, useOutletContext } from "react-router";

const WorkSpaces = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { setSelectedWorkSpace, selectedWorkSpace } = useOutletContext();
  const [isCreateWorkSpace, setIsCreateWorkSpace] = useState(false);
  const [workSpaces, setWorkSpaces] = useState([]);
  const [loading, setLoading] = useState(false);

   useEffect(() => {
      document.title = "TaskHub | WorkSpaces";
    }, []);

  useEffect(() => {
    if (!currentUser?._id) return;

    const fetchWorkSpaces = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/workspaces/${
            currentUser._id
          }`
        );
        const data = await res.json();

        if (res.ok) {
          setWorkSpaces(data.workSpaces || []);
        } else {
          console.error("Failed to fetch workspaces:", data.message);
        }
      } catch (error) {
        console.error("Error fetching workspaces:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkSpaces();
  }, [currentUser]);

  const getFirstLetter = (workspaceName) => {
    return workspaceName.charAt(0).toUpperCase();
  };

  const formatDateTime = (timestamp) => {
    if (!timestamp) return "";

    const date = new Date(timestamp);

    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return loading ? (
    <Loader
      loading={true}
      size="50"
      style={{ height: "85vh", width: "100%" }}
    />
  ) : (
    <div>
      <div className="local-header flex align-item-center justify-content-space">
        <h3 className="local-header-title">Workspaces</h3>
        <button
          onClick={() => {
            setIsCreateWorkSpace(true);
          }}
          className="local-header-btn"
        >
          <CirclePlus size={18} />
          New Workspace
        </button>
      </div>
      <div style={{ paddingTop: "10px" }}>
        {workSpaces.map((item, index) => (
          <div
            style={{
              backgroundColor:
                selectedWorkSpace === item._id ? "rgb(33 102 254 / 8%)" : "",
            }}
            onClick={() => {
              setSelectedWorkSpace(item._id);
              navigate("/projects");
            }}
            key={item._id || index}
            className="workspace-card"
          >
            <div className="flex align-item-center justify-content-space">
              <div className="workspace-header">
                <div
                  className="workspace-avatar"
                  style={{
                    backgroundColor: item.workspaceColor,
                    color: item.workspaceColor === "Yellow" ? "#000" : "",
                  }}
                >
                  {getFirstLetter(item.name)}
                </div>
                <div className="workspace-info">
                  <h1 className="workspace-title">{item.name}</h1>
                  <p className="workspace-date">
                    Created At {formatDateTime(item.createdAt)}
                  </p>
                </div>
              </div>
              <div className="workspace-stats flex align-items-center justify-content-center">
                <span className="workspace-members">
                  <Users className="icon" />
                  {String(item?.members?.length || 0).padStart(2, "0")}
                </span>
                <span className="workspace-projects">
                  <Presentation className="icon" />
                  {String(item?.projects?.length || 0).padStart(2, "0")}
                </span>
              </div>
            </div>
            <p className="workspace-description">{item?.discription}</p>
          </div>
        ))}
      </div>
      {isCreateWorkSpace && (
        <CreateWorkSpace
          fetchWorkSpaces={fetchWorkSpaces()}
          onClose={() => {
            setIsCreateWorkSpace(false);
          }}
        />
      )}
    </div>
  );
};

export default WorkSpaces;
