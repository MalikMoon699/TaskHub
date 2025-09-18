import React, { useState } from "react";
import { CirclePlus, LayoutGrid } from "lucide-react";
import "../assets/styles/NoWorkSpace.css";
import CreateWorkSpace from "../components/CreateWorkSpace";

const NoWorkSpace = () => {
 const [isCreateWorkSpace, setIsCreateWorkSpace] = useState(false);

  return (
    <div className="no-work-space-container">
      <div className="no-work-space-inner-container">
        <LayoutGrid size={50} color="#6c6565" className="no-work-space-icon" />
        <h1 className="no-work-space-title">No workspaces found</h1>
        <p className="no-work-space-description">
          Create a new workspace to get started
        </p>
        <div className="flex align-items-center justify-content-center">
          <button
            onClick={() => setIsCreateWorkSpace(true)}
            className="no-work-space-button flex align-items-center justify-content-center"
          >
            <CirclePlus className="no-work-space-button-icon" />
            <span className="no-work-space-button-text">Create Workspace</span>
          </button>
        </div>
      </div>
      {isCreateWorkSpace && (
        <CreateWorkSpace onClose={()=>{setIsCreateWorkSpace(false)}}/>
      )}
    </div>
  );
};

export default NoWorkSpace;
