/// <reference types="vite/client" />

import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import MapComponent from "./components/MapComponent";
import { useSocketStore } from "./zustand/useSocketStore"; // ✅ Fix Import
import { io } from "socket.io-client";

const JoinRoom = () => {
  const [room, setRoom] = React.useState("");
  const navigate = useNavigate();
  const socket = useSocketStore((state) => state.socket);

  const handleJoin = () => {
    if (room.trim() && socket) {
      socket.emit("createOrganization", { orgId:room });
      navigate(`/room/${room}`);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Join a Room</h1>
      <input 
        type="text" 
        placeholder="Enter Room Name" 
        value={room} 
        onChange={(e) => setRoom(e.target.value)} 
      />
      <button onClick={handleJoin}>Join</button>
    </div>
  );
};

const RoomPage = ({ room }: { room: string }) => {
  const navigate = useNavigate();
  const socket = useSocketStore((state) => state.socket);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  useEffect(() => {
    if (socket) {
      // ✅ Listen for the alert event
      socket.on("guardAlert", (message) => {
        console.log("Alert received:", message);
        setAlertMessage(message);
      });

      return () => {
        socket.off("guardAlert"); // ✅ Clean up the listener when unmounting
      };
    }
  }, [socket]);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Room: {room}</h1>
      {alertMessage && (
        <div style={{ backgroundColor: "red", color: "white", padding: "10px", margin: "10px 0" }}>
          🚨 Alert: {alertMessage}
        </div>
      )}
      <div>
        <button onClick={() => navigate(`/room/${room}/map`)}>Map</button>
        <button>Other Tab</button>
      </div>
    </div>
  );
};

const RoomWrapper = () => {
  const roomId = window.location.pathname.split("/")[2];
  return <RoomPage room={roomId} />;
};

function App() {
  const setSocket = useSocketStore((state) => state.setSocket);
  const socket = useSocketStore((state) => state.socket);
  const BACKENDURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    if (!socket) {
      const newSocket = io(BACKENDURL);
      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [setSocket]); // ✅ Remove `socket` from dependencies to prevent re-renders

  return (
    <Router>
      <Routes>
        <Route path="/" element={<JoinRoom />} />
        <Route path="/room/:orgId" element={<RoomWrapper />} />
        <Route path="/room/:orgId/map" element={<MapComponent />} />
      </Routes>
    </Router>
  );
}

export default App;
