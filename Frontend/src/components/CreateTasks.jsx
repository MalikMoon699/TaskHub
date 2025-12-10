import { X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import Loader from "./Loader";
import { useNavigate } from "react-router";

const CreateTasks = ({ onClose, selectedProject, editData }) => {
  const navigate = useNavigate();
  const [projectMembers, setProjectMembers] = useState([]);
  const [isSelectMembers, setIsSelectMembers] = useState(false);
  const [projectMembersError, setProjectMembersError] = useState("");
  const [assignMembers, setAssignMembers] = useState(
    editData?.assignedTo || []
  );
  const [title, setTitle] = useState(editData?.title || "");
  const [titleError, setTitleError] = useState("");
  const [discription, setDiscription] = useState(editData?.discription || "");
  const [status, setStatus] = useState(editData?.status || "todo");
  const [dueDate, setDueDate] = useState(
    editData?.dueDate ? editData.dueDate.split("T")[0] : ""
  );
  const [dueDateError, setDueDateError] = useState("");
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsSelectMembers(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const validation = () => {
    let isValid = true;
    setTitleError("");
    setDueDateError("");
    setProjectMembersError("");

    if (!title) {
      setTitleError("Task title is required!");
      isValid = false;
    }

    if (assignMembers.length < 1) {
      setProjectMembersError("You must add at least one member!");
      isValid = false;
    }

    if (!dueDate) {
      setDueDateError("Due date is required!");
      isValid = false;
    } else {
      const selectedDate = new Date(dueDate);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate());

      if (selectedDate < tomorrow) {
        setDueDateError("Due date must be at least tomorrow or later!");
        isValid = false;
      }
    }

    return isValid;
  };

  const handleCreate = async () => {
    if (!validation()) return;
    setLoading(true);
    try {
      const url = editData
        ? `${import.meta.env.VITE_BACKEND_URL}/api/tasks/edit/${
            editData._id
          }/details`
        : `${import.meta.env.VITE_BACKEND_URL}/api/tasks`;

      const method = editData ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          discription,
          status,
          dueDate,
          projectId: selectedProject,
          assignedTo: assignMembers.map((m) => m._id),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        console.error(data.message || "Failed to save task");
        return;
      }

      toast.success(editData ? "Task updated successfully!" : "Task created!");
      onClose();
      navigate("/mytasks");
    } catch (error) {
      console.error(error);
      toast.error("Server error while saving task");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedProject) return;

    const fetchMembers = async () => {
      try {
        const res = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/project/members/${selectedProject}`
        );
        const data = await res.json();

        if (res.ok) {
          setProjectMembers(data.members || []);
        } else {
          console.error("Failed to fetch members:", data.message);
        }
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };

    fetchMembers();
  }, [selectedProject]);

  const getFormattedDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  const today = new Date();
  const todayStr = getFormattedDate(today);

  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const tomorrowStr = getFormattedDate(tomorrow);

  return (
    <div disabled={loading} onClick={onClose} className="modal-overlay">
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="modal-content"
      >
        <div className="modal-header flex align-item-center justify-content-space">
          <h3 className="modal-title">
            {editData ? "Edit Task" : "Create New Task"}
          </h3>

          <button
            className="modal-close-btn"
            disabled={loading}
            onClick={onClose}
          >
            <X size={15} color="#757575" />
          </button>
        </div>
        <div className="modal-body signup-form">
          <div className="form-group">
            <label className="form-label" htmlFor="">
              Title
            </label>
            <input
              className="form-input"
              type="text"
              placeholder="Task title"
              style={{ borderColor: titleError ? "red" : "" }}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setTitleError("");
              }}
            />
            {titleError && <p className="error-message">{titleError}</p>}
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="">
              Description <span className="label-span">(Optional)</span>
            </label>
            <textarea
              className="form-textarea"
              type="text"
              placeholder="Description"
              value={discription}
              onChange={(e) => {
                setDiscription(e.target.value);
              }}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="">
              Due Date
            </label>
            <input
              className="form-input"
              type="date"
              placeholder="Project title"
              style={{ borderColor: dueDateError ? "red" : "" }}
              value={dueDate}
              min={tomorrowStr}
              onChange={(e) => {
                setDueDate(e.target.value);
                setDueDateError("");
              }}
            />
            {dueDateError && <p className="error-message">{dueDateError}</p>}
          </div>
          <div className="form-group" ref={dropdownRef}>
            <label className="form-label" htmlFor="">
              Assignees
            </label>
            <div
              style={{
                borderColor: projectMembersError ? "red" : "",
                cursor: "pointer",
                position: "relative",
              }}
              className="form-input"
              onClick={() => {
                setIsSelectMembers((prev) => !prev);
              }}
            >
              {assignMembers.length > 0 ? (
                assignMembers.map((item, index) => (
                  <span key={index}>
                    {item.name}
                    {index !== assignMembers.length - 1 && ","}
                  </span>
                ))
              ) : (
                <p style={{ color: "rgb(55 65 81 / 38%)" }}>
                  Assign to team members
                </p>
              )}

              {isSelectMembers && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="create-project-members-list"
                >
                  {projectMembers.map((member) => (
                    <div
                      key={member._id}
                      className="create-project-member-item"
                    >
                      <input
                        type="checkbox"
                        className="create-project-member-checkbox"
                        checked={assignMembers.some(
                          (m) => m._id === member._id
                        )}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setAssignMembers([...assignMembers, member]);
                            setProjectMembersError("");
                          } else {
                            setAssignMembers(
                              assignMembers.filter((m) => m._id !== member._id)
                            );
                          }
                        }}
                      />

                      <p className="create-project-member-name">
                        {member.name}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {projectMembersError && (
              <p className="error-message">{projectMembersError}</p>
            )}
          </div>
          <div
            style={{ gap: "5px", marginBottom: "-20px" }}
            className="flex align-item-center justify-content-end"
          >
            <button
              style={{ padding: "4px 8px", borderRadius: "6px" }}
              onClick={handleCreate}
              disabled={loading}
              className="create-btn"
            >
              {loading ? (
                <Loader
                  color="white"
                  size="16"
                  style={{ height: "20px", width: "80px" }}
                  loading={true}
                />
              ) : editData ? (
                "Update Task"
              ) : (
                "Create Task"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTasks;
