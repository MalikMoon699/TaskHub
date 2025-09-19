import { CirclePlus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

const Members = () => {
  const { selectedWorkSpace } = useOutletContext();
  const [members, setMembers] = useState([]);

  useEffect(() => {
    if (!selectedWorkSpace) return;

    const fetchMembers = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/workspaces/members/${selectedWorkSpace}`
        );
        const data = await res.json();

        if (res.ok) {
          setMembers(data.members || []);
        } else {
          console.error("Failed to fetch members:", data.message);
        }
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };

    fetchMembers();
  }, [selectedWorkSpace]);

  return (
    <div>
      <div className="local-header flex align-item-center justify-content-space">
        <h3 className="local-header-title">Members</h3>
        <button className="local-header-btn">
          <CirclePlus size={18} />
          Add Member
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
    </div>
  );
};

export default Members;
