import React, { useEffect, useMemo, useState } from "react";
import "../assets/styles/DashBoard.css";
import {
  BookCheck,
  CalendarDays,
  CircleCheckBig,
  Clock,
  ListTodo,
} from "lucide-react";
import { useOutletContext } from "react-router-dom";
import Chart from "../components/Chart";

const Dashboard = () => {
  const { workspaceData } = useOutletContext();
  const [loading, setLoading] = useState(false);
  const [tasksData, setTasksData] = useState([]);

  useEffect(() => {
    document.title = "TaskHub | Dashboard";
  }, []);

  const fetchTasksData = async () => {
    if (!allTasks.length) return;
    setLoading(true);

    try {
      const taskRequests = allTasks.map(async (taskId) => {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/tasks/taskById/${taskId}`
        );
        const data = await res.json();
        return res.ok ? data.task : null;
      });

      const results = await Promise.all(taskRequests);
      const validTasks = results.filter(Boolean);
      setTasksData(validTasks);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const options = { month: "long", day: "numeric", year: "numeric" };
    const formatted = date.toLocaleDateString("en-US", options);

    const [monthDay, year] = formatted.split(",");
    const [month, day] = monthDay.split(" ");

    return `${month},${day} ${year.trim()}`;
  };

  useEffect(() => {
    if (workspaceData) {
      fetchTasksData();
    }
  }, [workspaceData]);

  const allTasks = useMemo(() => {
    if (!workspaceData?.projects) return [];
    return workspaceData.projects.flatMap((project) => project.tasks || []);
  }, [workspaceData]);

  const totalProjects = workspaceData?.projects?.length || 0;
  const inProgressProjects = (workspaceData?.projects || []).filter(
    (p) => p.status === "InProgress"
  ).length;
  const totalTasks = tasksData.length;
  const completedTasks = tasksData.filter((t) => t.status === "done").length;
  const inProgressTasks = tasksData.filter(
    (t) => t.status === "inprogress"
  ).length;
  const toDoTasks = tasksData.filter((t) => t.status === "todo").length;
  const recentProjects = (workspaceData?.projects || []).slice(-5).reverse();

  return (
    <div>
      <div className="dashboard-tabs">
        <div className="dashboard-tab">
          <div className="dashboard-tab-uper-side">
            <h3>Total Projects</h3>
            <span>
              <BookCheck size={18} color="#555" />
            </span>
          </div>
          <div className="dashboard-tab-bottom-side">
            <h2>{totalProjects}</h2>
            <p>{inProgressProjects} in progress</p>
          </div>
        </div>
        <div className="dashboard-tab">
          <div className="dashboard-tab-uper-side">
            <h3>Total Tasks</h3>
            <span>
              <CircleCheckBig size={18} color="#555" />
            </span>
          </div>
          <div className="dashboard-tab-bottom-side">
            <h2>{totalTasks}</h2>
            <p>{completedTasks} completed</p>
          </div>
        </div>
        <div className="dashboard-tab">
          <div className="dashboard-tab-uper-side">
            <h3>To Do</h3>
            <span>
              <ListTodo size={18} color="#555" />
            </span>
          </div>
          <div className="dashboard-tab-bottom-side">
            <h2>{toDoTasks}</h2>
            <p>Tasks waiting to be started</p>
          </div>
        </div>
        <div className="dashboard-tab">
          <div className="dashboard-tab-uper-side">
            <h3>In Progress</h3>
            <span>
              <Clock size={18} color="#555" />
            </span>
          </div>
          <div className="dashboard-tab-bottom-side">
            <h2>{inProgressTasks}</h2>
            <p>Tasks currently in progress</p>
          </div>
        </div>
      </div>
      <div className="dashboard-body">
        <div className="dashboard-body-left-side">
          <Chart tasksData={tasksData} />
        </div>
        <div className="dashboard-body-right-side">
          <div className="dashboard-projects-container">
            <div className="dashboard-projects-header">Recent Projects</div>
            {recentProjects.length > 0 ? (
              <div className="dashboard-projects-inner-container">
                {recentProjects.map((project) => (
                  <div key={project._id} className="project-card">
                    <div className="project-header">
                      <div className="project-info">
                        <h3 className="project-title">{project.title}</h3>
                        <p className="project-description">
                          {project.discription}
                        </p>
                      </div>
                      <div className="project-status">
                        <span>{project.status}</span>
                      </div>
                    </div>
                    <div className="project-footer">
                      <span className="project-tasks">
                        {String(project?.tasks?.length || 0).padStart(2, "0")}{" "}
                        Tasks
                      </span>
                      <span className="project-date">
                        <CalendarDays className="project-calendar-icon" />
                        {formatDate(project.dueDate)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-message">recent projects not found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
