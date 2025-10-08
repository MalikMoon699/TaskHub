import { X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import { useNavigate, useOutletContext } from "react-router";

const CreateProject = ({ onClose }) => {
  const { selectedWorkSpace } = useOutletContext();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [projectMembers, setProjectMembers] = useState([]);
  const [projectMembersError, setProjectMembersError] = useState("");
  const [isSelectMembers, setIsSelectMembers] = useState(false);
  const [workspaceMembers, setWorkspaceMMembers] = useState([]);
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState("");
  const [discription, setDiscription] = useState("");
  const [status, setStatus] = useState("Plaining");
  const [startDate, setStartDate] = useState("");
  const [startDateError, setStartDateError] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueDateError, setDueDateError] = useState("");
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

  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    setStartDate(today.toISOString().split("T")[0]);
    setDueDate(tomorrow.toISOString().split("T")[0]);
  }, []);

  const validation = () => {
    let isValid = true;

    // Reset errors
    setTitleError("");
    setStartDateError("");
    setDueDateError("");
    setProjectMembersError("");

    if (!title) {
      setTitleError("Project title is required!");
      isValid = false;
    }

    if (!startDate) {
      setStartDateError("Project start date is required!");
      isValid = false;
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // reset time
      const start = new Date(startDate);

      if (start < today) {
        setStartDateError("Start date cannot be before today!");
        isValid = false;
      }
    }

    if (!dueDate) {
      setDueDateError("Project due date is required!");
      isValid = false;
    } else {
      const start = new Date(startDate);
      const due = new Date(dueDate);

      if (due <= start) {
        setDueDateError("Due date must be after start date!");
        isValid = false;
      }
    }

    if (projectMembers.length < 1) {
      setProjectMembersError("You must add at least one member!");
      isValid = false;
    }

    return isValid;
  };

  const handleCreate = async () => {
    if (!validation()) return;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/project`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            discription,
            status,
            startDate,
            dueDate,
            workspaceId: selectedWorkSpace,
            members: projectMembers.map((m) => m._id),
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) return alert(data.message);

      toast.success("Project created successfully!");
      onClose();
      navigate("/projects");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!selectedWorkSpace) return;

    const fetchMembers = async () => {
      try {
        const res = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/workspaces/members/${selectedWorkSpace}`
        );
        const data = await res.json();

        if (res.ok) {
          setWorkspaceMMembers(data.members || []);
        } else {
          console.error("Failed to fetch members:", data.message);
        }
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };

    fetchMembers();
  }, [selectedWorkSpace]);

  const getFormattedDate = (date) => date.toISOString().split("T")[0];
  const today = new Date();
  const todayStr = getFormattedDate(today);

  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const tomorrowStr = getFormattedDate(tomorrow);

  return (
    <div onClick={onClose} className="modal-overlay">
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="modal-content"
      >
        <div className="modal-header flex align-item-center justify-content-space">
          <h3 className="modal-title">Create Project</h3>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={15} color="#757575" />
          </button>
        </div>
        <p style={{ fontSize: "10px", fontWeight: "500", color: "#908888" }}>
          Make a new project to start tracking progress.
        </p>
        <div className="modal-body signup-form">
          <div className="form-group">
            <label className="form-label" htmlFor="">
              Project title
            </label>
            <input
              className="form-input"
              type="text"
              placeholder="Project title"
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
              Status
            </label>
            <select
              className="form-selector"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Plaining">Plaining</option>
              <option value="InProgress">In Progress</option>
              <option value="OnHold">On Hold</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div style={{ gap: "10px" }} className="flex align-item-center">
            <div className="form-group">
              <label className="form-label" htmlFor="">
                Start Date
              </label>
              <input
                className="form-input"
                type="date"
                style={{ borderColor: startDateError ? "red" : "" }}
                placeholder="Project title"
                value={startDate}
                min={todayStr}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setStartDateError("");
                }}
              />
              {startDateError && (
                <p className="error-message">{startDateError}</p>
              )}
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
          </div>
          <div className="form-group" ref={dropdownRef}>
            <label className="form-label" htmlFor="">
              Members
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
              {projectMembers.length > 0 ? (
                projectMembers.map((item, index) => (
                  <span key={index}>
                    {item.name}

                    {index !== projectMembers.length - 1 && ","}
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
                  {workspaceMembers.map((member) => {
                    const isSelected = projectMembers.some(
                      (m) => m._id === member._id
                    );
                    return (
                      <label
                        key={member._id}
                        className="create-project-member-item"
                      >
                        <input
                          type="checkbox"
                          className="create-project-member-checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setProjectMembers([...projectMembers, member]);
                              setProjectMembersError("");
                            } else {
                              setProjectMembers(
                                projectMembers.filter(
                                  (m) => m._id !== member._id
                                )
                              );
                            }
                          }}
                        />
                        <p className="create-project-member-name">
                          {member.name}
                        </p>
                      </label>
                    );
                  })}
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
              className="create-btn"
            >
              Create project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;
