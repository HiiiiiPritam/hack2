
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/dashboard';
import Login from './pages/login';
import SignUp from './pages/signUp';
// import JoinRoom from './pages/joinRoom';
import {RoomWrapper} from './pages/dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        {/* <Route path="/" element={<JoinRoom />} /> */}
        <Route path="/room/:orgId/*" element={<RoomWrapper />} />
      </Routes>
    </Router>
  );
}

export default App;
