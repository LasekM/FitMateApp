import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
