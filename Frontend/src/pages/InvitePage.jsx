import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const InvitePage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const acceptInvite = async () => {
      try {
        const res = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/workspaces/invite/accept/${token}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        const data = await res.json();

        if (res.ok) {
          setStatus("success");
          setMessage(data.message || "Invite accepted!");
          setTimeout(() => navigate("/workspaces"), 2000); // redirect after 2s
        } else {
          setStatus("error");
          setMessage(data.message || "Failed to accept invite");
        }
      } catch (err) {
        console.error(err);
        setStatus("error");
        setMessage("Something went wrong");
      }
    };

    acceptInvite();
  }, [token, navigate]);

  return (
    <div className="invite-page">
      {status === "loading" && <p>Accepting invite...</p>}
      {status === "success" && <p style={{ color: "green" }}>{message}</p>}
      {status === "error" && <p style={{ color: "red" }}>{message}</p>}
    </div>
  );
};

export default InvitePage;
