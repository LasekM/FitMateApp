import { useEffect, useState } from "react";
import { FriendsService, PlansService } from "../../api-generated";
import type { FriendRequestDto, SharedPlanDto } from "../../api-generated";
import { Check, X, Clock, ArrowRight, ArrowLeft, Share2 } from "lucide-react";

const FriendRequests = () => {
  const [incoming, setIncoming] = useState<FriendRequestDto[]>([]);
  const [outgoing, setOutgoing] = useState<FriendRequestDto[]>([]);
  const [sharedPlans, setSharedPlans] = useState<SharedPlanDto[]>([]);
  const [acceptedSharedPlans, setAcceptedSharedPlans] = useState<SharedPlanDto[]>([]);
  const [friends, setFriends] = useState<any[]>([]); // UserDto[]
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"incoming" | "outgoing" | "shared" | "accepted">("incoming");

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const [incomingData, outgoingData, sharedData, sharedHistoryData, friendsData] = await Promise.all([
        FriendsService.getApiFriendsRequestsIncoming(),
        FriendsService.getApiFriendsRequestsOutgoing(),
        PlansService.getApiPlansSharedPending(),
        PlansService.getApiPlansSharedHistory({ scope: 'received' }),
        FriendsService.getApiFriends(),
      ]);
      setIncoming(incomingData);
      setOutgoing(outgoingData);
      setSharedPlans(sharedData);
      setAcceptedSharedPlans(sharedHistoryData.filter(p => p.status === 'Accepted'));
      setFriends(friendsData);
    } catch (err) {
      console.error("Failed to fetch requests", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleRespond = async (requestId: string, accept: boolean) => {
    try {
      await FriendsService.postApiFriendsRequestsRespond({
        requestId,
        requestBody: { accept },
      });
      setIncoming(incoming.filter((r) => r.id !== requestId));
    } catch (err) {
      console.error("Failed to respond to request", err);
      alert("Failed to process request.");
    }
  };

  const handleRespondSharedPlan = async (sharedPlanId: string, accept: boolean) => {
    try {
      // 1. Respond to the share request
      await PlansService.postApiPlansSharedRespond({
        sharedPlanId,
        requestBody: { accept },
      });

      // 2. If accepted, duplicate the plan to user's library (Manually)
      if (accept) {
        const planToCopy = sharedPlans.find(p => p.id === sharedPlanId);
        if (planToCopy && planToCopy.planId) {
          try {
            // Fetch all plans including shared to get the details (exercises) of the plan we just accepted
            const allPlans = await PlansService.getApiPlans({ includeShared: true });
            const sharedPlanDetails = allPlans.find(p => p.id === planToCopy.planId);

            if (sharedPlanDetails) {
              // Try to find username from friends list
              const senderFriend = friends.find(f => f.fullName === planToCopy.sharedByName);
              const senderName = senderFriend?.userName || planToCopy.sharedByName;
              
              const newName = `${sharedPlanDetails.planName} (from ${senderName})`;
              
              await PlansService.postApiPlans({
                requestBody: {
                  planName: newName,
                  type: sharedPlanDetails.type || "Shared",
                  notes: sharedPlanDetails.notes,
                  exercises: sharedPlanDetails.exercises || []
                }
              });
              
              alert(`Plan accepted and saved to your library as "${newName}"`);
            } else {
               console.warn("Could not find details for shared plan:", planToCopy.planId);
               alert("Plan accepted, but could not fetch details to create a copy.");
            }
          } catch (dupError) {
            console.error("Error copying shared plan:", dupError);
            alert("Plan accepted, but failed to save a copy to your library.");
          }
        }
      }

      setSharedPlans(sharedPlans.filter((p) => p.id !== sharedPlanId));
      // Refresh accepted list if accepted
      if (accept) {
        const updatedHistory = await PlansService.getApiPlansSharedHistory({ scope: 'received' });
        setAcceptedSharedPlans(updatedHistory.filter(p => p.status === 'Accepted'));
      }
    } catch (err) {
      console.error("Failed to respond to shared plan", err);
      alert("Failed to process shared plan request.");
    }
  };

  const handleDeleteSharedPlan = async (sharedPlanId: string) => {
    if (!confirm("Are you sure you want to remove this shared plan? This will not remove the copy in your library.")) {
      return;
    }
    try {
      await PlansService.deleteApiPlansShared({ sharedPlanId });
      setAcceptedSharedPlans(acceptedSharedPlans.filter(p => p.id !== sharedPlanId));
    } catch (err) {
      console.error("Failed to delete shared plan", err);
      alert("Failed to remove shared plan.");
    }
  };

  if (isLoading) {
    return <div className="text-gray-400 p-4">Loading requests...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("incoming")}
          className={`pb-2 px-1 text-sm font-medium transition-colors relative whitespace-nowrap ${
            activeTab === "incoming"
              ? "text-green-500"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Incoming Friends ({incoming.length})
          {activeTab === "incoming" && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-green-500 rounded-t-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("outgoing")}
          className={`pb-2 px-1 text-sm font-medium transition-colors relative whitespace-nowrap ${
            activeTab === "outgoing"
              ? "text-green-500"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Outgoing Friends ({outgoing.length})
          {activeTab === "outgoing" && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-green-500 rounded-t-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("shared")}
          className={`pb-2 px-1 text-sm font-medium transition-colors relative whitespace-nowrap ${
            activeTab === "shared"
              ? "text-green-500"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Pending Plans ({sharedPlans.length})
          {activeTab === "shared" && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-green-500 rounded-t-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("accepted")}
          className={`pb-2 px-1 text-sm font-medium transition-colors relative whitespace-nowrap ${
            activeTab === "accepted"
              ? "text-green-500"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Accepted Plans ({acceptedSharedPlans.length})
          {activeTab === "accepted" && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-green-500 rounded-t-full" />
          )}
        </button>
      </div>

      {/* Incoming Requests */}
      {activeTab === "incoming" && (
        <div className="space-y-3">
          {incoming.length === 0 ? (
            <div className="text-gray-500 text-center py-8">
              No pending incoming friend requests.
            </div>
          ) : (
            incoming.map((req) => (
              <div
                key={req.id}
                className="bg-gray-900 p-4 rounded-xl border border-gray-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-green-500">
                    <ArrowLeft size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{req.fromName}</h3>
                    <p className="text-xs text-gray-500">
                      Sent {new Date(req.createdAtUtc).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleRespond(req.id, true)}
                    className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    title="Accept"
                  >
                    <Check size={18} />
                  </button>
                  <button
                    onClick={() => handleRespond(req.id, false)}
                    className="p-2 bg-gray-800 hover:bg-red-900/50 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                    title="Reject"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Outgoing Requests */}
      {activeTab === "outgoing" && (
        <div className="space-y-3">
          {outgoing.length === 0 ? (
            <div className="text-gray-500 text-center py-8">
              No pending outgoing friend requests.
            </div>
          ) : (
            outgoing.map((req) => (
              <div
                key={req.id}
                className="bg-gray-900 p-4 rounded-xl border border-gray-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400">
                    <ArrowRight size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{req.toName}</h3>
                    <p className="text-xs text-gray-500">
                      Sent {new Date(req.createdAtUtc).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <Clock size={16} />
                  <span>Pending</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Shared Plans (Pending) */}
      {activeTab === "shared" && (
        <div className="space-y-3">
          {sharedPlans.length === 0 ? (
            <div className="text-gray-500 text-center py-8">
              No pending shared plans.
            </div>
          ) : (
            sharedPlans.map((plan) => (
              <div
                key={plan.id}
                className="bg-gray-900 p-4 rounded-xl border border-gray-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-blue-500">
                    <Share2 size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{plan.planName}</h3>
                    <p className="text-xs text-gray-500">
                      Shared by <span className="text-white">{plan.sharedByName}</span> • {new Date(plan.sharedAtUtc || "").toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => plan.id && handleRespondSharedPlan(plan.id, true)}
                    className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    title="Accept Plan"
                  >
                    <Check size={18} />
                  </button>
                  <button
                    onClick={() => plan.id && handleRespondSharedPlan(plan.id, false)}
                    className="p-2 bg-gray-800 hover:bg-red-900/50 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                    title="Reject Plan"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Accepted Shared Plans */}
      {activeTab === "accepted" && (
        <div className="space-y-3">
          {acceptedSharedPlans.length === 0 ? (
            <div className="text-gray-500 text-center py-8">
              No accepted shared plans.
            </div>
          ) : (
            acceptedSharedPlans.map((plan) => (
              <div
                key={plan.id}
                className="bg-gray-900 p-4 rounded-xl border border-gray-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-green-500">
                    <Check size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{plan.planName}</h3>
                    <p className="text-xs text-gray-500">
                      Shared by <span className="text-white">{plan.sharedByName}</span> • Accepted {new Date(plan.respondedAtUtc || "").toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => plan.id && handleDeleteSharedPlan(plan.id)}
                    className="p-2 bg-gray-800 hover:bg-red-900/50 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                    title="Remove Share"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default FriendRequests;
