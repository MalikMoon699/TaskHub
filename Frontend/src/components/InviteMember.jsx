import { SendHorizontal, X } from "lucide-react";
import React, { useState } from "react";

const InviteMember = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleSendInvite = async () => {
    if (!email) return setEmailError("member email is required!");
    console.log("send");
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
            <SendHorizontal />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InviteMember;
