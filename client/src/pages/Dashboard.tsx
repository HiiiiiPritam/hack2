/// <reference types="vite/client" />

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocketStore } from "@/zustand/useSocketStore";
import io from "socket.io-client";

// Component for joining a room
const JoinRoom = () => {
    const [room, setRoom] = useState("");
    const navigate = useNavigate();
    const socket = useSocketStore((state) => state.socket);
  
    const handleJoin = () => {
      if (room.trim() && socket) {
        socket.emit("createOrganization", { orgId: room });
        navigate(`/room/${room}`);
      }
    };
  
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-6">Join a Room</h1>
          <input 
            type="text" 
            placeholder="Enter Room Name" 
            value={room} 
            onChange={(e) => setRoom(e.target.value)} 
            className="w-full border border-gray-300 p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            onClick={handleJoin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded transition-colors"
          >
            Join
          </button>
        </div>
      </div>
    );
  };
  
// Dashboard that contains all your logic and routes within a Router
const Dashboard = () => {
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
  }, [setSocket, socket, BACKENDURL]);

  return (
    <JoinRoom />
  )
};

export default Dashboard;
