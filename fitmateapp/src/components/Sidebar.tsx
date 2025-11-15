import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Dumbbell,
  BarChart2,
  CalendarRange,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
  { to: "/plans", label: "Plans", icon: <Dumbbell size={20} /> },
  { to: "/schedule", label: "Schedule", icon: <CalendarRange size={20} /> },
  { to: "/statistics", label: "Statistics", icon: <BarChart2 size={20} /> },
];

const Sidebar = () => {
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 bg-gray-900 p-6 flex flex-col min-h-screen">
      <h1 className="text-2xl font-bold mb-8 text-green-500">FitMate</h1>
      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg ${
                isActive
                  ? "bg-green-600 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto">
        {user && (
          <div className="pt-4 border-t border-gray-700 text-center">
            <p className="text-sm text-gray-400">Logged in as:</p>
            <p className="text-lg font-semibold text-white">
              {user.preferred_username}
            </p>
          </div>
        )}
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-2 rounded-lg w-full text-gray-300 hover:bg-red-800 hover:text-white mt-4 transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
