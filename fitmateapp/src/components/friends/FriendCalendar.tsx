import { useEffect, useState } from "react";
import { FriendsWorkoutsService } from "../../api-generated";
import type { FriendScheduledWorkoutDto } from "../../api-generated";
import { Calendar, Clock } from "lucide-react";

const FriendCalendar = () => {
  const [workouts, setWorkouts] = useState<FriendScheduledWorkoutDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWorkouts = async () => {
    try {
      setIsLoading(true);
      const today = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);

      const from = today.toISOString().split("T")[0];
      const to = nextWeek.toISOString().split("T")[0];

      const data = await FriendsWorkoutsService.getApiFriendsWorkoutsScheduled({
        from,
        to,
      });
      // Sort by date and time
      const sorted = data.sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time || "00:00:00"}`).getTime();
        const dateB = new Date(`${b.date}T${b.time || "00:00:00"}`).getTime();
        return dateA - dateB;
      });
      setWorkouts(sorted);
    } catch (err) {
      console.error("Failed to fetch friends' workouts", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  if (isLoading) {
    return <div className="text-gray-400 p-4">Loading friends' schedule...</div>;
  }

  if (workouts.length === 0) {
    return (
      <div className="text-gray-500 text-center py-8 bg-gray-900 rounded-xl">
        <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No upcoming workouts from friends this week.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white flex items-center gap-2">
        <Calendar className="text-green-500" />
        Upcoming Workouts (Next 7 Days)
      </h2>
      <div className="grid gap-4">
        {workouts.map((workout) => (
          <div
            key={workout.scheduledId}
            className="bg-gray-900 p-4 rounded-xl border border-gray-800 flex items-center justify-between hover:border-green-500/30 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-green-500 font-bold text-lg">
                {workout.userName?.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-white">{workout.userName}</h3>
                  <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">
                    {new Date(workout.date!).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <p className="text-green-400 font-medium">{workout.planName}</p>
                {workout.time && (
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                    <Clock size={12} />
                    <span>{workout.time.substring(0, 5)}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
                <span className={`text-xs px-2 py-1 rounded-full ${
                    workout.status === 'completed' 
                    ? 'bg-green-900/50 text-green-400' 
                    : 'bg-blue-900/50 text-blue-400'
                }`}>
                    {workout.status === 'completed' ? 'Completed' : 'Planned'}
                </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendCalendar;
