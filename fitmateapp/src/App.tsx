import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register.tsx";
import Dashboard from "./pages/Dashboard";
import Plans from "./pages/Plans";
import Schedule from "./pages/Schedule";
import Statistics from "./pages/Statistics";
import Profile from "./pages/Profile";
import { ProtectedRoute } from "./components/ProtectedRoute";
import MainLayout from "./layout/MainLayout";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          {" "}
          <Route path="/" element={<Dashboard />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
