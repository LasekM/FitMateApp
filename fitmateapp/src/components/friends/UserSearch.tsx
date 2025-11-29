import { useState, useEffect } from "react";
import { UsersService, FriendsService } from "../../api-generated";
import type { UserSummaryDto } from "../../api-generated";
import { Search, UserPlus, Check, UserCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const UserSearch = () => {
  const { user: currentUser } = useAuth();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserSummaryDto[]>([]);
  const [friends, setFriends] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [sentRequests, setSentRequests] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch current friends to check status
    FriendsService.getApiFriends()
      .then((data) => {
        setFriends(new Set(data.map(f => f.userName)));
      })
      .catch(err => console.error("Failed to fetch friends", err));
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setIsLoading(true);
      setError(null);
      // Use the public search endpoint instead of the admin-only getApiUsers
      const data = await UsersService.getApiUsersSearch({ filter: query });
      
      // Filter out the current user from results
      const filteredData = data.filter(u => 
        u.userName && currentUser?.username && 
        u.userName.toLowerCase() !== currentUser.username.toLowerCase()
      );
      
      setResults(filteredData);
    } catch (err) {
      console.error("Search failed", err);
      setError("Failed to search users.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFriend = async (username: string) => {
    try {
      await FriendsService.postApiFriends({ username });
      setSentRequests((prev) => new Set(prev).add(username));
    } catch (err: any) {
      console.error("Failed to add friend", err);
      if (err.body && typeof err.body === 'string') {
          alert(err.body);
      } else {
          alert("Failed to send friend request. You might be already friends or a request is pending.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users by name or username..."
            className="w-full bg-gray-900 border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-green-500 transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && <div className="text-red-500">{error}</div>}

      <div className="space-y-3">
        {results.map((user) => {
          const isFriend = user.userName && friends.has(user.userName);
          const isRequestSent = user.userName && sentRequests.has(user.userName);
          
          return (
            <div
              key={user.userName}
              className="bg-gray-900 p-4 rounded-xl border border-gray-800 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-green-500 font-bold">
                  {user.userName?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{user.fullName || user.userName}</h3>
                  <p className="text-xs text-gray-500">@{user.userName}</p>
                </div>
              </div>
              
              {isFriend ? (
                 <div className="flex items-center gap-2 text-green-500 px-3 py-2 bg-green-900/20 rounded-lg">
                    <UserCheck size={20} />
                    <span className="text-sm font-medium">Already Friends</span>
                 </div>
              ) : (
                <button
                  onClick={() => user.userName && handleAddFriend(user.userName)}
                  disabled={!user.userName || !!isRequestSent}
                  className={`p-2 rounded-lg transition-colors ${
                    isRequestSent
                      ? "bg-green-900/20 text-green-500 cursor-default"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  {isRequestSent ? (
                    <Check size={20} />
                  ) : (
                    <UserPlus size={20} />
                  )}
                </button>
              )}
            </div>
          );
        })}
        {results.length === 0 && query && !isLoading && !error && (
            <div className="text-center text-gray-500 py-4">No users found.</div>
        )}
      </div>
    </div>
  );
};

export default UserSearch;
