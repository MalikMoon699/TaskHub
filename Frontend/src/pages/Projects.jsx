import { CirclePlus } from "lucide-react";
import React from "react";

const Projects = () => {
  return (
    <div>
      <div className="local-header flex align-item-center justify-content-space">
        <h3 className="local-header-title">Projects</h3>
        <button className="local-header-btn">
          <CirclePlus size={18} />
          New Project
        </button>
      </div>
      <div></div>
    </div>
  );
};

export default Projects;
