import { useEffect, useState } from "react";
import {
  AnalyticsService,
  BodyMetricsService,
  type OverviewDto,
  type AdherenceDto,
  type TimePointDto,
  type BodyMetricsStatsDto,
} from "../api-generated";
import { toast } from "react-toastify";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Statistics() {
  const [overview, setOverview] = useState<OverviewDto | null>(null);
  const [adherence, setAdherence] = useState<AdherenceDto | null>(null);
  const [volumeData, setVolumeData] = useState<TimePointDto[]>([]);
  const [bodyStats, setBodyStats] = useState<BodyMetricsStatsDto | null>(null);
  const [exerciseVolumeData, setExerciseVolumeData] = useState<TimePointDto[]>([]);
  const [bodyMetricsHistory, setBodyMetricsHistory] = useState<any[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<string>("Bench Press");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStatistics();
  }, [selectedExercise]); // Reload when selected exercise changes

  const loadStatistics = async () => {
    try {
      console.log("Statistics: Starting to load data...");
      setIsLoading(true);
      setError(null);
      
      // Calculate date range: last 30 days
      const to = new Date();
      to.setHours(23, 59, 59, 999);

      const from = new Date();
      from.setDate(from.getDate() - 30);
      from.setHours(0, 0, 0, 0);
      
      const fromISO = from.toISOString();
      const toISO = to.toISOString();
      
      // Date-only format for adherence (yyyy-MM-dd)
      // Note: toISOString() returns UTC. If we want local date for Adherence (DateOnly), 
      // we should be careful. But usually ISO string split is fine if we accept UTC date.
      // Let's stick to ISO split for now as it was before.
      const fromDate = from.toISOString().split('T')[0];
      const toDate = to.toISOString().split('T')[0];

      console.log("Statistics: Fetching data with dates:", { fromISO, toISO, fromDate, toDate });

      // Fetch all statistics in parallel
      const [overviewData, adherenceData, volumeData, bodyStatsData, exerciseVolData, bodyMetricsHistoryData] = await Promise.all([
        AnalyticsService.getApiAnalyticsOverview({ from: fromISO, to: toISO }).catch((e) => {
          console.log("Overview fetch failed:", e);
          return null;
        }),
        AnalyticsService.getApiAnalyticsAdherence({ fromDate, toDate }).catch((e) => {
          console.log("Adherence fetch failed:", e);
          return null;
        }),
        AnalyticsService.getApiAnalyticsVolume({
          from: fromISO,
          to: toISO,
          groupBy: "week",
        }).catch((e) => {
          console.log("Volume fetch failed:", e);
          return [];
        }),
        BodyMetricsService.getApiBodyMetricsStats().catch((e) => {
          console.log("Body stats fetch failed:", e);
          return null;
        }),
        AnalyticsService.getApiAnalyticsVolume({
          from: fromISO,
          to: toISO,
          groupBy: "day",
          exerciseName: selectedExercise,
        }).catch((e) => {
          console.log("Exercise volume fetch failed:", e);
          return [];
        }),
        BodyMetricsService.getApiBodyMetrics({}).catch((e) => {
          console.log("Body metrics history fetch failed:", e);
          return [];
        }),
      ]);

      console.log("Statistics: Data fetched", { overviewData, adherenceData, volumeData, bodyStatsData, exerciseVolData, bodyMetricsHistoryData });

      setOverview(overviewData);
      setAdherence(adherenceData);
      setVolumeData(volumeData);
      setBodyStats(bodyStatsData);
      setExerciseVolumeData(exerciseVolData);
      setBodyMetricsHistory(bodyMetricsHistoryData || []);
    } catch (error) {
      console.error("Error loading statistics:", error);
      setError("Failed to load statistics. Please try again.");
      toast.error("Failed to load statistics");
    } finally {
      setIsLoading(false);
      console.log("Statistics: Loading complete");
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 text-white text-center">
        <div className="text-xl">Loading statistics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-white text-center">
        <div className="text-xl text-red-500">{error}</div>
        <button 
          onClick={loadStatistics}
          className="mt-4 bg-green-600 px-4 py-2 rounded hover:bg-green-700"
        >
          Retry
        </button>
      </div>
    );
  }

  // Prepare adherence pie chart data
  const adherencePieData = adherence ? [
    { name: "Completed", value: adherence.completed || 0, color: "#22c55e" },
    { name: "Missed", value: adherence.missed || 0, color: "#ef4444" },
  ] : [];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-white mb-6">Your Statistics</h1>

      {/* Overview Section - Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Volume"
          value={overview?.totalVolume?.toFixed(0) || "0"}
          unit="kg"
          subtitle="Last 30 days"
          icon="📊"
        />
        <StatCard
          title="Sessions"
          value={overview?.sessionsCount?.toString() || "0"}
          subtitle="Completed workouts"
          icon="💪"
        />
        <StatCard
          title="Avg Intensity"
          value={overview?.avgIntensity?.toFixed(1) || "0"}
          unit="%"
          subtitle="Of max capacity"
          icon="🔥"
        />
        <StatCard
          title="Adherence"
          value={adherence?.adherencePct?.toFixed(0) || "0"}
          unit="%"
          subtitle="Plan completion"
          icon="✅"
          isHighlight={true}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Volume Trend Chart */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-4">Weekly Volume Trend</h2>
          {volumeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={volumeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="period" 
                  stroke="#9ca3af"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#9ca3af"
                  style={{ fontSize: '12px' }}
                  label={{ value: 'Volume (kg)', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="value" fill="#22c55e" name="Volume (kg)" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-gray-600 rounded-lg">
              <div className="text-center text-gray-400">
                <p className="text-lg mb-2">📊 No volume data yet</p>
                <p className="text-sm">Complete workouts to see your volume trends</p>
              </div>
            </div>
          )}
        </div>

        {/* Adherence Donut Chart */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-4">Training Adherence</h2>
          {adherence && (adherence.planned || 0) > 0 ? (
            <>
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={adherencePieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={adherencePieData.filter(d => d.value > 0).length > 1 ? 5 : 0}
                      dataKey="value"
                    >
                      {adherencePieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend 
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                      wrapperStyle={{ color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-center">
                <div className="text-4xl font-bold text-white">
                  {adherence.adherencePct?.toFixed(1)}%
                </div>
                <div className="text-zinc-400 mt-1">
                  {adherence.completed} / {adherence.planned} sessions
                </div>
              </div>
            </>
          ) : (
            <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-gray-600 rounded-lg">
              <div className="text-center text-gray-400">
                <p className="text-lg mb-2">📅 No scheduled workouts</p>
                <p className="text-sm">Schedule workouts to track adherence</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Volume Progress Chart (per Exercise) */}
      <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Volume Progress</h2>
          <select
            value={selectedExercise}
            onChange={(e) => {
              setSelectedExercise(e.target.value);
              // Trigger reload when exercise changes. 
              // Note: Ideally we'd separate this fetch, but for now full reload is safer given the structure.
              // We can optimize later to only fetch this part.
              // For now, let's just trigger the effect dependency or call a specific loader.
              // Since loadStatistics uses the state selectedExercise, we need to wait for state update or pass it.
              // Best way here is to let useEffect handle it if we added selectedExercise to dependency array,
              // but loadStatistics is called once on mount.
              // Let's just call a specific fetcher or reload all.
              // To avoid stale closure, we'll pass the new value to a helper or just reload.
              // Actually, setState is async. We should use useEffect for this or pass param.
            }}
            className="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600"
          >
            <option value="Bench Press">Bench Press</option>
            <option value="Squat">Squat</option>
            <option value="Deadlift">Deadlift</option>
            <option value="Overhead Press">Overhead Press</option>
          </select>
        </div>
        {exerciseVolumeData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={exerciseVolumeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="period" 
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
                tickFormatter={(date) => new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              />
              <YAxis 
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
                label={{ value: 'Volume (kg)', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff'
                }}
                labelFormatter={(date) => new Date(date).toLocaleDateString()}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 5 }}
                name="Volume"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-gray-600 rounded-lg">
            <div className="text-center text-gray-400">
              <p className="text-lg mb-2">📊 No volume data for {selectedExercise}</p>
              <p className="text-sm">Complete workouts with this exercise to track progress</p>
            </div>
          </div>
        )}
      </div>

      {/* Body Metrics Stats & Charts */}
      {bodyStats && (
        <div className="space-y-6">
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-4">Body Metrics Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-zinc-400 text-sm mb-1">Current Weight</div>
                <div className="text-3xl font-bold text-white">
                  {bodyStats.currentWeightKg?.toFixed(1) || "N/A"}{" "}
                  <span className="text-xl text-zinc-400">kg</span>
                </div>
                <div className="text-zinc-400 text-sm mt-2">
                  BMI: {bodyStats.currentBMI?.toFixed(1) || "N/A"}
                </div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-zinc-400 text-sm mb-1">Weight Range</div>
                <div className="text-2xl font-bold text-blue-400">
                  {bodyStats.lowestWeight?.toFixed(1) || "N/A"} - {bodyStats.highestWeight?.toFixed(1) || "N/A"} kg
                </div>
                <div className="text-zinc-400 text-sm mt-2">
                  Past 30 days: {bodyStats.weightChangeLast30Days?.toFixed(1) || "N/A"} kg
                </div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-zinc-400 text-sm mb-1">Total Measurements</div>
                <div className="text-3xl font-bold text-green-400">
                  {bodyStats.totalMeasurements || 0}
                </div>
                <div className="text-zinc-400 text-sm mt-2">
                  BMI: {bodyStats.bmiCategory || "N/A"}
                </div>
              </div>
            </div>
          </div>

          {/* Body Metrics Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-white mb-4">Weight Trend</h2>
              {bodyMetricsHistory.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={[...bodyMetricsHistory].reverse()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="measuredAtUtc" 
                      tickFormatter={(date) => new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      stroke="#9ca3af"
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} domain={['auto', 'auto']} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }}
                      labelFormatter={(date) => new Date(date).toLocaleDateString()}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="weightKg" stroke="#22c55e" strokeWidth={2} name="Weight (kg)" dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-zinc-500">No weight data available</div>
              )}
            </div>

            <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-white mb-4">Measurements Trend</h2>
              {bodyMetricsHistory.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={[...bodyMetricsHistory].reverse()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="measuredAtUtc" 
                      tickFormatter={(date) => new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      stroke="#9ca3af"
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} domain={['auto', 'auto']} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }}
                      labelFormatter={(date) => new Date(date).toLocaleDateString()}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="chestCm" stroke="#3b82f6" strokeWidth={2} name="Chest" dot={false} connectNulls />
                    <Line type="monotone" dataKey="waistCm" stroke="#8b5cf6" strokeWidth={2} name="Waist" dot={false} connectNulls />
                    <Line type="monotone" dataKey="hipsCm" stroke="#ec4899" strokeWidth={2} name="Hips" dot={false} connectNulls />
                    <Line type="monotone" dataKey="bicepsCm" stroke="#f59e0b" strokeWidth={2} name="Biceps" dot={false} connectNulls />
                    <Line type="monotone" dataKey="thighsCm" stroke="#ef4444" strokeWidth={2} name="Thighs" dot={false} connectNulls />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-zinc-500">No measurement data available</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!overview && !adherence && volumeData.length === 0 && !bodyStats && (
        <div className="bg-gray-800 rounded-xl p-12 text-center">
          <div className="text-zinc-400 text-lg">
            No statistics available yet. Start tracking your workouts and measurements!
          </div>
        </div>
      )}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  unit?: string;
  subtitle?: string;
  icon?: string;
  isHighlight?: boolean;
}

function StatCard({ title, value, unit, subtitle, icon, isHighlight }: StatCardProps) {
  return (
    <div className={`rounded-xl p-6 shadow-lg hover:scale-105 transition-transform duration-200 ${
      isHighlight ? 'bg-gradient-to-br from-green-600 to-green-700' : 'bg-gray-800'
    }`}>
      <div className="flex justify-between items-start mb-2">
        <div className="text-zinc-300 text-sm">{title}</div>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
      <div className="text-4xl font-bold text-white">
        {value}
        {unit && <span className="text-xl text-zinc-300 ml-1">{unit}</span>}
      </div>
      {subtitle && <div className="text-zinc-400 text-sm mt-2">{subtitle}</div>}
    </div>
  );
}
