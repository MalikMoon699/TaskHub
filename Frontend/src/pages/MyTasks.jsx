import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Calendar, ChevronDownIcon, CirclePlus } from "lucide-react";
import { useOutletContext, useLocation } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import "../assets/styles/MyTasks.css";
import CreateTasks from "../components/CreateTasks";
import Loader from "../components/Loader";
import TasksDetailModal from "../components/TasksDetailModal";
import { toast } from "sonner";

const apiFetchJson = async (url, opts = {}) => {
  const res = await fetch(url, opts);
  const text = await res.text().catch(() => "");
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = {};
  }
  if (!res.ok) {
    const msg = data?.message || data?.error || `Request failed: ${res.status}`;
    const err = new Error(msg);
    err.response = data;
    throw err;
  }
  return data;
};

const useLocalStorageState = (key, defaultValue) => {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      if (state === undefined) return;
      localStorage.setItem(key, JSON.stringify(state));
    } catch (e) {
    }
  }, [key, state]);

  return [state, setState];
};


const ProjectDropdown = ({ projects, selectedProject, onSelect }) => {
  return (
    <div className="workspace-selector-container">
      <div
        className="workspace-selector workspace-dropdown-right"
        style={{ width: "130px" }}
      >
        <span className="selector-workspace-name">
          {projects.find((p) => p._id === selectedProject)?.title ||
            "Select Project"}
        </span>
        <ChevronDownIcon size={12} className="selector-workspace-icon" />
        <div className="workspace-dropdown workspace-dropdown-right">
          {projects.map((item) => (
            <div
              key={item._id}
              className="workspace-dropdown-item"
              onClick={() => onSelect(item._id)}
            >
              {item.title}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const TaskCard = ({
  task,
  onOpenDetail,
  onRightClick,
  onStatusClick,
  currentUserIsOwner,
}) => {
  return (
    <div
      key={task._id}
      onClick={() => onOpenDetail(task)}
      onContextMenu={(e) => {
        if (currentUserIsOwner) {
          e.preventDefault();
          onRightClick(e, task);
        }
      }}
      className="task-card flex justify-content-center"
    >
      <div className="task-card-top-side">
        <div className="task-card-info">
          <h4 className="task-card-title">{task.title}</h4>
          <p className="task-card-disc">{task.discription}</p>
        </div>
        <div className="task-card-status">
          <button
            className="task-card-status-btn"
            onClick={(e) => {
              e.stopPropagation();
              onStatusClick(task);
            }}
            style={
              task.status === "todo"
                ? { backgroundColor: "#f59e0b1a", color: "#b45309" }
                : task.status === "inprogress"
                ? {
                    backgroundColor: "rgb(33 102 254 / 9%)",
                    color: "rgb(33 102 254)",
                  }
                : {
                    backgroundColor: "rgba(9, 180, 126, 0.11)",
                    color: "rgb(9 180 126 / 83%)",
                  }
            }
          >
            {task.status === "todo"
              ? "To Do"
              : task.status === "inprogress"
              ? "In Progress"
              : "Done"}
          </button>
        </div>
      </div>
      <div className="task-card-bottom-side">
        <div className="task-card-assigned">
          <strong>Assigned:</strong>{" "}
          <span className="task-card-assigned-count">
            {String(task?.assignedTo?.length || 0).padStart(2, "0")}
          </span>
        </div>
        <div className="task-card-due-date">
          <Calendar size={12} className="task-card-calendar" />
          <span className="task-card-due-text">
            {task.dueDate
              ? new Date(task.dueDate).toLocaleDateString("en-US")
              : "-"}
          </span>
        </div>
      </div>
    </div>
  );
};

const TaskColumn = ({ title, tasks, count, children }) => {
  return (
    <div
      className="task-column-outer-container"
    >
      <div className="task-column-header">
        <h3>{title}</h3>
        <span>{count}</span>
      </div>
      <div className="task-column">{children}</div>
    </div>
  );
};

const ContextMenu = ({ x, y, onEdit, onDelete }) => {
  if (x == null || y == null) return null;
  const style = {
    position: "absolute",
    top: y,
    left: x,
    zIndex: 1000,
    background: "#fff",
    borderRadius: "6px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    padding: "5px 0",
    width: "120px",
  };
  return (
    <div className="context-menu" style={style}>
      <p
        className="context-item"
        onClick={onEdit}
        style={{ padding: "8px 12px", cursor: "pointer", fontSize: "14px" }}
      >
        Edit
      </p>
      <p
        className="context-item"
        onClick={onDelete}
        style={{
          padding: "8px 12px",
          cursor: "pointer",
          fontSize: "14px",
          color: "red",
        }}
      >
        Delete
      </p>
    </div>
  );
};

const MyTasks = () => {
  const { currentUser } = useAuth();
  const { selectedWorkSpace, workspaceData } = useOutletContext();
  const location = useLocation();

  const BACKEND = import.meta.env.VITE_BACKEND_URL || "";

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedProject, setSelectedProject] = useLocalStorageState(
    "selectedProject",
    null
  );
  const [editTask, setEditTask] = useState(null);
  const [activeTab, setActiveTab] = useState("alltasks");
  const [isCreateTask, setIsCreateTask] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDetailModal, setIsDetailModal] = useState(false);
  const [isDetail, setIsDetail] = useState(null);
  const [contextMenu, setContextMenu] = useState({
    x: null,
    y: null,
    task: null,
  });

  const projectsAbortRef = useRef(null);
  const tasksAbortRef = useRef(null);

  const isWorkspaceOwner = workspaceData?.createdBy === currentUser?._id;

  const handleSelectProject = useCallback(
    (projectId) => {
      setSelectedProject(projectId);
    },
    [setSelectedProject]
  );

  useEffect(() => {
    if (location.state?.selectedProject) {
      setSelectedProject(location.state.selectedProject);
    }
  }, [location.state?.selectedProject]);

  useEffect(() => {
    if (!selectedWorkSpace || !currentUser?._id) {
      setProjects([]);
      return;
    }

    if (projectsAbortRef.current) {
      projectsAbortRef.current.abort();
    }
    const ac = new AbortController();
    projectsAbortRef.current = ac;

    const load = async () => {
      try {
        setLoading(true);
        const url = `${BACKEND}/api/project/${selectedWorkSpace}?userId=${currentUser._id}`;
        const data = await apiFetchJson(url, { signal: ac.signal });
        const fetched = data.projects || [];
        setProjects(fetched);

        if (!selectedProject) {
          setSelectedProject((prev) => {
            if (location.state?.selectedProject)
              return location.state.selectedProject;
            return fetched[0]?._id || prev;
          });
        }
      } catch (err) {
        if (err.name === "AbortError") {
        } else {
          console.error("Failed to fetch projects:", err);
        }
      } finally {
        setLoading(false);
        projectsAbortRef.current = null;
      }
    };

    load();

    return () => {
      ac.abort();
    };
  }, [selectedWorkSpace, currentUser?._id]);

  const fetchTasks = useCallback(
    async (projId = selectedProject) => {
      if (!projId) {
        setTasks([]);
        return;
      }

      if (tasksAbortRef.current) tasksAbortRef.current.abort();
      const ac = new AbortController();
      tasksAbortRef.current = ac;

      try {
        setLoading(true);
        const url = `${BACKEND}/api/tasks/${projId}?userId=${currentUser._id}&workspaceOwner=${workspaceData?.createdBy}`;
        const data = await apiFetchJson(url, { signal: ac.signal });
        setTasks(data.tasks || []);
      } catch (err) {
        if (err.name === "AbortError") {
        } else {
          console.error("Failed to fetch tasks:", err);
        }
      } finally {
        setLoading(false);
        tasksAbortRef.current = null;
      }
    },
    [BACKEND, currentUser?._id, workspaceData?.createdBy, selectedProject]
  );

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks, selectedProject]);

  const todo = useMemo(() => tasks.filter((t) => t.status === "todo"), [tasks]);
  const inprogress = useMemo(
    () => tasks.filter((t) => t.status === "inprogress"),
    [tasks]
  );
  const done = useMemo(() => tasks.filter((t) => t.status === "done"), [tasks]);

  const haveProject = !!projects.find(
    (p) => p._id === selectedProject?.toString()
  );

  const updateTaskStatus = useCallback(
    async (taskId, newStatus) => {
      try {
        const url = `${BACKEND}/api/tasks/${taskId}/status`;
        const res = await fetch(url, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        });
        const payload = await res.json();
        if (!res.ok) {
          console.error(
            "Failed to update task status:",
            payload.message || payload
          );
          return;
        }
        await fetchTasks();
      } catch (err) {
        console.error("Error updating task status:", err);
      }
    },
    [BACKEND, fetchTasks]
  );

  const deleteTask = useCallback(
    async (taskId) => {
      if (!window.confirm("Are you sure you want to delete this task?")) return;
      try {
        const url = `${BACKEND}/api/tasks/${taskId}/delete`;
        const res = await fetch(url, { method: "DELETE" });
        const payload = await res.json();
        if (!res.ok) {
          console.error("Failed to delete task:", payload.message || payload);
          return;
        }
        await fetchTasks();
      } catch (err) {
        console.error("Error deleting task:", err);
      }
    },
    [BACKEND, fetchTasks]
  );

  const handleRightClick = useCallback((e, task) => {
    e.preventDefault();
    setContextMenu({ x: e.pageX, y: e.pageY, task });
  }, []);

  useEffect(() => {
    const handleDocClick = () =>
      setContextMenu({ x: null, y: null, task: null });
    window.addEventListener("click", handleDocClick);
    return () => window.removeEventListener("click", handleDocClick);
  }, []);

  const handleStatusClick = useCallback(
    (task) => {
      if (task.status === "todo")
        return updateTaskStatus(task._id, "inprogress");
      if (task.status === "inprogress")
        return updateTaskStatus(task._id, "done");
    },
    [updateTaskStatus]
  );

  const handleContextEdit = useCallback(() => {
    if (!contextMenu.task) return;
    setEditTask(contextMenu.task);
    setIsCreateTask(true);
    setContextMenu({ x: null, y: null, task: null });
  }, [contextMenu]);

  const handleContextDelete = useCallback(() => {
    if (!contextMenu.task) return;
    deleteTask(contextMenu.task._id);
    setContextMenu({ x: null, y: null, task: null });
  }, [contextMenu, deleteTask]);

  const openDetail = useCallback((task) => {
    setIsDetail(task);
    setIsDetailModal(true);
  }, []);

  const onCloseCreate = useCallback(() => {
    setIsCreateTask(false);
    setEditTask(null);
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    document.title = "TaskHub | Tasks";
  }, []);

  return (
    <div className="task-container">
      <div className="local-header flex align-item-center justify-content-space">
        <h3 className="local-header-title">Tasks</h3>

        <ProjectDropdown
          projects={projects}
          selectedProject={selectedProject}
          onSelect={(id) => {
            setSelectedProject(id);
          }}
        />
      </div>

      <div className="flex align-item-center justify-content-start task-selected-project-info">
        <h3>{projects.find((p) => p._id === selectedProject)?.title || ""}</h3>
        <p>
          {projects.find((p) => p._id === selectedProject)?.discription || ""}
        </p>
      </div>

      <div className="task-header flex justify-content-space">
        <div className="task-tabs">
          <span
            onClick={() => setActiveTab("alltasks")}
            className={`task-tab ${activeTab === "alltasks" ? "active" : ""}`}
          >
            All Tasks
          </span>
          <span
            onClick={() => setActiveTab("todo")}
            className={`task-tab ${activeTab === "todo" ? "active" : ""}`}
          >
            To Do
          </span>
          <span
            onClick={() => setActiveTab("inprogress")}
            className={`task-tab ${activeTab === "inprogress" ? "active" : ""}`}
          >
            In Progress
          </span>
          <span
            onClick={() => setActiveTab("done")}
            className={`task-tab ${activeTab === "done" ? "active" : ""}`}
          >
            Done
          </span>
        </div>

        {isWorkspaceOwner ? (
          <div
            onClick={() => {
              if (!selectedProject || !haveProject) {
                toast.info("Please select a project first");
              }
            }}
            className="inline-flex"
          >
            <button
              onClick={(e) => {
                if (!selectedProject || !haveProject) {
                  e.preventDefault();
                  return;
                }
                setIsCreateTask(true);
              }}
              className="task-add-btn"
            >
              <CirclePlus size={18} />
              Add Task
            </button>
          </div>
        ) : (
          <div className="task-status-summary">
            <h4>Status:</h4>
            <span>{haveProject ? todo.length : "0"} To Do</span>
            <span>{haveProject ? inprogress.length : "0"} In Progress</span>
            <span>{haveProject ? done.length : "0"} Done</span>
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
          {["alltasks", "todo"].includes(activeTab) && (
            <TaskColumn
              title="To Do"
              tasks={todo}
              count={haveProject ? todo.length : 0}
            >
              {haveProject && todo.length > 0 ? (
                todo.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onOpenDetail={openDetail}
                    onRightClick={handleRightClick}
                    onStatusClick={handleStatusClick}
                    currentUserIsOwner={isWorkspaceOwner}
                  />
                ))
              ) : (
                <div className="task-empty-container">
                  <p className="task-empty">No tasks</p>
                </div>
              )}
            </TaskColumn>
          )}

          {["alltasks", "inprogress"].includes(activeTab) && (
            <TaskColumn
              title="In Progress"
              tasks={inprogress}
              count={haveProject ? inprogress.length : 0}
            >
              {haveProject && inprogress.length > 0 ? (
                inprogress.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onOpenDetail={openDetail}
                    onRightClick={handleRightClick}
                    onStatusClick={handleStatusClick}
                    currentUserIsOwner={isWorkspaceOwner}
                  />
                ))
              ) : (
                <div className="task-empty-container">
                  <p className="task-empty">No tasks</p>
                </div>
              )}
            </TaskColumn>
          )}

          {["alltasks", "done"].includes(activeTab) && (
            <TaskColumn
              title="Done"
              tasks={done}
              count={haveProject ? done.length : 0}
            >
              {haveProject && done.length > 0 ? (
                done.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onOpenDetail={openDetail}
                    onRightClick={handleRightClick}
                    onStatusClick={handleStatusClick}
                    currentUserIsOwner={isWorkspaceOwner}
                  />
                ))
              ) : (
                <div className="task-empty-container">
                  <p className="task-empty">No tasks</p>
                </div>
              )}
            </TaskColumn>
          )}
        </div>
      )}

      <ContextMenu
        x={contextMenu.x}
        y={contextMenu.y}
        onEdit={handleContextEdit}
        onDelete={handleContextDelete}
      />

      {isCreateTask && (
        <CreateTasks
          onClose={() => {
            onCloseCreate();
          }}
          selectedProject={selectedProject}
          editData={editTask}
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
