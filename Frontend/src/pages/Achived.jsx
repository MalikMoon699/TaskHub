import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import Loader from "../components/Loader";
import { CalendarDays } from "lucide-react";
import "../assets/styles/Project.css";

const Achived = () => {
  const { currentUser } = useAuth();
  const { selectedWorkSpace } = useOutletContext();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/project/${selectedWorkSpace}?userId=${currentUser._id}`
      );
      const data = await res.json();
      if (res.ok) {
        const completed = (data.projects || []).filter(
          (project) => project.status?.toLowerCase() === "completed"
        );
        setProjects(completed);
      } else {
        console.error("Failed to fetch projects:", data.message);
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedWorkSpace) {
      fetchProjects();
    }
  }, [selectedWorkSpace]);

  return loading ? (
    <Loader loading={true} style={{ height: "85vh", width: "100%" }} />
  ) : (
    <div>
      <div className="local-header flex align-item-center justify-content-space">
        <h3 className="local-header-title">Archived Projects</h3>
      </div>

      {projects.length > 0 ? (
        <div
          className="flex align-item-center justify-content-start"
          style={{ gap: "10px" }}
        >
          {projects.map((project, index) => (
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

              <div className="project-footer">
                <span className="project-tasks">0 Tasks</span>
                <span className="project-date">
                  <CalendarDays className="project-calendar-icon" />
                  {formatDate(project.dueDate)}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="empty-message">No archived projects found.</p>
      )}
    </div>
  );
};

export default Achived;
