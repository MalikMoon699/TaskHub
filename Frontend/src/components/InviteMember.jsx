import { SendHorizontal, X } from "lucide-react";
import React, { useState } from "react";
import { useOutletContext } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import Loader from "./Loader";

const InviteMember = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const { currentUser } = useAuth();
  const [emailError, setEmailError] = useState("");
  const { selectedWorkSpace } = useOutletContext();
  const [loading, setLoading] = useState(false);

  const handleSendInvite = async () => {
    if (!email) return setEmailError("member email is required!");

    try {
      setLoading(true);
      const res = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/workspaces/invite/${selectedWorkSpace}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, inviterId: currentUser._id }),
        }
      );
      const data = await res.json();

      if (res.ok) {
        toast.success("Invite sent!");
        onClose();
      } else {
        setEmailError(data.message || "Failed to send invite");
      }
    } catch (err) {
      console.error(err);
      setEmailError("Something went wrong");
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header flex align-item-center justify-content-space">
          <h3 className="modal-title">Invite Member</h3>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={15} color="#757575" />
          </button>
        </div>
        <div className="modal-body signup-form">
          <div className="form-group">
            <label className="form-label" htmlFor="">
              Member email
            </label>
            <input
              className="form-input"
              type="email"
              placeholder="Enter member email"
              style={{ borderColor: emailError ? "red" : "" }}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError("");
              }}
            />
            {emailError && <p className="error-message">{emailError}</p>}
          </div>
        </div>
        <div className="flex align-item-center justify-content-end">
          <button
            style={{
              borderRadius: "6px",
              fontSize: "0px",
              padding: "5px 20px",
            }}
            onClick={handleSendInvite}
            className="create-btn"
          >
            {loading ? 
            <Loader loading={true} color="white" size="20" style={{height:"23px", width:"23px"}}/>
            : 
            <SendHorizontal />
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default InviteMember;
