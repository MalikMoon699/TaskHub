import React, { useState } from "react";
import { CirclePlus, LayoutGrid } from "lucide-react";
import CreateProject from "./CreateProject";

const NoProject = () => {
  const [isCreateProject, setIsCreateProject] = useState(false);

  return (
    <div
      style={{ width: "100%", height: "80vh" }}
      className="no-work-space-container"
    >
      <div className="no-work-space-inner-container">
        <LayoutGrid size={50} color="#6c6565" className="no-work-space-icon" />
        <h1 className="no-work-space-title">No projects found</h1>
        <p className="no-work-space-description">
          Create a new project to get started
        </p>
        <div className="flex align-items-center justify-content-center">
          <button
            onClick={() => setIsCreateProject(true)}
            className="no-work-space-button flex align-items-center justify-content-center"
          >
            <CirclePlus className="no-work-space-button-icon" />
            <span className="no-work-space-button-text">Create Project</span>
          </button>
        </div>
      </div>
      {isCreateProject && (
        <CreateProject
          onClose={() => {
            setIsCreateProject(false);
          }}
        />
      )}
    </div>
  );
};

export default NoProject;
