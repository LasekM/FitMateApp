import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const MainLayout = () => {
  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden flex-col xl:flex-row">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
