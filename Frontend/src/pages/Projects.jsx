import { CalendarDays, CirclePlus } from "lucide-react";
import React, { useEffect, useState } from "react";
import CreateProject from "../components/CreateProject";
import { useOutletContext } from "react-router";
import "../assets/styles/Project.css";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const { selectedWorkSpace } = useOutletContext();
  const [isCreateProjects, setIsCreateProjects] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const options = { month: "long", day: "numeric", year: "numeric" };
    const formatted = date.toLocaleDateString("en-US", options);

    const [monthDay, year] = formatted.split(",");
    const [month, day] = monthDay.split(" ");

    return `${month},${day} ${year.trim()}`;
  };

  const calculateProgress = (startDate, dueDate) => {
    if (!startDate || !dueDate) return 0;

    const start = new Date(startDate);
    const end = new Date(dueDate);
    const today = new Date();
    if (today < start) return 0;
    if (today > end) return 100;
    const totalDuration = end - start;
    const elapsed = today - start;

    return Math.round((elapsed / totalDuration) * 100);
  };

  useEffect(() => {
    if (!selectedWorkSpace) return;

    const fetchProjects = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/project/${selectedWorkSpace}`
        );
        const data = await res.json();

        if (res.ok) {
          setProjects(data.projects || []);
        } else {
          console.error("Failed to fetch workspaces:", data.message);
        }
      } catch (error) {
        console.error("Error fetching workspaces:", error);
      }
    };

    fetchProjects();
  }, [selectedWorkSpace]);

  console.log("projects-->", projects);
  return (
    <div>
      <div className="local-header flex align-item-center justify-content-space">
        <h3 className="local-header-title">Projects</h3>
        <button
          onClick={() => {
            setIsCreateProjects(true);
          }}
          className="local-header-btn"
        >
          <CirclePlus size={18} />
          New Project
        </button>
      </div>
      <div className="flex align-item-center justify-content-start" style={{gap:"10px"}}>
        {projects.length > 0 ? (
          projects.map((project, index) => (
            <div key={index} className="project-card">
              <div className="project-header">
                <div className="project-info">
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-description">{project?.discription}</p>
                </div>
                <div className="project-status">
                  <span>{project.status}</span>
                </div>
              </div>

              <div className="project-progress">
                <span className="project-progress-label">Progress</span>
                <div className="project-progress-bar">
                  <div
                    className="project-progress-fill"
                    style={{
                      width: `${calculateProgress(
                        project.startDate,
                        project.dueDate
                      )}% `,
                    }}
                  ></div>
                </div>
                <span className="project-progress-percent">
                  {calculateProgress(project.startDate, project.dueDate)}%
                </span>
              </div>

              <div className="project-footer">
                <span className="project-tasks">0 Tasks</span>
                <span className="project-date">
                  <CalendarDays className="project-calendar-icon" />
                  {formatDate(project.dueDate)}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div></div>
        )}
      </div>
      {isCreateProjects && (
        <CreateProject
          onClose={() => {
            setIsCreateProjects(false);
          }}
        />
      )}
    </div>
  );
};

export default Projects;
