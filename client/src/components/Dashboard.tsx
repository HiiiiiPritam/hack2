import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const { orgId } = useParams<{ orgId: string }>();
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <h2>Organization: {orgId}</h2>
      <button onClick={() => navigate(`/map/${orgId}`)}>View Map</button>
    </div>
  );
};

export default Dashboard;
