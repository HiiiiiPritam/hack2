/// <reference types="vite/client" />

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MapComponent from "@/components/MapComponent";
import { useSocketStore } from "@/zustand/useSocketStore";
import io from "socket.io-client";

// Component for joining a room
export const JoinRoom = () => {
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
  

  interface RoomPageProps {
    room: string;
  }
  
  const RoomPage: React.FC<RoomPageProps> = ({ room }) => {
    const navigate = useNavigate();
    const socket = useSocketStore((state) => state.socket);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
  
    useEffect(() => {
      if (socket) {
        socket.on("guardAlert", (message: string) => {
          console.log("Alert received:", message);
          setAlertMessage(message);
        });
        return () => {
          socket.off("guardAlert");
        };
      }
    }, [socket]);
  
    return (
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 text-gray-200 p-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold">Room Sidebar</h2>
          </div>
          <nav>
            <ul className="space-y-4">
              <li>
                <button
                  onClick={() => navigate(`/room/${room}`)}
                  className="flex items-center w-full hover:bg-gray-700 p-2 rounded transition-colors"
                >
                  <span className="ml-2">Home</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate(`/room/${room}/map`)}
                  className="flex items-center w-full hover:bg-gray-700 p-2 rounded transition-colors"
                >
                  <span className="ml-2">Map</span>
                </button>
              </li>
              <li>
                <button className="flex items-center w-full hover:bg-gray-700 p-2 rounded transition-colors">
                  <span className="ml-2">Other Tab</span>
                </button>
              </li>
            </ul>
          </nav>
        </aside>
  
        {/* Main Content */}
        <main className="flex-1 bg-gray-100 p-8 overflow-auto">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">Room: {room}</h1>
            {alertMessage && (
              <div className="bg-red-500 text-white p-4 rounded mb-4">     🚨 Alert: {alertMessage}
              </div>
            )}
            <div className="bg-white shadow rounded p-6">
              <MapComponent />
            </div>
          </div>
        </main>
      </div>
    );
  };
  

// A wrapper to extract the room ID from the URL and render the room page
export const RoomWrapper = () => {
  const roomId = window.location.pathname.split("/")[2];
  return <RoomPage room={roomId} />;
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
  );
};

export default Dashboard;
