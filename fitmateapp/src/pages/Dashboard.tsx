import { useEffect, useState } from "react";
import MotivationalQuote from "../components/MotivationalQuote";
import CalendarView from "../components/CalendarView";
import { UserProfileService, BodyMetricsService, ScheduledService, FriendsWorkoutsService, SessionsService } from "../api-generated";
import type { FriendScheduledWorkoutDto, ScheduledDto, WorkoutSessionDto, BodyMeasurementDto } from "../api-generated";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [currentWeight, setCurrentWeight] = useState<number | null>(null);
  const [targetWeight, setTargetWeight] = useState<number | null>(null);
  const [friendsWorkouts, setFriendsWorkouts] = useState<FriendScheduledWorkoutDto[]>([]);
  const [myTodayWorkout, setMyTodayWorkout] = useState<ScheduledDto[]>([]);
  const [lastSession, setLastSession] = useState<WorkoutSessionDto | null>(null);
  const [weightHistory, setWeightHistory] = useState<BodyMeasurementDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);
        const nextWeekStr = nextWeek.toISOString().split('T')[0];

        // Last 30 days for session history
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);

        // Current week range (Mon-Sun)
        const currentDay = today.getDay(); // 0 is Sunday
        const diffToMon = today.getDate() - currentDay + (currentDay === 0 ? -6 : 1);
        const startOfWeek = new Date(today);
        startOfWeek.setDate(diffToMon);
        startOfWeek.setHours(0, 0, 0, 0);
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);
        
        const [stats, target, friendsData, myData, sessionsData, historyData] = await Promise.all([
          BodyMetricsService.getApiBodyMetricsStats().catch(() => null),
          UserProfileService.getApiUserprofileTargetWeight().catch(() => null),
          FriendsWorkoutsService.getApiFriendsWorkoutsScheduled({ from: todayStr, to: nextWeekStr }).catch(() => []),
          ScheduledService.getApiScheduledByDate({ date: todayStr }).catch(() => []),
          SessionsService.getApiSessionsByRange({ 
            fromUtc: thirtyDaysAgo.toISOString(), 
            toUtc: new Date().toISOString() 
          }).catch(() => []),
          BodyMetricsService.getApiBodyMetrics({
            from: thirtyDaysAgo.toISOString(),
            to: new Date().toISOString()
          }).catch(() => [])
        ]);

        if (stats?.currentWeightKg) {
          setCurrentWeight(stats.currentWeightKg);
        }
        if (target?.targetWeightKg) {
          setTargetWeight(target.targetWeightKg);
        }
        
        setFriendsWorkouts(friendsData || []);
        setMyTodayWorkout(myData || []);

        // Find last completed session
        if (sessionsData && sessionsData.length > 0) {
          const completedSessions = sessionsData
            .filter(s => s.status === 'completed' && s.completedAtUtc)
            .sort((a, b) => new Date(b.completedAtUtc!).getTime() - new Date(a.completedAtUtc!).getTime());
          
          if (completedSessions.length > 0) {
            setLastSession(completedSessions[0]);
          }
        }

        // Set weight history
        if (historyData) {
          // Sort by date ascending for chart
          const sortedHistory = [...historyData].sort((a, b) => 
            new Date(a.measuredAtUtc!).getTime() - new Date(b.measuredAtUtc!).getTime()
          );
          setWeightHistory(sortedHistory);
        }

      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderWeightContent = () => {
    if (loading) return <span className="text-xl">Loading...</span>;
    if (!currentWeight) return <span className="text-xl">Start tracking your weight!</span>;
    if (!targetWeight) return <span className="text-xl">Set a target weight in your profile!</span>;

    const diff = currentWeight - targetWeight;
    
    if (diff <= 0) {
      return (
        <div className="flex flex-col items-center gap-2">
          <span className="text-4xl">🎉</span>
          <span className="text-2xl font-bold text-green-400">Congratulations!</span>
          <span className="text-xl">You've reached your goal!</span>
        </div>
      );
    }

    return (
      <div className="text-xl leading-relaxed">
        Current weight is <span className="text-4xl font-bold text-white mx-1">{currentWeight} kg</span>. 
        Only <span className="text-4xl font-bold text-green-400 mx-1">{diff.toFixed(1)} kg</span> left to reach your goal!
      </div>
    );
  };

  const renderLastSessionStats = () => {
    if (!lastSession) {
      return (
        <div className="text-center text-zinc-500">
          <p>No completed workouts yet.</p>
          <p className="text-sm mt-1">Start training to see stats here!</p>
        </div>
      );
    }

    const durationMinutes = lastSession.durationSec ? Math.round(lastSession.durationSec / 60) : 0;
    const totalVolume = lastSession.exercises?.reduce((acc, ex) => {
      return acc + (ex.sets?.reduce((sAcc, s) => sAcc + ((s.weightDone || 0) * (s.repsDone || 0)), 0) || 0);
    }, 0) || 0;
    const exerciseCount = lastSession.exercises?.length || 0;
    const date = new Date(lastSession.completedAtUtc!).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });

    return (
      <div className="w-full grid grid-cols-2 gap-4">
        <div className="bg-gray-800/50 p-3 rounded-lg text-center">
          <p className="text-xs text-zinc-400 uppercase tracking-wider">Date</p>
          <p className="text-lg font-bold text-white">{date}</p>
        </div>
        <div className="bg-gray-800/50 p-3 rounded-lg text-center">
          <p className="text-xs text-zinc-400 uppercase tracking-wider">Duration</p>
          <p className="text-lg font-bold text-white">{durationMinutes} min</p>
        </div>
        <div className="bg-gray-800/50 p-3 rounded-lg text-center">
          <p className="text-xs text-zinc-400 uppercase tracking-wider">Volume</p>
          <p className="text-lg font-bold text-green-400">{Math.round(totalVolume)} kg</p>
        </div>
        <div className="bg-gray-800/50 p-3 rounded-lg text-center">
          <p className="text-xs text-zinc-400 uppercase tracking-wider">Exercises</p>
          <p className="text-lg font-bold text-white">{exerciseCount}</p>
        </div>
      </div>
    );
  };

  const renderWeightTrend = () => {
    if (weightHistory.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-zinc-500">
          <p>No weight data available.</p>
          <p className="text-sm mt-1">Add measurements to see your trend!</p>
        </div>
      );
    }

    const data = weightHistory.map(item => ({
      date: new Date(item.measuredAtUtc!).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }),
      weight: item.weightKg
    }));

    return (
      <div className="w-full h-full pb-6 pr-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis 
              dataKey="date" 
              stroke="#71717a" 
              fontSize={12} 
              tickLine={false}
              axisLine={false}
              minTickGap={30}
            />
            <YAxis 
              stroke="#71717a" 
              fontSize={12} 
              tickLine={false}
              axisLine={false}
              domain={['auto', 'auto']}
              width={30}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
              itemStyle={{ color: '#4ade80' }}
              formatter={(value: number) => [`${value} kg`, 'Weight']}
              labelStyle={{ color: '#9ca3af', marginBottom: '4px' }}
            />
            <Line 
              type="monotone" 
              dataKey="weight" 
              stroke="#4ade80" 
              strokeWidth={3} 
              dot={{ fill: '#4ade80', r: 4 }} 
              activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-6 gap-6 min-h-screen ">
      {/* Workouts Panel (Replaces Last Workout) */}
      <div className="bg-gray-900 text-white rounded-2xl shadow-lg col-span-1 md:col-span-2 row-span-2 min-h-[300px] flex overflow-hidden">
        {/* Left: Friends Activity (2/3) */}
        <div className="w-2/3 p-6 border-r border-gray-800 flex flex-col">
          <h3 className="text-xl font-semibold mb-4 text-zinc-400 uppercase tracking-wider text-sm">Friends' Activity</h3>
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {friendsWorkouts.length > 0 ? (
              friendsWorkouts.map((workout, index) => (
                <div key={index} className="bg-gray-800/50 p-3 rounded-lg border border-gray-700/50 hover:border-gray-600 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-green-400">{workout.fullName || workout.userName}</span>
                    <span className="text-xs text-zinc-500 bg-gray-800 px-2 py-0.5 rounded-full">
                      {new Date(workout.date!).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-300">{workout.planName}</p>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-zinc-500 text-center">
                <p>No upcoming workouts from friends.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: My Today Workout (1/3) */}
        <div className="w-1/3 p-6 flex flex-col bg-gray-800/30">
          <h3 className="text-xl font-semibold mb-4 text-zinc-400 uppercase tracking-wider text-sm">Today</h3>
          <div className="flex-1 flex flex-col items-center justify-center text-center overflow-y-auto custom-scrollbar w-full">
            {myTodayWorkout.length > 0 ? (
              (() => {
                const allCompleted = myTodayWorkout.every(w => w.status === 'completed');
                
                if (allCompleted) {
                  return (
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-4 text-green-400 animate-pulse">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h4 className="text-xl font-bold text-white mb-2">All Done!</h4>
                      <p className="text-zinc-400">You've completed all your workouts for today.</p>
                      <p className="text-sm text-green-400 mt-2 font-medium">Great job!</p>
                    </div>
                  );
                }

                return (
                  <div className="w-full space-y-4">
                    {myTodayWorkout.map((workout, index) => (
                      <div key={index} className="w-full flex flex-col items-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${workout.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                          {workout.status === 'completed' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                          )}
                        </div>
                        <h4 className="text-base font-bold text-white mb-1 line-clamp-2 text-center">{workout.planName}</h4>
                        {workout.time && (
                          <p className="text-xs text-zinc-400 mb-2">at {workout.time.substring(0, 5)}</p>
                        )}
                        <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full mb-2 ${workout.status === 'completed' ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'}`}>
                          {workout.status === 'completed' ? 'Completed' : 'Scheduled'}
                        </span>
                        {index < myTodayWorkout.length - 1 && (
                          <div className="w-1/2 h-px bg-gray-700 my-2"></div>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })()
            ) : (
              <>
                <div className="w-16 h-16 bg-gray-700/30 rounded-full flex items-center justify-center mb-4 text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <p className="text-zinc-400 font-medium">Rest Day</p>
                <p className="text-xs text-zinc-500 mt-1">No workout scheduled</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Weight Goal Card (Replaces Calories) */}
      <div className="bg-gray-800 text-white rounded-2xl p-6 shadow-lg col-span-1 md:col-span-2 row-span-1 min-h-[200px] flex items-center justify-center">
        <div className="text-center w-full">
          <h2 className="text-xl font-semibold mb-4 text-zinc-400 uppercase tracking-wider text-sm">Weight Goal</h2>
          {renderWeightContent()}
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-gray-700 text-white rounded-2xl p-6 shadow-lg col-span-1 md:col-span-2 row-span-2 min-h-[300px] flex flex-col justify-start items-center overflow-hidden">
        <h3 className="text-xl font-semibold mb-4 text-zinc-400 uppercase tracking-wider text-sm">Your Active Days</h3>
        <div className="w-full h-full flex items-center justify-center">
          <CalendarView />
        </div>
      </div>

      {/* Weight Trend (Replaces Weekly Goal) */}
      <div className="bg-gray-800 text-white rounded-2xl p-6 shadow-lg col-span-1 md:col-span-2 row-span-2 min-h-[300px] flex flex-col justify-center items-center">
        <h3 className="text-xl font-semibold mb-4 text-zinc-400 uppercase tracking-wider text-sm">Weight Trend</h3>
        {renderWeightTrend()}
      </div>

      {/* Last Completed Workout Stats (Replaces Weight Stats) */}
      <div className="bg-gray-900 text-white rounded-2xl p-6 shadow-lg col-span-1 md:col-span-2 row-span-1 min-h-[200px] flex items-center justify-center">
        <div className="w-full">
          <h2 className="text-xl font-semibold mb-4 text-center text-zinc-400 uppercase tracking-wider text-sm">Last Completed Workout</h2>
          {renderLastSessionStats()}
        </div>
      </div>

      {/* Quote */}
      <MotivationalQuote />
    </div>
  );
};

export default Dashboard;
