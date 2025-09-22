import { CirclePlus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import InviteMember from "../components/InviteMember";
import Loader from "../components/Loader";
import "../assets/styles/Members.css";
import { useAuth } from "../contexts/AuthContext";

const Members = () => {
  const { currentUser } = useAuth();
  const { selectedWorkSpace } = useOutletContext();
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [workspaceData, setWorkspaceData] = useState(null);
  const [isInvite, setIsInvite] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchWorkspace = async () => {
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
    }
  };

  useEffect(() => {
    fetchWorkspace();
  }, [selectedWorkSpace]);

  useEffect(() => {
    if (!selectedWorkSpace) return;

    const fetchMembers = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/workspaces/members/${selectedWorkSpace}`
        );
        const data = await res.json();

        if (res.ok) {
          setMembers(data.members || []);
        } else {
          console.error("Failed to fetch members:", data.message);
        }
      } catch (error) {
        console.error("Error fetching members:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [selectedWorkSpace]);

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleRemoveMember = async (memberId) => {
    if (!selectedWorkSpace) return;

    const confirmRemove = window.confirm(
      "Are you sure you want to remove this member?"
    );
    if (!confirmRemove) return;

    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/workspaces/members/${selectedWorkSpace}/${memberId}`,
        { method: "DELETE" }
      );

      const data = await res.json();

      if (res.ok) {
        setMembers((prev) => prev.filter((m) => m._id !== memberId));
      } else {
        console.error("Failed to remove member:", data.message);
      }
    } catch (error) {
      console.error("Error removing member:", error);
    }
  };

  return loading ? (
    <Loader
      loading={true}
      size="50"
      style={{ height: "85vh", width: "100%" }}
    />
  ) : (
    <div className="members-container">
      <div className="members-header">
        <h3 className="members-header-title">Workspace Members</h3>
        <button
          onClick={() => setIsInvite(true)}
          className="members-header-btn"
        >
          <CirclePlus size={18} />
          Invite
        </button>
      </div>

      <input
        type="text"
        placeholder="Search members..."
        className="members-search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filteredMembers.length === 0 ? (
        <p className="members-empty">No members found.</p>
      ) : (
        <div className="members-list">
          <div className="members-list-header">
            <h3 className="members-list-header-title">Members</h3>
            <p className="members-list-header-count">
              {filteredMembers.length} member
              {filteredMembers.length > 1 ? "s" : ""} found
            </p>
          </div>
          {filteredMembers.map((member) => (
            <div key={member._id} className="members-card">
              <div className="members-avatar">
                {member.avatarUrl ? (
                  <img src={member.avatarUrl} alt={member.name} />
                ) : (
                  <span>{member.name.charAt(0).toUpperCase()}</span>
                )}
              </div>

              <div className="members-info">
                <h4 className="members-name">{member.name}</h4>
                <p className="members-email">{member.email}</p>
              </div>

              <div className="members-actions">
                <span
                  className={`members-role ${
                    member?._id !== workspaceData?.createdBy
                      ? "member"
                      : "owner"
                  }`}
                >
                  {member?._id !== workspaceData?.createdBy
                    ? "Member"
                    : "Owner"}
                </span>
                <span className="members-workspace">Test Workspace</span>
                {member?._id !== workspaceData?.createdBy &&
                  currentUser?._id === workspaceData?.createdBy && (
                    <span
                      className="members-remove-btn"
                      onClick={() => handleRemoveMember(member._id)}
                    >
                      Remove
                    </span>
                  )}
              </div>
            </div>
          ))}
        </div>
      )}

      {isInvite && <InviteMember onClose={() => setIsInvite(false)} />}
    </div>
  );
};

export default Members;
