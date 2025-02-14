
import { useEffect } from "react";
import { useSocketStore } from "./zustand/useSocketStore";
import { io } from "socket.io-client";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import SignUp from './pages/signUp';
import Dashboard from "./pages/Dashboard";
import { RoomWrapper } from "./pages/Org";

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
  
    return (
    <Router>
      <Routes>

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/room/:orgId/*" element={<RoomWrapper />} />
      </Routes>
    </Router>
  );
}

export default App;
