import { useState, useEffect } from "react";
import { BodyMetricsService, PlansService, FriendsWorkoutsService } from "../../api-generated";
import type { FriendDto, BodyMeasurementDto, PlanDto, FriendScheduledWorkoutDto } from "../../api-generated";
import { X, Activity, Share2, Check, Calendar } from "lucide-react";

interface FriendDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  friend: FriendDto | null;
}

const FriendDetailsModal = ({ isOpen, onClose, friend }: FriendDetailsModalProps) => {
  const [metrics, setMetrics] = useState<BodyMeasurementDto | null>(null);
  const [plans, setPlans] = useState<PlanDto[]>([]);
  const [friendWorkouts, setFriendWorkouts] = useState<FriendScheduledWorkoutDto[]>([]);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(false);
  const [isLoadingWorkouts, setIsLoadingWorkouts] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [shareStatus, setShareStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    if (isOpen && friend) {
      fetchMetrics();
      fetchMyPlans();
      fetchFriendWorkouts();
      setShareStatus("idle");
      setIsSharing(false);
      setSelectedPlanId("");
    }
  }, [isOpen, friend]);

  const fetchMetrics = async () => {
    if (!friend) return;
    try {
      setIsLoadingMetrics(true);
      const data = await BodyMetricsService.getApiBodyMetricsFriends({ friendId: friend.userId });
      setMetrics(data);
    } catch (err) {
      setMetrics(null);
    } finally {
      setIsLoadingMetrics(false);
    }
  };

  const fetchFriendWorkouts = async () => {
    if (!friend) return;
    try {
      setIsLoadingWorkouts(true);
      const today = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 14);

      const data = await FriendsWorkoutsService.getApiFriendsWorkoutsScheduled({
        from: today.toISOString().split('T')[0],
        to: nextWeek.toISOString().split('T')[0],
      });
      
      // Filter for this specific friend
      const thisFriendWorkouts = data.filter(w => w.userId === friend.userId);
      setFriendWorkouts(thisFriendWorkouts);
    } catch (err) {
      console.error("Failed to fetch friend workouts", err);
      setFriendWorkouts([]);
    } finally {
      setIsLoadingWorkouts(false);
    }
  };

  const fetchMyPlans = async () => {
    try {
      const data = await PlansService.getApiPlans({ includeShared: false });
      setPlans(data);
    } catch (err) {
      console.error("Failed to fetch plans", err);
    }
  };

  const handleSharePlan = async () => {
    if (!friend || !selectedPlanId) return;
    try {
      await PlansService.postApiPlansShareTo({
        planId: selectedPlanId,
        targetUserId: friend.userId,
      });
      setShareStatus("success");
      setTimeout(() => {
        setIsSharing(false);
        setShareStatus("idle");
      }, 2000);
    } catch (err) {
      console.error("Failed to share plan", err);
      setShareStatus("error");
    }
  };

  if (!isOpen || !friend) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur flex justify-center items-center z-50 p-4">
      <div className="bg-zinc-900 text-white rounded-xl w-full max-w-md overflow-hidden shadow-2xl border border-zinc-800 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-zinc-800 p-6 flex justify-between items-start sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-2xl font-bold text-white">
              {friend.userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold">{friend.userName}</h2>
              <p className="text-zinc-400 text-sm">Friend</p>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Body Metrics Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Activity className="text-green-500" size={20} />
              Latest Stats
            </h3>
            {isLoadingMetrics ? (
              <div className="text-zinc-500 text-sm">Loading stats...</div>
            ) : metrics ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-800 p-3 rounded-lg">
                  <p className="text-zinc-400 text-xs">Weight</p>
                  <p className="text-xl font-bold">{metrics.weightKg} kg</p>
                </div>
                <div className="bg-zinc-800 p-3 rounded-lg">
                  <p className="text-zinc-400 text-xs">Height</p>
                  <p className="text-xl font-bold">{metrics.heightCm} cm</p>
                </div>
                {metrics.bodyFatPercentage && (
                  <div className="bg-zinc-800 p-3 rounded-lg">
                    <p className="text-zinc-400 text-xs">Body Fat</p>
                    <p className="text-xl font-bold">{metrics.bodyFatPercentage}%</p>
                  </div>
                )}
                {metrics.bmi && (
                  <div className="bg-zinc-800 p-3 rounded-lg">
                    <p className="text-zinc-400 text-xs">BMI</p>
                    <p className="text-xl font-bold">{metrics.bmi.toFixed(1)}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-zinc-500 text-sm italic bg-zinc-800/50 p-4 rounded-lg text-center">
                No public stats available.
              </div>
            )}
          </div>

          {/* Upcoming Workouts Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Calendar className="text-blue-500" size={20} />
              Upcoming Workouts (14 days)
            </h3>
            {isLoadingWorkouts ? (
              <div className="text-zinc-500 text-sm">Loading workouts...</div>
            ) : friendWorkouts.length > 0 ? (
              <div className="space-y-2">
                {friendWorkouts.map((workout) => (
                  <div key={workout.scheduledId} className="bg-zinc-800 p-3 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="font-medium text-white">{workout.planName}</p>
                      <p className="text-zinc-400 text-xs">
                        {new Date(workout.date!).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                        {workout.time && ` • ${workout.time}`}
                      </p>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs ${workout.status === 'completed' ? 'bg-green-900/50 text-green-400' : 'bg-yellow-900/50 text-yellow-400'}`}>
                      {workout.status}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-zinc-500 text-sm italic bg-zinc-800/50 p-4 rounded-lg text-center">
                No public workouts scheduled.
              </div>
            )}
          </div>

          {/* Share Plan Section */}
          <div className="border-t border-zinc-800 pt-6">
            {!isSharing ? (
              <button
                onClick={() => setIsSharing(true)}
                className="w-full bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <Share2 size={20} />
                Share Workout Plan
              </button>
            ) : (
              <div className="bg-zinc-800 p-4 rounded-xl animate-in fade-in slide-in-from-top-2">
                <h4 className="font-medium mb-3">Select Plan to Share</h4>
                {plans.length > 0 ? (
                  <div className="space-y-3">
                    <select
                      value={selectedPlanId}
                      onChange={(e) => setSelectedPlanId(e.target.value)}
                      className="w-full p-2 rounded bg-zinc-900 border border-zinc-700 focus:ring-2 focus:ring-green-500 outline-none"
                    >
                      <option value="" disabled>-- Choose a plan --</option>
                      {plans.map((plan) => (
                        <option key={plan.id} value={plan.id}>
                          {plan.planName} ({plan.type})
                        </option>
                      ))}
                    </select>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsSharing(false)}
                        className="flex-1 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSharePlan}
                        disabled={!selectedPlanId || shareStatus === "success"}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 ${
                          shareStatus === "success"
                            ? "bg-green-600 text-white"
                            : shareStatus === "error"
                            ? "bg-red-600 text-white"
                            : "bg-green-600 hover:bg-green-700 text-white"
                        }`}
                      >
                        {shareStatus === "success" ? (
                          <>
                            <Check size={16} /> Sent!
                          </>
                        ) : shareStatus === "error" ? (
                          "Failed"
                        ) : (
                          "Share"
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-zinc-500 text-sm mb-3">You don't have any plans to share.</p>
                    <button
                      onClick={() => setIsSharing(false)}
                      className="text-sm text-zinc-400 hover:text-white underline"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendDetailsModal;
