import { Calendar, ChevronDownIcon, CirclePlus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useOutletContext, useLocation } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import "../assets/styles/MyTasks.css";
import CreateTasks from "../components/CreateTasks";
import Loader from "../components/Loader";
import TasksDetailModal from "../components/TasksDetailModal";

const MyTasks = () => {
  const { currentUser } = useAuth();
  const { selectedWorkSpace, workspaceData } = useOutletContext();
  const location = useLocation();

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isSelecter, setIsSelecter] = useState(false);
  const [selectedProject, setSelectedProject] = useState(() => {
    return localStorage.getItem("selectedProject") || null;
  });

  const [activeTab, setActiveTab] = useState("alltasks");
  const [isCreateTask, setIsCreateTask] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDetailModal, setIsDetailModal] = useState(false);
  const [isDetail, setIsDetail] = useState(null);

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
        }/api/tasks/${selectedProject}?userId=${
          currentUser._id
        }&workspaceOwner=${workspaceData?.createdBy}`
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
    if (selectedProject) {
      localStorage.setItem("selectedProject", selectedProject);
    }
    fetchTasks();
  }, [selectedProject]);

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/tasks/${taskId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        fetchTasks();
      } else {
        console.error("Failed to update task:", data.message);
      }
    } catch (err) {
      console.error("Error updating task status:", err);
    }
  };

  const todo = tasks.filter((t) => t.status === "todo");
  const inprogress = tasks.filter((t) => t.status === "inprogress");
  const done = tasks.filter((t) => t.status === "done");

  const selectedProjectObj = projects.find((p) => p._id === selectedProject);
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
      <div className="flex align-item-center justify-content-start task-selected-project-info">
        <h3>{selectedProjectObj?.title}</h3>
        <p>{selectedProjectObj?.discription}</p>
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
            <div
              style={{ width: activeTab === "alltasks" ? "32%" : "100%" }}
              className="task-column-outer-container"
            >
              <div className="task-column-header">
                <h3>To Do</h3>
                <span>{todo.length}</span>
              </div>
              <div className="task-column">
                {todo.length > 0 ? (
                  todo.map((task) => (
                    <div
                      key={task._id}
                      onClick={() => {
                        setIsDetail(task);
                        setIsDetailModal(true);
                      }}
                      className="task-card flex justify-content-center"
                    >
                      <div className="task-card-top-side">
                        <div className="task-card-info">
                          <h4 className="task-card-title">{task.title}</h4>
                          <p
                            style={
                              activeTab !== "alltasks"
                                ? {
                                    textOverflow: "unset",
                                    overflow: "visible",
                                    whiteSpace: "unset",
                                  }
                                : {}
                            }
                            className="task-card-disc"
                          >
                            {task.discription}
                          </p>
                        </div>
                        <div className="task-card-status">
                          <button
                            className="task-card-status-btn"
                            style={{
                              backgroundColor: "#f59e0b1a",
                              color: "#b45309",
                            }}
                            onClick={() => {
                              updateTaskStatus(task._id, "inprogress");
                            }}
                          >
                            To Do
                          </button>
                        </div>
                      </div>
                      <div className="task-card-bottom-side">
                        <div className="task-card-assigned">
                          <strong>Assigned:</strong>{" "}
                          <span className="task-card-assigned-count">
                            {String(task?.assignedTo?.length || 0).padStart(
                              2,
                              "0"
                            )}
                          </span>
                        </div>
                        <div className="task-card-due-date">
                          <Calendar size={12} className="task-card-calendar" />
                          <span className="task-card-due-text">
                            {new Date(task.dueDate).toLocaleDateString("en-US")}
                          </span>
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
            <div
              style={{ width: activeTab === "alltasks" ? "32%" : "100%" }}
              className="task-column-outer-container"
            >
              <div className="task-column-header">
                <h3>In Progress</h3>
                <span>{inprogress.length}</span>
              </div>
              <div className="task-column">
                {inprogress.length > 0 ? (
                  inprogress.map((task) => (
                    <div
                      key={task._id}
                      onClick={() => {
                        setIsDetail(task);
                        setIsDetailModal(true);
                      }}
                      className="task-card  flex justify-content-center"
                    >
                      <div className="task-card-top-side">
                        <div className="task-card-info">
                          <h4 className="task-card-title">{task.title}</h4>
                          <p
                            style={
                              activeTab !== "alltasks"
                                ? {
                                    textOverflow: "unset",
                                    overflow: "visible",
                                    whiteSpace: "unset",
                                  }
                                : {}
                            }
                            className="task-card-disc"
                          >
                            {task.discription}
                          </p>
                        </div>
                        <div className="task-card-status">
                          <button
                            className="task-card-status-btn"
                            style={{
                              backgroundColor: "rgb(33 102 254 / 9%)",
                              color: "rgb(33 102 254)",
                            }}
                            onClick={() => {
                              updateTaskStatus(task._id, "done");
                            }}
                          >
                            In Progress
                          </button>
                        </div>
                      </div>
                      <div className="task-card-bottom-side">
                        <div className="task-card-assigned">
                          <strong>Assigned:</strong>{" "}
                          <span className="task-card-assigned-count">
                            {String(task?.assignedTo?.length || 0).padStart(
                              2,
                              "0"
                            )}
                          </span>
                        </div>
                        <div className="task-card-due-date">
                          <Calendar size={12} className="task-card-calendar" />
                          <span className="task-card-due-text">
                            {new Date(task.dueDate).toLocaleDateString("en-US")}
                          </span>
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
          {(activeTab === "alltasks" || activeTab === "done") && (
            <div
              style={{ width: activeTab === "alltasks" ? "32%" : "100%" }}
              className="task-column-outer-container"
            >
              <div className="task-column-header">
                <h3>Done</h3>
                <span>{done.length}</span>
              </div>
              <div className="task-column">
                {done.length > 0 ? (
                  done.map((task) => (
                    <div
                      key={task._id}
                      onClick={() => {
                        setIsDetail(task);
                        setIsDetailModal(true);
                      }}
                      className="task-card  flex justify-content-center"
                    >
                      <div className="task-card-top-side">
                        <div className="task-card-info">
                          <h4 className="task-card-title">{task.title}</h4>
                          <p
                            style={
                              activeTab !== "alltasks"
                                ? {
                                    textOverflow: "unset",
                                    overflow: "visible",
                                    whiteSpace: "unset",
                                  }
                                : {}
                            }
                            className="task-card-disc"
                          >
                            {task.discription}
                          </p>
                        </div>
                        <div className="task-card-status">
                          <button
                            className="task-card-status-btn"
                            style={{
                              backgroundColor: "rgba(9, 180, 126, 0.11)",
                              color: "rgb(9 180 126 / 83%)",
                              cursor: "text",
                            }}
                          >
                            Done
                          </button>
                        </div>
                      </div>
                      <div className="task-card-bottom-side">
                        <div className="task-card-assigned">
                          <strong>Assigned:</strong>{" "}
                          <span className="task-card-assigned-count">
                            {String(task?.assignedTo?.length || 0).padStart(
                              2,
                              "0"
                            )}
                          </span>
                        </div>
                        <div className="task-card-due-date">
                          <Calendar size={12} className="task-card-calendar" />
                          <span className="task-card-due-text">
                            {new Date(task.dueDate).toLocaleDateString("en-US")}
                          </span>
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
      {isDetailModal && (
        <TasksDetailModal
          details={isDetail}
          onClose={() => {
            setIsDetailModal(false);
            setIsDetail(null);
          }}
        />
      )}
    </div>
  );
};

export default MyTasks;
