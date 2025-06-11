import { Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Plans from "./pages/Plans";
import Schedule from "./pages/Schedule";
import Statistics from "./pages/Statistics";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/statistics" element={<Statistics />} />
      </Route>
    </Routes>
  );
}

export default App;
