import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from './Pages/Sidebar'
import Client from './components/client/Client';
import Engins from './components/engins/Engins';
import Location from './components/location/Location';
import Dashboard from './components/dashboard/Dashboard';
import Register from './Auth/Register';
import Login from './Auth/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/sidebar" element={<Sidebar />} />
        <Route path="/" element={<Sidebar />}>
          <Route path="/client" element={<Client />} />
          <Route path="/engins" element={<Engins />} />
          <Route path="/location" element={<Location />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
