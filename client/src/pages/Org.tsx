import MapComponent from "@/components/MapComponent";
import { useSocketStore } from "@/zustand/useSocketStore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
