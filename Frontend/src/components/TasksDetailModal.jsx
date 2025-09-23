import { X } from "lucide-react";
import React from "react";

const TasksDetailModal = ({ onClose, details }) => {
  return (
    <div onClick={onClose} className="modal-overlay">
      <div onClick={(e) => e.stopPropagation()} className="modal-content">
        <div className="modal-header flex align-item-center justify-content-space">
          <h3 className="modal-title">Task Details</h3>
          <button onClick={onClose} className="modal-close-btn">
            <X size={15} color="#757575" />
          </button>
        </div>
        <div className="task-modal-body">
          <div className="task-modal-title-desc-container">
            <h3>{details?.title}</h3>
            <p>{details?.discription}</p>
          </div>
          <div className="task-modal-other-details">
            <div className="task-modal-status-span flex f-column justify-content-center">
              <span>
                <strong>Due Date:</strong>
                <p>{new Date(details?.dueDate).toLocaleDateString()}</p>
              </span>
              <span>
                <strong>Created At:</strong>
                <p>{new Date(details?.createdAt).toLocaleDateString()}</p>
              </span>
            </div>
            <span className="task-modal-status-span">
              <strong>Assigned:</strong>
              <p style={{ color: "#2166fe" }}>{details?.assignedTo?.length}</p>
            </span>
            <span className="task-modal-status-span">
              <strong>Status:</strong>
              <p style={{ color: "#2166fe" }}>{details?.status}</p>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasksDetailModal;
