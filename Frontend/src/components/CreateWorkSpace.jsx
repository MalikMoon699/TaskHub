import { X } from "lucide-react";
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import Loader from "./Loader";

const CreateWorkSpace = ({ onClose,fetchWorkSpaces }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [selectedColor, setSelectedColor] = useState("Red");
  const [name, setName] = useState("");
  const [discription, setDiscription] = useState("");
  const [nameError, setNameError] = useState("");
  const [loading, setLoading] = useState(false);

  const colors = [
    "Red",
    "Blue",
    "Green",
    "Yellow",
    "Purple",
    "Orange",
    "#44da44",
    "DarkBlue",
  ];

  const handleCreate = async () => {
    if (!name) {
      setNameError("Workspace name is required!");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/workspaces`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            discription,
            workspaceColor: selectedColor,
            userId: currentUser._id,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) return alert(data.message);

      toast.success("Workspace created successfully!");
      navigate("/workspaces");
      onClose();
      fetchWorkSpaces()
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div disabled={loading} onClick={onClose} className="modal-overlay">
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="modal-content"
      >
        <div className="modal-header flex align-item-center justify-content-space">
          <h3 className="modal-title">Create New Workspace</h3>
          <button
            disabled={loading}
            className="modal-close-btn"
            onClick={onClose}
          >
            <X size={15} color="#757575" />
          </button>
        </div>
        <div className="modal-body signup-form">
          <div className="form-group">
            <label className="form-label" htmlFor="">
              Workspace Name
            </label>
            <input
              className="form-input"
              type="text"
              placeholder="Workspace Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setNameError("");
              }}
            />
            {nameError && <p className="empty-message">{nameError}</p>}
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="">
              Workspace Description{" "}
              <span className="label-span">(Optional)</span>
            </label>
            <textarea
              className="form-textarea"
              type="text"
              placeholder="Workspace Description"
              value={discription}
              onChange={(e) => {
                setDiscription(e.target.value);
              }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="" className="form-label">
              Workspace Color
            </label>
            <div className="color-list flex align-item-center justify-content-start">
              {colors.map((color, index) => (
                <div
                  onClick={() => setSelectedColor(color)}
                  className={selectedColor === color ? "color-active" : ""}
                  key={index}
                >
                  <div style={{ background: color }} className="color-item">
                    <span className="color-dot"></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div
            style={{ gap: "5px", marginBottom: "-20px" }}
            className="flex align-item-center justify-content-end"
          >
            <button disabled={loading} onClick={onClose} className="cencel-btn">
              Cancel
            </button>
            <button
              disabled={loading}
              onClick={handleCreate}
              className="create-btn"
            >
              {loading ? (
                <Loader
                  color="white"
                  size="18"
                  style={{ height: "20px", width: "46px" }}
                  loading={true}
                />
              ) : (
                "Create"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateWorkSpace;
