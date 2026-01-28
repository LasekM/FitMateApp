import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Dumbbell,
  BarChart2,
  CalendarRange,
  LogOut,
  User,
  Users,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.tsx";
import { useEffect, useState } from "react";
import { FriendsService, PlansService } from "../api-generated";

const navItems = [
  { to: "/", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
  { to: "/plans", label: "Plans", icon: <Dumbbell size={20} /> },
  { to: "/schedule", label: "Schedule", icon: <CalendarRange size={20} /> },
  { to: "/statistics", label: "Statistics", icon: <BarChart2 size={20} /> },
  { to: "/friends", label: "Friends", icon: <Users size={20} /> },
  { to: "/profile", label: "Profile", icon: <User size={20} /> },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const [notificationCount, setNotificationCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const [incomingRequests, sharedPlans] = await Promise.all([
          FriendsService.getApiFriendsRequestsIncoming(),
          PlansService.getApiPlansSharedPending(),
        ]);
        setNotificationCount(incomingRequests.length + sharedPlans.length);
      } catch (error) {
        console.error("Failed to fetch notifications", error);
      }
    };

    fetchNotifications();
    // Optional: Poll every minute or so
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Mobile Header */}
      <div className="xl:hidden bg-gray-900 p-4 flex justify-between items-center sticky top-0 z-50 border-b border-gray-800">
        <h1 className="text-xl font-bold text-green-500">FitMate</h1>
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="text-white p-2"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 xl:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Menu Content */}
          <div className="absolute right-0 top-0 h-full w-full bg-gray-900 p-6 shadow-2xl flex flex-col transition-transform duration-300 transform translate-x-0">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-white">Menu</h2>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <nav className="space-y-2 flex-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg relative ${
                      isActive
                        ? "bg-green-600 text-white"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    }`
                  }
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.label === "Friends" && notificationCount > 0 && (
                    <span className="absolute right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {notificationCount}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>

            <div className="mt-auto pt-4 border-t border-gray-700">
              {user && (
                <div className="mb-4 text-center">
                  <p className="text-sm text-gray-400">Logged in as:</p>
                  <p className="text-lg font-semibold text-white">
                    {user.username}
                  </p>
                </div>
              )}
              <button
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-3 px-4 py-2 rounded-lg w-full text-gray-300 hover:bg-red-800 hover:text-white transition-colors"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden xl:flex w-64 bg-gray-900 p-6 flex-col h-screen sticky top-0">
      <h1 className="text-2xl font-bold mb-8 text-green-500">FitMate</h1>
      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg relative ${
                isActive
                  ? "bg-green-600 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`
            }
          >
            {item.icon}
            <span>{item.label}</span>
            {item.label === "Friends" && notificationCount > 0 && (
              <span className="absolute right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {notificationCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto">
        {user && (
          <div className="pt-4 border-t border-gray-700 text-center">
            <p className="text-sm text-gray-400">Logged in as:</p>
            <p className="text-lg font-semibold text-white">
              {user.username}
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
    </>
  );
};

export default Sidebar;
