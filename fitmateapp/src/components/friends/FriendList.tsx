import { useEffect, useState } from "react";
import { FriendsService } from "../../api-generated";
import type { FriendDto } from "../../api-generated";
import { User, UserMinus } from "lucide-react";

interface FriendListProps {
  onSelectFriend?: (friend: FriendDto) => void;
}

const FriendList = ({ onSelectFriend }: FriendListProps) => {
  const [friends, setFriends] = useState<FriendDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFriends = async () => {
    try {
      setIsLoading(true);
      const data = await FriendsService.getApiFriends();
      setFriends(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch friends", err);
      setError("Failed to load friends list.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  const handleRemoveFriend = async (friendId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (!window.confirm("Are you sure you want to remove this friend?")) return;

    try {
      await FriendsService.deleteApiFriends({ friendUserId: friendId });
      setFriends(friends.filter((f) => f.userId !== friendId));
    } catch (err) {
      console.error("Failed to remove friend", err);
      alert("Failed to remove friend.");
    }
  };

  if (isLoading) {
    return <div className="text-gray-400 p-4">Loading friends...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  if (friends.length === 0) {
    return (
      <div className="text-gray-400 p-8 text-center bg-gray-900 rounded-xl">
        <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>You haven't added any friends yet.</p>
        <p className="text-sm mt-2">Use the search tab to find people!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {friends.map((friend) => (
        <div
          key={friend.userId}
          onClick={() => onSelectFriend?.(friend)}
          className="bg-gray-900 p-4 rounded-xl border border-gray-800 hover:border-green-500/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-green-500 font-bold">
                {friend.userName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-semibold text-white">{friend.userName}</h3>
                <p className="text-xs text-gray-500">Friend</p>
              </div>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => handleRemoveFriend(friend.userId, e)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                title="Remove Friend"
              >
                <UserMinus size={18} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FriendList;
