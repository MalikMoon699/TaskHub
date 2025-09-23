import React, { useEffect, useState } from "react";
import "../assets/styles/Setting.css";
import { useOutletContext } from "react-router";
import { X } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

const Settings = () => {
  const { currentUser } = useAuth();
  const { selectedWorkSpace } = useOutletContext();
  const [loading, setLoading] = useState(false);
  const [workspaceName, setWorkSpaceName] = useState("");
  const [workspaceDescription, setWorkSpaceDescription] = useState("");
  const [selectedColor, setSelectedColor] = useState("Red");
  const [workspaceData, setWorkspaceData] = useState(null);
  const [workspaceTransfer, setWorkspaceTransfer] = useState(false);
  const [changeLoading, setChnageLoading] = useState(false);
  const [transferLoading, setTransferLoading] = useState(false);
  const [workspaceTransferMember, setWorkspaceTransferMember] = useState("");
  const [workspaceDelete, setWorkspaceDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [workspaceDeleteInput, setWorkspaceDeleteInput] = useState("");
  const [workspaceDeleteErrorInput, setWorkspaceDeleteErrorInput] =
    useState("");

  const colors = [
    "Red",
    "Blue",
    "Green",
    "Yellow",
    "Purple",
    "Orange",
    "Green",
    "DarkBlue",
  ];

    useEffect(() => {
        document.title = "TaskHub | Settings";
      }, []);

  const fetchWorkspace = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/workspaces/workspace/${selectedWorkSpace}`
      );
      const data = await res.json();
      if (res.ok) {
        setWorkspaceData(data.workspace);
      } else {
        console.error("Failed to fetch workspace:", data.message);
      }
    } catch (err) {
      console.error("Error fetching workspace:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedWorkSpace) return;
    fetchWorkspace();
  }, [selectedWorkSpace]);

  useEffect(() => {
    if (workspaceData) {
      setWorkSpaceName(workspaceData.name || "");
      setWorkSpaceDescription(workspaceData.discription || "");
      setSelectedColor(workspaceData.workspaceColor || "Red");
      setWorkspaceTransferMember(workspaceData.createdBy || "");
    }
  }, [workspaceData]);

  const getFirstLetter = () => {
    if (!currentUser) return "?";
    const name = currentUser.name || currentUser.email || "";
    return name.charAt(0).toUpperCase();
  };

  const handleChangings = async () => {
    setChnageLoading(true);
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/workspaces/workspace/${selectedWorkSpace}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: workspaceName,
            discription: workspaceDescription,
            workspaceColor: selectedColor,
          }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setWorkspaceData(data.workspace);
        toast.success("Workspace updated successfully");
      } else {
        console.error("Failed to update workspace:", data.message);
      }
    } catch (error) {
      console.error("Error updating workspace:", error);
    } finally {
      setChnageLoading(false);
    }
  };

  const handleTransfer = async () => {
    setTransferLoading(true);
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/workspaces/workspace/${selectedWorkSpace}/transfer`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newOwnerId: workspaceTransferMember }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setWorkspaceData(data.workspace);
        setWorkspaceTransfer(false);
        toast.success("Workspace ownership transfer successfully");
      } else {
        console.error("Failed to transfer ownership:", data.message);
      }
    } catch (error) {
      console.error("Error transferring ownership:", error);
    } finally {
      setTransferLoading(false);
    }
  };

  const handleDelete = async () => {
    if (workspaceDeleteInput !== workspaceData?.name) {
      setWorkspaceDeleteErrorInput("Workspace name does not match");
      return;
    }
    setDeleteLoading(true);
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/workspaces/workspace/${selectedWorkSpace}`,
        { method: "DELETE" }
      );

      const data = await res.json();
      if (res.ok) {
        console.log("Workspace deleted:", data.message);
        toast.success(`${workspaceDeleteInput} Workspace deleted successfully`);
        window.location.href = "/";
      } else {
        console.error("Failed to delete workspace:", data.message);
      }
    } catch (error) {
      console.error("Error deleting workspace:", error);
    } finally {
      setDeleteLoading(false);
    }
  };


  return loading ? (
    <Loader
      loading={true}
      size="50"
      style={{ height: "80vh", width: "100%" }}
    />
  ) : (
    <div className="settings-container">
      <div className="settings-section">
        <h2 className="settings-section-title">Workspace Settings</h2>
        <p className="settings-section-subtitle">
          Manage your workspace settings and preferences
        </p>

        <div className="form-group">
          <label className="settings-label">Workspace Name</label>
          <input
            type="text"
            className="form-input"
            placeholder="Enter workspace name"
            value={workspaceName}
            onChange={(e) => setWorkSpaceName(e.target.value)}
          />
        </div>
        <div>
          <div className="form-group">
            <label className="settings-label">Description</label>
            <textarea
              className="form-textarea"
              value={workspaceDescription}
              placeholder="Enter workspace description"
              onChange={(e) => setWorkSpaceDescription(e.target.value)}
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

          <button
            disabled={changeLoading}
            onClick={handleChangings}
            className="settings-save-btn"
          >
            {changeLoading ? (
              <Loader
                color="white"
                size="18"
                style={{ height: "20px", width: "102px" }}
                loading={true}
              />
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>

      <div className="settings-section">
        <h3 className="settings-subheading">Transfer Workspace</h3>
        <p className="settings-section-subtitle">
          Transfer ownership of this workspace to another member
        </p>
        <button
          onClick={() => setWorkspaceTransfer(true)}
          className="settings-transfer-btn"
        >
          Transfer Workspace
        </button>
      </div>

      <div className="settings-danger-zone">
        <h3 style={{ color: "red" }} className="settings-subheading">
          Danger Zone
        </h3>
        <p className="settings-section-subtitle">
          Irreversible actions for your workspace
        </p>
        <button
          onClick={() => {
            setWorkspaceDelete(true);
          }}
          className="settings-delete-btn"
        >
          Delete Workspace
        </button>
      </div>
      {workspaceTransfer && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header flex align-item-center justify-content-space">
              <h3 className="modal-title">
                Testing Transfer Workspace Ownership
              </h3>
              <button
                disabled={transferLoading}
                onClick={() => setWorkspaceTransfer(false)}
                className="modal-close-btn"
              >
                <X size={15} color="#757575" />
              </button>
            </div>
            <p
              style={{
                fontSize: "10px",
                fontWeight: "500",
                color: "rgb(144, 136, 136)",
              }}
            >
              Select a member to transfer ownership of this workspace. This
              action cannot be undone.
            </p>
            <div style={{ marginTop: "10px" }}>
              {workspaceData?.members?.map((member, index) => (
                <div
                  onClick={() => setWorkspaceTransferMember(member._id)}
                  className={`transfer-members ${
                    workspaceTransferMember === member._id
                      ? "members-transfer-active"
                      : ""
                  }`}
                  key={member?._id || index}
                >
                  <div className="members-avatar">
                    <span>{getFirstLetter(member.name)}</span>
                  </div>
                  <div className="members-info">
                    <h4 className="members-name">{member.name}</h4>
                    <p className="members-email">{member.email}</p>
                  </div>
                </div>
              ))}
            </div>
            <div
              style={{ gap: "10px" }}
              className="flex align-item-center justify-content-end"
            >
              <button
                disabled={transferLoading}
                onClick={() => setWorkspaceTransfer(false)}
                className="cencel-btn"
              >
                Cencel
              </button>
              <button
                disabled={transferLoading}
                onClick={handleTransfer}
                className="create-btn"
              >
                {transferLoading ? (
                  <Loader
                    color="white"
                    size="18"
                    style={{ height: "20px", width: "46px" }}
                    loading={true}
                  />
                ) : (
                  "Transfer"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {workspaceDelete && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header flex align-item-center justify-content-space">
              <h3 className="modal-title">Delete Workspace</h3>
              <button
                disabled={deleteLoading}
                onClick={() => setWorkspaceDelete(false)}
                className="modal-close-btn"
              >
                <X size={15} color="#757575" />
              </button>
            </div>
            <p
              style={{
                fontSize: "10px",
                fontWeight: "500",
                color: "rgb(144, 136, 136)",
              }}
            >
              Please type{" "}
              <strong style={{ color: "red" }}>
                " {workspaceData?.name} "
              </strong>{" "}
              to confirm deletion. This action cannot be undone.
            </p>
            <div className="form-group" style={{ marginTop: "10px" }}>
              <input
                type="text"
                className="form-input"
                placeholder="Enter workspace name"
                value={workspaceDeleteInput}
                style={{ borderColor: workspaceDeleteErrorInput ? "red" : "" }}
                onChange={(e) => {
                  setWorkspaceDeleteInput(e.target.value);
                  setWorkspaceDeleteErrorInput("");
                }}
              />
            </div>
            {workspaceDeleteErrorInput && (
              <p className="error-message">{workspaceDeleteErrorInput}</p>
            )}
            <div
              style={{ gap: "10px", marginTop: "10px" }}
              className="flex align-item-center justify-content-end"
            >
              <button
                disabled={deleteLoading}
                onClick={() => setWorkspaceDelete(false)}
                className="cencel-btn"
              >
                Cencel
              </button>
              <button
                disabled={deleteLoading}
                onClick={handleDelete}
                className="create-btn"
              >
                {deleteLoading ? (
                  <Loader
                    color="white"
                    size="18"
                    style={{ height: "20px", width: "46px" }}
                    loading={true}
                  />
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
