import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocketStore } from '@/zustand/useSocketStore';
import MapComponent from '@/components/MapComponent';
import Navigation from './Sidebar';

interface RoomPageProps {
  room: string;
}

// interface SocketStore {
//   socket: Socket | null;
//   setSocket: (socket: Socket) => void;
// }

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
    <div className="flex h-screen bg-gray-100">
      <Navigation room={room} />
      
      <main className="flex-1 p-4 md:p-8 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Room: {room}</h1>
          {alertMessage && (
            <div className="bg-red-500 text-white p-4 rounded mb-4">
              🚨 Alert: {alertMessage}
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

export default RoomPage;