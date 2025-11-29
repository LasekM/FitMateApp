import { useState } from "react";
import { Users, UserPlus, Calendar, Bell } from "lucide-react";
import FriendList from "../components/friends/FriendList";
import FriendRequests from "../components/friends/FriendRequests";
import UserSearch from "../components/friends/UserSearch";
import FriendCalendar from "../components/friends/FriendCalendar";
import FriendDetailsModal from "../components/friends/FriendDetailsModal";

const Friends = () => {
  const [activeTab, setActiveTab] = useState<"friends" | "requests" | "search" | "activity">("friends");
  const [selectedFriend, setSelectedFriend] = useState<any>(null);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Friends</h1>
          <p className="text-gray-400 mt-1">Connect with friends and share your fitness journey.</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex overflow-x-auto border-b border-gray-800 no-scrollbar">
        <button
          onClick={() => setActiveTab("friends")}
          className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap relative ${
            activeTab === "friends" ? "text-green-500" : "text-gray-400 hover:text-white"
          }`}
        >
          <Users size={20} />
          My Friends
          {activeTab === "friends" && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-green-500 rounded-t-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("activity")}
          className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap relative ${
            activeTab === "activity" ? "text-green-500" : "text-gray-400 hover:text-white"
          }`}
        >
          <Calendar size={20} />
          Activity & Schedule
          {activeTab === "activity" && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-green-500 rounded-t-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("requests")}
          className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap relative ${
            activeTab === "requests" ? "text-green-500" : "text-gray-400 hover:text-white"
          }`}
        >
          <Bell size={20} />
          Requests
          {activeTab === "requests" && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-green-500 rounded-t-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("search")}
          className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap relative ${
            activeTab === "search" ? "text-green-500" : "text-gray-400 hover:text-white"
          }`}
        >
          <UserPlus size={20} />
          Find Friends
          {activeTab === "search" && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-green-500 rounded-t-full" />
          )}
        </button>
      </div>

      {/* Content Area */}
      <div className="min-h-[400px]">
        {activeTab === "friends" && <FriendList onSelectFriend={setSelectedFriend} />}
        {activeTab === "activity" && <FriendCalendar />}
        {activeTab === "requests" && <FriendRequests />}
        {activeTab === "search" && <UserSearch />}
      </div>

      <FriendDetailsModal
        isOpen={!!selectedFriend}
        onClose={() => setSelectedFriend(null)}
        friend={selectedFriend}
      />
    </div>
  );
};

export default Friends;
