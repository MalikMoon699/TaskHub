import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { CirclePlus } from "lucide-react";
import CreateWorkSpace from "../components/CreateWorkSpace";

const WorkSpaces = () => {
  const { currentUser } = useAuth();
  const [isCreateWorkSpace, setIsCreateWorkSpace] = useState(false);
  const [workSpaces, setWorkSpaces] = useState([]);

  useEffect(() => {
    if (!currentUser?._id) return;

    const fetchWorkSpaces = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/workspaces/${currentUser._id}`
        );
        const data = await res.json();

        if (res.ok) {
          setWorkSpaces(data.workSpaces || []);
        } else {
          console.error("Failed to fetch workspaces:", data.message);
        }
      } catch (error) {
        console.error("Error fetching workspaces:", error);
      }
    };

    fetchWorkSpaces();
  }, [currentUser]);
  return (
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
      {workSpaces.map((item, index) => (
        <div key={item._id || index}>
          <h1 style={{ color: item.workspaceColor }}>{item.name}</h1>
        </div>
      ))}
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

export default WorkSpaces;
