import { CalendarDays, CirclePlus } from "lucide-react";
import React, { useEffect, useState } from "react";
import CreateProject from "../components/CreateProject";
import { useNavigate, useOutletContext } from "react-router";
import "../assets/styles/Project.css";
import NoProject from "../components/NoProject";
import { useAuth } from "../contexts/AuthContext";
import Loader from "../components/Loader";

const Projects = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState([]);
  const { selectedWorkSpace } = useOutletContext();
  const [workspaceData, setWorkspaceData] = useState(null);
  const [isCreateProjects, setIsCreateProjects] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isUpdate, setIsUpdate] = useState(null);
  const [status, setStatus] = useState("");

   useEffect(() => {
      document.title = "TaskHub | Projects";
    }, []);

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

  const fetchWorkspace = async () => {
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/workspaces/workspace/${selectedWorkSpace}`
      );
      const data = await res.json();
      if (res.ok) {
        setWorkspaceData(data.workspace);
      } else {
        console.error("Failed to fetch workspace:", data.message);
      }
    } catch (err) {
      console.error("Error fetching workspace:", err);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/project/${selectedWorkSpace}?userId=${currentUser._id}`
      );
      const data = await res.json();
      if (res.ok) {
        setProjects(data.projects || []);
      } else {
        console.error("Failed to fetch projects:", data.message);
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  useEffect(() => {
    if (!selectedWorkSpace) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchWorkspace(), fetchProjects()]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedWorkSpace]);

  const updateProjectStatus = async (projectId, newStatus, progress) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/project/${projectId}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus, progress }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        fetchProjects();
      } else {
        console.error("Failed to update project status:", data.message);
      }
    } catch (err) {
      console.error("Error updating project status:", err);
    }
  };

  return loading ? (
    <Loader loading={true} style={{ height: "85vh", width: "100%" }} />
  ) : (
    <div>
      {projects.length > 0 ? (
        <>
          <div className="local-header flex align-item-center justify-content-space">
            <h3 className="local-header-title">Projects</h3>
            {workspaceData?.createdBy === currentUser?._id && (
              <button
                onClick={() => {
                  setIsCreateProjects(true);
                }}
                className="local-header-btn"
              >
                <CirclePlus size={18} />
                New Project
              </button>
            )}
          </div>
          <div
            className="flex align-item-center justify-content-start"
            style={{ gap: "10px" }}
          >
            {projects.map((project, index) => (
              <div
                onClick={() => {
                  navigate("/mytasks", {
                    state: { selectedProject: project._id },
                  });
                }}
                key={index}
                className="project-card"
              >
                <div className="project-header">
                  <div className="project-info">
                    <h3 className="project-title">{project.title}</h3>
                    <p className="project-description">
                      {project?.discription}
                    </p>
                  </div>
                  <div className="project-status">
                    <span
                      style={{
                        cursor:
                          workspaceData?.createdBy === currentUser?._id
                            ? "pointer"
                            : "",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (workspaceData?.createdBy === currentUser?._id) {
                          setIsUpdate(project._id);
                        }
                      }}
                    >
                      {project.status}
                      {isUpdate === project._id && (
                        <div className="project-status-update">
                          <select
                            className="form-selector"
                            style={{ width: "100%" }}
                            value={status || project.status}
                            onChange={(e) => {
                              const newStatus = e.target.value;
                              const progress = calculateProgress(
                                project.startDate,
                                project.dueDate
                              );
                              setStatus(newStatus);
                              updateProjectStatus(
                                project._id,
                                newStatus,
                                progress
                              );
                              setIsUpdate(null);
                            }}
                          >
                            <option value="Plaining">Planning</option>
                            <option value="InProgress">In Progress</option>
                            <option value="OnHold">On Hold</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      )}
                    </span>
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
                  <span className="project-tasks">
                    {String(project?.tasks?.length || 0).padStart(2, "0")} Tasks
                  </span>
                  <span className="project-date">
                    <CalendarDays className="project-calendar-icon" />
                    {formatDate(project.dueDate)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : workspaceData?.createdBy === currentUser?._id ? (
        <NoProject />
      ) : (
        <p className="empty-message">No project found.</p>
      )}
      {isCreateProjects && (
        <CreateProject
          onClose={() => {
            setIsCreateProjects(false);
            fetchProjects();
          }}
        />
      )}
    </div>
  );
};

export default Projects;
