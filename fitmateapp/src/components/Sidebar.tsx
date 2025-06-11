import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Dumbbell,
  BarChart2,
  CalendarRange,
} from "lucide-react";

const navItems = [
  { to: "/", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
  { to: "/plans", label: "Plans", icon: <Dumbbell size={20} /> },
  { to: "/schedule", label: "Schedule", icon: <CalendarRange size={20} /> },
  { to: "/statistics", label: "Statistics", icon: <BarChart2 size={20} /> },
];

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-900 p-6">
      <h1 className="text-2xl font-bold mb-8">FitMate</h1>
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
    </aside>
  );
};

export default Sidebar;
