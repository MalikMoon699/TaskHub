import { CirclePlus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import InviteMember from "../components/InviteMember";
import Loader from "../components/Loader";

const Members = () => {
  const { selectedWorkSpace } = useOutletContext();
  const [members, setMembers] = useState([]);
  const [isInvite, setIsInvite] = useState(false);
  const [loading, setLoading] = useState(false);

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

  return loading ? (
    <Loader loading={true} size="50" style={{ height: "85vh", width: "100%" }} />
  ) : (
    <div>
      <div className="local-header flex align-item-center justify-content-space">
        <h3 className="local-header-title">Members</h3>
        <button onClick={() => setIsInvite(true)} className="local-header-btn">
          <CirclePlus size={18} />
          invite Member
        </button>
      </div>
      {members.length === 0 ? (
        <p>No members found.</p>
      ) : (
        <ul>
          {members.map((member) => (
            <li key={member._id}>
              {member.name} ({member.email})
            </li>
          ))}
        </ul>
      )}
      {isInvite && <InviteMember onClose={() => setIsInvite(false)} />}
    </div>
  );
};

export default Members;
