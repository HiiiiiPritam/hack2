import { useEffect } from "react";
import Dashboard from "./pages/Dashboard";
import { useSocketStore } from "./zustand/useSocketStore";
import { io } from "socket.io-client";

function App() {
  const setSocket = useSocketStore((state) => state.setSocket);
  const socket = useSocketStore((state) => state.socket);

  useEffect(() => {
    if (!socket) {
      const newSocket = io(import.meta.env.VITE_BACKEND_URL,{
        transports: ["websocket"],});
      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [setSocket]); // ✅ Remove `socket` from dependencies to prevent re-renders
  return <Dashboard />;
}

export default App;
