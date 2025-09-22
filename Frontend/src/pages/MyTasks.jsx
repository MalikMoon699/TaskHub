import { Calendar, ChevronDownIcon, CirclePlus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useOutletContext, useLocation } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import "../assets/styles/MyTasks.css";
import CreateTasks from "../components/CreateTasks";
import Loader from "../components/Loader";

const MyTasks = () => {
  const { currentUser } = useAuth();
  const { selectedWorkSpace, workspaceData } = useOutletContext();
  const location = useLocation();

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isSelecter, setIsSelecter] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const [activeTab, setActiveTab] = useState("alltasks");
  const [isCreateTask, setIsCreateTask] = useState(false);
  const [loading, setLoading] = useState(false);

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
        if (!selectedProject) {
          const projectFromNav = location.state?.selectedProject;
          setSelectedProject(projectFromNav || data.projects[0]?._id || null);
        }
      } else {
        console.error("Failed to fetch projects:", data.message);
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  const fetchTasks = async () => {
    if (!selectedProject) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/tasks/${selectedProject}?userId=${currentUser._id}`
      );
      const data = await res.json();
      if (res.ok) {
        setTasks(data.tasks || []);
      } else {
        console.error("Failed to fetch tasks:", data.message);
      }
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location.state?.selectedProject) {
      setSelectedProject(location.state.selectedProject);
    }
  }, [location.state?.selectedProject]);

  useEffect(() => {
    if (!selectedWorkSpace) return;
    fetchProjects();
  }, [selectedWorkSpace]);

  useEffect(() => {
    fetchTasks();
  }, [selectedProject]);

  const todo = tasks.filter((t) => t.status === "todo");
  const inprogress = tasks.filter((t) => t.status === "inprogress");
  const done = tasks.filter((t) => t.status === "done");

  return (
    <div className="task-container">
      <div className="local-header flex align-item-center justify-content-space">
        <h3 className="local-header-title">Tasks</h3>
        <div className="workspace-selector-container">
          <div
            className="workspace-selector"
            style={{ width: "130px" }}
            onClick={() => setIsSelecter(!isSelecter)}
          >
            <span className="selector-workspace-name">
              {projects.find((p) => p._id === selectedProject)?.title ||
                "Select Project"}
            </span>
            <ChevronDownIcon size={12} className="selector-workspace-icon" />
          </div>
          {isSelecter && (
            <div style={{ right: "0px" }} className="workspace-dropdown">
              {projects.map((item) => (
                <div
                  key={item._id}
                  className="workspace-dropdown-item"
                  onClick={() => {
                    setSelectedProject(item._id);
                    setIsSelecter(false);
                  }}
                >
                  {item.title}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="task-header flex justify-content-space">
        <div className="task-tabs">
          <span
            onClick={() => {
              setActiveTab("alltasks");
            }}
            className={`task-tab ${activeTab === "alltasks" && "active"}`}
          >
            All Tasks
          </span>
          <span
            onClick={() => {
              setActiveTab("todo");
            }}
            className={`task-tab ${activeTab === "todo" && "active"}`}
          >
            To Do
          </span>
          <span
            onClick={() => {
              setActiveTab("inprogress");
            }}
            className={`task-tab ${activeTab === "inprogress" && "active"}`}
          >
            In Progress
          </span>
          <span
            onClick={() => {
              setActiveTab("done");
            }}
            className={`task-tab ${activeTab === "done" && "active"}`}
          >
            Done
          </span>
        </div>

        {workspaceData?.createdBy === currentUser?._id ? (
          <button
            onClick={() => {
              setIsCreateTask(true);
              setIsSelecter(false);
            }}
            className="task-add-btn"
          >
            <CirclePlus size={18} />
            Add Task
          </button>
        ) : (
          <div className="task-status-summary">
            <h4>Status:</h4>
            <span>{todo.length} To Do</span>
            <span>{inprogress.length} In Progress</span>
            <span>{done.length} Done</span>
          </div>
        )}
      </div>
      {loading ? (
        <Loader
          loading={true}
          size="50"
          style={{ height: "50vh", width: "100%" }}
        />
      ) : (
        <div className="task-board">
          {(activeTab === "alltasks" || activeTab === "todo") && (
            <div className="task-column-outer-container">
              <div className="task-column-header">
                <h3>To Do</h3>
                <span>{todo.length}</span>
              </div>
              <div className="task-column">
                {todo.length > 0 ? (
                  todo.map((task) => (
                    <div
                      key={task._id}
                      className="task-card flex justify-content-center"
                    >
                      <div className="task-card-top-side">
                        <div>
                          <h4 className="task-card-title">{task.title}</h4>
                          <p className="task-card-disc">{task.discription}</p>
                        </div>
                        <div>
                          <button onClick={() => {}}>To Do</button>
                        </div>
                      </div>
                      <div className="task-card-bottom-side">
                        <div>
                          AssignedTo: <span>{task?.assignedTo?.length}</span>
                        </div>
                        <div>
                          <Calendar />
                          {new Date(task.dueDate).toLocaleDateString("en-US")}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="task-empty-container">
                    <p className="task-empty">No tasks</p>
                  </div>
                )}
              </div>
            </div>
          )}
          {(activeTab === "alltasks" || activeTab === "inprogress") && (
            <div className="task-column-outer-container">
              <div className="task-column-header">
                <h3>In Progress</h3>
                <span>{inprogress.length}</span>
              </div>
              <div className="task-column">
                {inprogress.length > 0 ? (
                  inprogress.map((task) => (
                    <div key={task._id} className="task-card">
                      <h4 className="task-card-title">{task.title}</h4>
                      <p className="task-card-desc">{task.description}</p>
                    </div>
                  ))
                ) : (
                  <div className="task-empty-container">
                    <p className="task-empty">No tasks</p>
                  </div>
                )}
              </div>
            </div>
          )}
          {(activeTab === "alltasks" || activeTab === "done") && (
            <div className="task-column-outer-container">
              <div className="task-column-header">
                <h3>Done</h3>
                <span>{done.length}</span>
              </div>
              <div className="task-column">
                {done.length > 0 ? (
                  done.map((task) => (
                    <div key={task._id} className="task-card">
                      <h4 className="task-card-title">{task.title}</h4>
                      <p className="task-card-desc">{task.description}</p>
                    </div>
                  ))
                ) : (
                  <div className="task-empty-container">
                    <p className="task-empty">No tasks</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      {isCreateTask && (
        <CreateTasks
          onClose={() => {
            setIsCreateTask(false);
            fetchTasks();
          }}
          selectedProject={selectedProject}
        />
      )}
    </div>
  );
};

export default MyTasks;
