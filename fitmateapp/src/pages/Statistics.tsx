import { useEffect, useState } from "react";
import {
  AnalyticsService,
  BodyMetricsService,
  PlansService,
  type OverviewDto,
  type AdherenceDto,
  type TimePointDto,
  type BodyMetricsStatsDto,
} from "../api-generated";
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
  const [selectedExercise, setSelectedExercise] = useState<string>("");
  const [availableExercises, setAvailableExercises] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mapping of normalized (uppercase) name to list of original names
  const [exerciseVariants, setExerciseVariants] = useState<Record<string, string[]>>({});

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedExercise) {
      loadExerciseData(selectedExercise);
    }
  }, [selectedExercise, exerciseVariants]);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch plans AND historical exercises to populate the dropdown
      const [plans, historicalVolume] = await Promise.all([
        PlansService.getApiPlans({}),
        AnalyticsService.getApiAnalyticsVolume({ 
          from: new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString(), // Last year
          to: new Date().toISOString(), 
          groupBy: "exercise" 
        }).catch(() => [])
      ]);

      const variantsMap: Record<string, Set<string>> = {};
      
      // Helper to add to variants map
      const addExercise = (name: string) => {
        if (!name) return;
        const normalized = name.toUpperCase();
        if (!variantsMap[normalized]) {
          variantsMap[normalized] = new Set();
        }
        variantsMap[normalized].add(name);
      };

      // Add exercises from current plans
      plans.forEach(plan => {
        plan.exercises?.forEach(ex => {
          if (ex.name) addExercise(ex.name);
        });
      });

      // Add exercises from history
      historicalVolume.forEach(item => {
        if (item.exerciseName) addExercise(item.exerciseName);
      });
      
      // Convert sets to arrays
      const finalVariants: Record<string, string[]> = {};
      Object.keys(variantsMap).forEach(key => {
        finalVariants[key] = Array.from(variantsMap[key]);
      });
      setExerciseVariants(finalVariants);

      const exerciseList = Object.keys(finalVariants).sort((a, b) => a.localeCompare(b));
      setAvailableExercises(exerciseList);
      
      // Set default selected exercise if available
      if (exerciseList.length > 0 && !selectedExercise) {
        setSelectedExercise(exerciseList[0]);
      } else if (!selectedExercise) {
        setSelectedExercise("BENCH PRESS"); // Fallback
      }

      // Calculate date range: last 30 days for general stats
      const to = new Date();
      to.setHours(23, 59, 59, 999);

      const from = new Date();
      from.setDate(from.getDate() - 30);
      from.setHours(0, 0, 0, 0);
      
      // Calculate date range: Current Week (Monday to Sunday)
      const now = new Date();
      const dayOfWeek = now.getDay(); // 0 (Sun) - 6 (Sat)
      const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Adjust to get Monday
      
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() + diffToMonday);
      startOfWeek.setHours(0, 0, 0, 0);
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);

      const fromISO = from.toISOString(); // Keep for overview/adherence (last 30 days)
      const toISO = to.toISOString();
      const fromDate = from.toISOString().split('T')[0];
      const toDate = to.toISOString().split('T')[0];

        const [overviewData, adherenceData, dailyVolumesData, bodyStatsData, bodyMetricsHistoryData] = await Promise.all([
        AnalyticsService.getApiAnalyticsOverview({ from: fromISO, to: toISO }).catch(() => null),
        AnalyticsService.getApiAnalyticsAdherence({ fromDate, toDate }).catch(() => null),
        AnalyticsService.getApiAnalyticsVolume({ 
          from: startOfWeek.toISOString(), 
          to: endOfWeek.toISOString(),
          groupBy: "day" 
        }).catch(() => []),
        BodyMetricsService.getApiBodyMetricsStats().catch(() => null),
        BodyMetricsService.getApiBodyMetrics({}).catch(() => []),
      ]);

      setOverview(overviewData);
      setAdherence(adherenceData);
      
      // Process daily volumes to ensure all days of the week are represented
      const processedDailyVolumes = [];
      const volumeMap = new Map();
      
      dailyVolumesData?.forEach(item => {
        if (item.period) {
          const dateKey = item.period.split('T')[0];
          volumeMap.set(dateKey, item.value || 0);
        }
      });

      for (let i = 0; i < 7; i++) {
        const d = new Date(startOfWeek);
        d.setDate(startOfWeek.getDate() + i);
        const dateKey = d.toISOString().split('T')[0];
        processedDailyVolumes.push({
          period: dateKey,
          value: volumeMap.get(dateKey) || 0
        });
      }

      setOverview(overviewData);
      setAdherence(adherenceData);
      setVolumeData(processedDailyVolumes);
      setBodyStats(bodyStatsData);
      setBodyMetricsHistory(bodyMetricsHistoryData || []);

    } catch (error) {
      console.error("Error loading initial statistics:", error);
      setError("Failed to load statistics.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadExerciseData = async (normalizedName: string) => {
    try {
      const to = new Date();
      to.setHours(23, 59, 59, 999);
      const from = new Date();
      from.setDate(from.getDate() - 30);
      from.setHours(0, 0, 0, 0);

      const variants = exerciseVariants[normalizedName] || [normalizedName];
      
      // Fetch data for ALL variants of this exercise
      const results = await Promise.all(
        variants.map(variant => 
          AnalyticsService.getApiAnalyticsVolume({
            from: from.toISOString(),
            to: to.toISOString(),
            groupBy: "day",
            exerciseName: variant,
          }).catch(() => [])
        )
      );

      // Merge results by date
      const mergedDataMap: Record<string, TimePointDto> = {};

      results.flat().forEach(point => {
        if (!point.period) return;
        // Normalize date to YYYY-MM-DD to group correctly
        const dateKey = point.period.split('T')[0];
        
        if (!mergedDataMap[dateKey]) {
          mergedDataMap[dateKey] = { ...point, value: 0, period: dateKey };
        }
        mergedDataMap[dateKey].value = (mergedDataMap[dateKey].value || 0) + (point.value || 0);
      });

      const mergedData = Object.values(mergedDataMap).sort((a, b) => 
        (a.period || "").localeCompare(b.period || "")
      );

      setExerciseVolumeData(mergedData);
    } catch (error) {
      console.error("Error loading exercise data:", error);
    }
  };

  if (isLoading && !overview) {
    return (
      <div className="p-6 text-white text-center">
        <div className="text-xl">Loading statistics...</div>
      </div>
    );
  }

  if (error && !overview) {
    return (
      <div className="p-6 text-white text-center">
        <div className="text-xl text-red-500">{error}</div>
        <button 
          onClick={loadInitialData}
          className="mt-4 bg-green-600 px-4 py-2 rounded hover:bg-green-700"
        >
          Retry
        </button>
      </div>
    );
  }

  // Prepare adherence pie chart data
  const adherencePieData = adherence ? (() => {
    const planned = adherence.planned || 0;
    const completed = adherence.completed || 0;
    const missed = adherence.missed || 0;
    const remaining = Math.max(0, planned - completed - missed);

    return [
      { name: "Completed", value: completed, color: "#22c55e" },
      { name: "Missed", value: missed, color: "#ef4444" },
      { name: "Remaining", value: remaining, color: "#4b5563" },
    ].filter(d => d.value > 0);
  })() : [];

  const formatDateTick = (dateStr: string) => {
    // Handle ISO Week format (e.g., "2025-W45")
    if (/^\d{4}-W\d{1,2}$/.test(dateStr)) {
      return dateStr; // Or convert to "Week 45" if preferred
    }
    // If it looks like a date string YYYY-MM-DD, parse it manually to avoid timezone issues
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const [year, month, day] = dateStr.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString(undefined, { weekday: 'short' }); // Show "Mon", "Tue"
    }
    // Fallback for other formats (e.g. ISO with time)
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    }
    return dateStr;
  };

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
          title="Avg Weight"
          value={overview?.avgWeight?.toFixed(1) || "0"}
          unit="kg"
          subtitle="Across all sets"
          icon="⚖️"
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
          <h2 className="text-2xl font-bold text-white mb-4">Current Week Volume</h2>
          {volumeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={volumeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="period" 
                  stroke="#9ca3af"
                  style={{ fontSize: '12px' }}
                  tickFormatter={formatDateTick}
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
                  labelFormatter={(label) => {
                    const d = new Date(label);
                    return d.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
                  }}
                />
                <Bar dataKey="value" fill="#22c55e" name="Volume (kg)" radius={[4, 4, 0, 0]} />
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
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg flex flex-col">
          <h2 className="text-2xl font-bold text-white mb-4">Training Adherence</h2>
          {adherence && (adherence.planned || 0) > 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center relative">
              <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={adherencePieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      cornerRadius={8}
                      stroke="none"
                    >
                      {adherencePieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                    <Legend 
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                      wrapperStyle={{ color: '#fff', paddingTop: '20px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                
                {/* Center Text Overlay */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[60%] text-center pointer-events-none">
                  <div className="text-4xl font-bold text-white">
                    {adherence.adherencePct?.toFixed(0)}%
                  </div>
                  <div className="text-xs text-zinc-400 uppercase tracking-wider mt-1">
                    Adherence
                  </div>
                </div>
              </div>
            </div>
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
            onChange={(e) => setSelectedExercise(e.target.value)}
            className="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600 max-w-[200px]"
          >
            {availableExercises.length > 0 ? (
              availableExercises.map((ex) => (
                <option key={ex} value={ex}>{ex}</option>
              ))
            ) : (
              <option value="" disabled>No exercises found</option>
            )}
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
                tickFormatter={formatDateTick}
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
                labelFormatter={(label) => formatDateTick(label)}
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
                      tickFormatter={formatDateTick}
                      stroke="#9ca3af"
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} domain={['auto', 'auto']} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }}
                      labelFormatter={(label) => formatDateTick(label)}
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
                      tickFormatter={formatDateTick}
                      stroke="#9ca3af"
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} domain={['auto', 'auto']} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }}
                      labelFormatter={(label) => formatDateTick(label)}
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
