import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const JoinRoom: React.FC = () => {
  const [orgId, setOrgId] = useState("");
  const navigate = useNavigate();

  const handleJoin = () => {
    if (orgId.trim()) {
      navigate(`/dashboard/${orgId}`); // Redirect to dashboard
    } else {
      alert("Please enter a valid Organization ID");
    }
  };

  return (
    <div className="join-room">
      <h2>Join an Organization</h2>
      <input
        type="text"
        placeholder="Enter Organization ID"
        value={orgId}
        onChange={(e) => setOrgId(e.target.value)}
      />
      <button onClick={handleJoin}>Join Room</button>
    </div>
  );
};

export default JoinRoom;
