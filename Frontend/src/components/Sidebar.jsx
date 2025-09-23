import {
  BadgeCheck,
  LayoutDashboard,
  ListCheck,
  LogOut,
  Presentation,
  Settings,
  Users,
  UsersRound,
  Wrench,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router";

const Sidebar = ({ workspaceData }) => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="sidebar-container flex align-item-center justify-content-space ">
      <div>
        <div
          onClick={() => {
            navigate("/");
          }}
          className="sidebar-header flex align-items-center justify-content-start"
        >
          <Wrench
            className="sidebar-logo"
            size={20}
            color="oklch(0.55 0.25 262.87)"
          />
          <span className="sidebar-title">TaskHub</span>
        </div>
        <div className="sidebar-body">
          <div
            onClick={() => {
              navigate("/");
            }}
            className={`sidebar-item flex align-items-center justify-content-start ${
              location.pathname === "/" ? "active" : ""
            }`}
          >
            <span className="sidebar-item-icon">
              <LayoutDashboard size={18} />
            </span>
            <h3 className="sidebar-item-text">Dashboard</h3>
          </div>
          <div
            className={`sidebar-item flex align-items-center justify-content-start ${
              location.pathname === "/workspaces" ? "active" : ""
            }`}
            onClick={() => {
              navigate("/workspaces");
            }}
          >
            <span className="sidebar-item-icon">
              <Users size={18} />
            </span>
            <h3 className="sidebar-item-text">Work Spaces</h3>
          </div>
          <div
            className={`sidebar-item flex align-items-center justify-content-start ${
              location.pathname === "/projects" ? "active" : ""
            }`}
            onClick={() => {
              navigate("/projects");
            }}
          >
            <span className="sidebar-item-icon">
              <Presentation size={18} />
            </span>
            <h3 className="sidebar-item-text">Projects</h3>
          </div>
          <div
            className={`sidebar-item flex align-items-center justify-content-start ${
              location.pathname === "/mytasks" ? "active" : ""
            }`}
            onClick={() => {
              navigate("/mytasks");
            }}
          >
            <span className="sidebar-item-icon">
              <ListCheck size={18} />
            </span>
            <h3 className="sidebar-item-text">
              {workspaceData?.createdBy === currentUser?._id
                ? "Tasks"
                : "My Tasks"}
            </h3>
          </div>
          <div
            onClick={() => {
              navigate("/members");
            }}
            className={`sidebar-item flex align-items-center justify-content-start ${
              location.pathname === "/members" ? "active" : ""
            }`}
          >
            <span className="sidebar-item-icon">
              <UsersRound size={18} />
            </span>
            <h3 className="sidebar-item-text">Members</h3>
          </div>
          <div
            onClick={() => {
              navigate("/achieved");
            }}
            className={`sidebar-item flex align-items-center justify-content-start ${
              location.pathname === "/achieved" ? "active" : ""
            }`}
          >
            <span className="sidebar-item-icon">
              <BadgeCheck size={18} />
            </span>
            <h3 className="sidebar-item-text">Achieved</h3>
          </div>
          {workspaceData?.createdBy === currentUser?._id && (
            <div
              onClick={() => {
                navigate("/settings");
              }}
              className={`sidebar-item flex align-items-center justify-content-start ${
                location.pathname === "/settings" ? "active" : ""
              }`}
            >
              <span className="sidebar-item-icon">
                <Settings size={18} />
              </span>
              <h3 className="sidebar-item-text">Settings</h3>
            </div>
          )}
        </div>
      </div>
      <div
        onClick={logout}
        className="sidebar-footer flex align-items-center justify-content-start"
      >
        <LogOut
          size={20}
          color="oklch(0.55 0.25 262.87)"
          className="sidebar-footer-icon"
        />
        <span className="sidebar-footer-text">Logout</span>
      </div>
    </div>
  );
};

export default Sidebar;
