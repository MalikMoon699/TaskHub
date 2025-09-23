import React, { useEffect, useMemo, useState } from "react";
import "../assets/styles/Dashboard.css";
import { BookCheck, CircleCheckBig, Clock, ListTodo } from "lucide-react";
import { useOutletContext } from "react-router-dom";
// import { LineChart } from "@mui/x-charts/LineChart";


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
          {/* <LineChart
            dataset={usUnemploymentRate}
            xAxis={xAxis}
            yAxis={yAxis}
            series={series}
            height={300}
            grid={{ vertical: true, horizontal: true }}
          /> */}
        </div>
        <div className="dashboard-body-right-side">
          <div>Recent Projects</div>
          {recentProjects.length > 0 ? (
            <div>
              {recentProjects.map((project) => (
                <div key={project._id} className="recent-project-card">
                  <h3>{project.title}</h3>
                  <p>{project.discription}</p>
                  <span>Status: {project.status}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-message">recent projects not found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
