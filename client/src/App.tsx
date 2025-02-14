import React, { useEffect } from "react";
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

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Room: {room}</h1>
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

  useEffect(() => {
    if (!socket) {
      const newSocket = io("http://localhost:5000");
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
