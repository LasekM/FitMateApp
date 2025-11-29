import { useState, useEffect } from "react";
import { UserProfileService, BodyMetricsService } from "../api-generated";
import type { BodyMeasurementDto, BodyMetricsStatsDto } from "../api-generated";
import { toast } from "react-toastify";
import { User, Lock, Trash2, TrendingUp, Activity } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const Profile = () => {
  const [activeTab, setActiveTab] = useState<"metrics" | "account">("metrics");
  const [isLoading, setIsLoading] = useState(true);

  // Profile State
  const [profileForm, setProfileForm] = useState({
    userName: "",
    fullName: "",
    email: "",
  });

  // Password State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Metrics State
  const [metricsStats, setMetricsStats] = useState<BodyMetricsStatsDto | null>(null);
  const [measurements, setMeasurements] = useState<BodyMeasurementDto[]>([]);
  
  // Unified Measurement Form State
  const [measurementForm, setMeasurementForm] = useState({
    weightKg: "",
    heightCm: "",
    bodyFatPercentage: "",
    chestCm: "",
    waistCm: "",
    hipsCm: "",
    bicepsCm: "",
    thighsCm: "",
    notes: "",
  });

  // Target Weight
  const [targetWeight, setTargetWeight] = useState("");
  const weightDifference = metricsStats?.currentWeightKg && targetWeight ? (metricsStats.currentWeightKg - parseFloat(targetWeight)).toFixed(1) : "--";

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [profileData, statsData, historyData, targetWeightData] = await Promise.all([
        UserProfileService.getApiUserprofile(),
        BodyMetricsService.getApiBodyMetricsStats().catch(() => null), // Handle 404 if no metrics
        BodyMetricsService.getApiBodyMetrics({}).catch(() => []),
        UserProfileService.getApiUserprofileTargetWeight().catch(() => null),
      ]);

      setProfileForm({
        userName: profileData.userName || "",
        fullName: profileData.fullName || "",
        email: profileData.email || "",
      });

      setMetricsStats(statsData);
      setMeasurements(historyData || []);
      setTargetWeight(targetWeightData?.targetWeightKg?.toString() || "");

      // Pre-fill form with latest measurement data (except weight which user likely wants to input new)
      if (historyData && historyData.length > 0) {
        const latest = historyData[0];
        setMeasurementForm(prev => ({
          ...prev,
          heightCm: latest.heightCm?.toString() || "",
          bodyFatPercentage: latest.bodyFatPercentage?.toString() || "",
          chestCm: latest.chestCm?.toString() || "",
          waistCm: latest.waistCm?.toString() || "",
          hipsCm: latest.hipsCm?.toString() || "",
          bicepsCm: latest.bicepsCm?.toString() || "",
          thighsCm: latest.thighsCm?.toString() || "",
        }));
      }
    } catch (err) {
      console.error("Failed to load profile data:", err);
      toast.error("Failed to load profile data.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await UserProfileService.putApiUserprofile({
        requestBody: profileForm,
      });
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      console.error("Update profile error:", err);
      toast.error(err.body?.message || "Failed to update profile.");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    try {
      await UserProfileService.postApiUserprofileChangePassword({
        requestBody: {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
          confirmPassword: passwordForm.confirmPassword,
        },
      });
      toast.success("Password changed successfully!");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      console.error("Change password error:", err);
      toast.error(err.body?.message || "Failed to change password.");
    }
  };

  const handleSaveTargetWeight = async () => {
    try {
      await UserProfileService.putApiUserprofileTargetWeight({
        requestBody: {
          targetWeightKg: targetWeight ? parseFloat(targetWeight) : 0, // 0 clears it
        },
      });
      toast.success("Target weight saved!");
    } catch (err: any) {
      console.error("Save target weight error:", err);
      toast.error(err.body?.message || "Failed to save target weight.");
    }
  };

  const handleSaveMeasurement = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!measurementForm.weightKg || !measurementForm.heightCm) {
      toast.error("Weight and Height are required.");
      return;
    }

    try {
      await BodyMetricsService.postApiBodyMetrics({
        requestBody: {
          weightKg: parseFloat(measurementForm.weightKg),
          heightCm: parseFloat(measurementForm.heightCm),
          bodyFatPercentage: measurementForm.bodyFatPercentage ? parseFloat(measurementForm.bodyFatPercentage) : undefined,
          chestCm: measurementForm.chestCm ? parseFloat(measurementForm.chestCm) : undefined,
          waistCm: measurementForm.waistCm ? parseFloat(measurementForm.waistCm) : undefined,
          hipsCm: measurementForm.hipsCm ? parseFloat(measurementForm.hipsCm) : undefined,
          bicepsCm: measurementForm.bicepsCm ? parseFloat(measurementForm.bicepsCm) : undefined,
          thighsCm: measurementForm.thighsCm ? parseFloat(measurementForm.thighsCm) : undefined,
          notes: measurementForm.notes,
        },
      });
      
      toast.success("Measurement saved successfully!");
      
      // Refresh stats and history
      const [newStats, newHistory] = await Promise.all([
        BodyMetricsService.getApiBodyMetricsStats(),
        BodyMetricsService.getApiBodyMetrics({}),
      ]);
      
      setMetricsStats(newStats);
      setMeasurements(newHistory || []);

      // Reset weight and notes
      setMeasurementForm(prev => ({
        ...prev,
        weightKg: "",
        notes: "",
      }));
    } catch (err: any) {
      console.error("Save measurement error:", err);
      toast.error(err.body?.message || "Failed to save measurement.");
    }
  };

  const handleDeleteMeasurement = async (id: string) => {
    if (!confirm("Are you sure you want to delete this measurement?")) return;
    try {
      await BodyMetricsService.deleteApiBodyMetrics({ id });
      setMeasurements((prev) => prev.filter((m) => m.id !== id));
      
      // Refresh stats
      const newStats = await BodyMetricsService.getApiBodyMetricsStats().catch(() => null);
      setMetricsStats(newStats);
      
      toast.success("Measurement deleted.");
    } catch (err: any) {
      console.error("Delete measurement error:", err);
      toast.error("Failed to delete measurement.");
    }
  };

  if (isLoading) return <div className="p-8 text-white text-center">Loading profile...</div>;

  return (
    <div className="p-6 text-white max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <User className="text-green-500" size={32} />
        Your Profile
      </h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-zinc-700 pb-1">
        <button
          onClick={() => setActiveTab("metrics")}
          className={`px-4 py-2 font-medium transition-colors relative ${
            activeTab === "metrics" ? "text-green-500" : "text-zinc-400 hover:text-white"
          }`}
        >
          Body Metrics
          {activeTab === "metrics" && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-green-500 -mb-1 rounded-t-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("account")}
          className={`px-4 py-2 font-medium transition-colors relative ${
            activeTab === "account" ? "text-green-500" : "text-zinc-400 hover:text-white"
          }`}
        >
          Account Settings
          {activeTab === "account" && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-green-500 -mb-1 rounded-t-full" />
          )}
        </button>
      </div>

      {activeTab === "metrics" && (
        <div className="space-y-8">
          {/* 1. Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
              <p className="text-zinc-400 text-sm">Current Weight</p>
              <p className="text-2xl font-bold text-white">{metricsStats?.currentWeightKg || "--"} kg</p>
            </div>
            <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
              <p className="text-zinc-400 text-sm">Target Weight</p>
              <p className="text-2xl font-bold text-blue-400">{targetWeight || "--"} kg</p>
            </div>
            <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
              <p className="text-zinc-400 text-sm">To Go</p>
              <p className={`text-2xl font-bold ${Number(weightDifference) > 0 ? 'text-red-400' : 'text-green-400'}`}>
                {Number(weightDifference) > 0 ? `+${weightDifference}` : weightDifference} kg
              </p>
            </div>
            <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
              <p className="text-zinc-400 text-sm">BMI</p>
              <p className="text-2xl font-bold text-green-500">{metricsStats?.currentBMI?.toFixed(1) || "--"}</p>
            </div>
          </div>

          {/* 2. Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weight Chart */}
            <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-white">Weight Progress</h2>
              {measurements.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={[...measurements].reverse()}>
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
                <div className="h-[300px] flex items-center justify-center text-zinc-500">No data available</div>
              )}
            </div>

            {/* Body Measurements Chart */}
            <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-white">Body Measurements</h2>
              {measurements.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={[...measurements].reverse()}>
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
                <div className="h-[300px] flex items-center justify-center text-zinc-500">No data available</div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Settings & New Measurement */}
            <div className="space-y-8">
              {/* 3. Settings Section */}
              <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Activity size={20} /> Settings
                </h2>
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Target Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={targetWeight}
                    onChange={(e) => setTargetWeight(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500 mb-2"
                    placeholder="Enter target weight"
                  />
                  <button
                    onClick={handleSaveTargetWeight}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition-colors"
                  >
                    Save
                  </button>
                  <p className="text-xs text-zinc-500 mt-1">Used to calculate "To Go" progress.</p>
                </div>
              </div>

              {/* 4. Unified Measurement Form */}
              <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Activity size={20} /> New Measurement
                </h2>
                <form onSubmit={handleSaveMeasurement} className="space-y-6">
                  
                  {/* Core Metrics */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-zinc-300 border-b border-zinc-700 pb-1">Core Metrics</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-zinc-400 mb-1">Weight (kg) *</label>
                        <input
                          type="number"
                          step="0.1"
                          required
                          value={measurementForm.weightKg}
                          onChange={(e) => setMeasurementForm({ ...measurementForm, weightKg: e.target.value })}
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500"
                          placeholder="Current"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-zinc-400 mb-1">Height (cm) *</label>
                        <input
                          type="number"
                          step="0.1"
                          required
                          value={measurementForm.heightCm}
                          onChange={(e) => setMeasurementForm({ ...measurementForm, heightCm: e.target.value })}
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Body Measurements */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-zinc-300 border-b border-zinc-700 pb-1">Body Measurements (cm)</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-zinc-400 mb-1">Chest</label>
                        <input
                          type="number"
                          step="0.1"
                          value={measurementForm.chestCm}
                          onChange={(e) => setMeasurementForm({ ...measurementForm, chestCm: e.target.value })}
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-zinc-400 mb-1">Waist</label>
                        <input
                          type="number"
                          step="0.1"
                          value={measurementForm.waistCm}
                          onChange={(e) => setMeasurementForm({ ...measurementForm, waistCm: e.target.value })}
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-zinc-400 mb-1">Hips</label>
                        <input
                          type="number"
                          step="0.1"
                          value={measurementForm.hipsCm}
                          onChange={(e) => setMeasurementForm({ ...measurementForm, hipsCm: e.target.value })}
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-zinc-400 mb-1">Biceps</label>
                        <input
                          type="number"
                          step="0.1"
                          value={measurementForm.bicepsCm}
                          onChange={(e) => setMeasurementForm({ ...measurementForm, bicepsCm: e.target.value })}
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-zinc-400 mb-1">Thighs</label>
                        <input
                          type="number"
                          step="0.1"
                          value={measurementForm.thighsCm}
                          onChange={(e) => setMeasurementForm({ ...measurementForm, thighsCm: e.target.value })}
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-zinc-400 mb-1">Body Fat %</label>
                        <input
                          type="number"
                          step="0.1"
                          value={measurementForm.bodyFatPercentage}
                          onChange={(e) => setMeasurementForm({ ...measurementForm, bodyFatPercentage: e.target.value })}
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Notes</label>
                    <input
                      type="text"
                      value={measurementForm.notes}
                      onChange={(e) => setMeasurementForm({ ...measurementForm, notes: e.target.value })}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500"
                      placeholder="Optional notes"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition-colors"
                  >
                    Save Measurement
                  </button>
                </form>
              </div>
            </div>

            {/* 5. History List (Right Column) */}
            <div className="lg:col-span-2 bg-zinc-900 p-6 rounded-xl border border-zinc-800 h-full">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <TrendingUp size={20} /> History
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-zinc-400 border-b border-zinc-700">
                      <th className="pb-3 pl-2">Date</th>
                      <th className="pb-3">Weight</th>
                      <th className="pb-3">BMI</th>
                      <th className="pb-3 hidden md:table-cell">Fat %</th>
                      <th className="pb-3 hidden md:table-cell">Chest</th>
                      <th className="pb-3 hidden md:table-cell">Waist</th>
                      <th className="pb-3 hidden md:table-cell">Hips</th>
                      <th className="pb-3 hidden md:table-cell">Biceps</th>
                      <th className="pb-3 hidden md:table-cell">Thighs</th>
                      <th className="pb-3 text-right pr-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {measurements.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="py-4 text-center text-zinc-500">
                          No measurements recorded yet.
                        </td>
                      </tr>
                    ) : (
                      measurements.map((m) => (
                        <tr key={m.id} className="hover:bg-zinc-800/50 transition-colors">
                          <td className="py-3 pl-2 text-zinc-300">
                            {m.measuredAtUtc ? new Date(m.measuredAtUtc).toLocaleDateString() : "-"}
                          </td>
                          <td className="py-3 font-medium text-white">{m.weightKg}</td>
                          <td className="py-3 text-zinc-300">{m.bmi?.toFixed(1)}</td>
                          <td className="py-3 text-zinc-400 hidden md:table-cell">{m.bodyFatPercentage || "-"}</td>
                          <td className="py-3 text-zinc-400 hidden md:table-cell">{m.chestCm || "-"}</td>
                          <td className="py-3 text-zinc-400 hidden md:table-cell">{m.waistCm || "-"}</td>
                          <td className="py-3 text-zinc-400 hidden md:table-cell">{m.hipsCm || "-"}</td>
                          <td className="py-3 text-zinc-400 hidden md:table-cell">{m.bicepsCm || "-"}</td>
                          <td className="py-3 text-zinc-400 hidden md:table-cell">{m.thighsCm || "-"}</td>
                          <td className="py-3 text-right pr-2">
                            <button
                              onClick={() => handleDeleteMeasurement(m.id!)}
                              className="text-red-500 hover:text-red-400 p-1 rounded hover:bg-red-900/20 transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "account" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Personal Info */}
          <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <User size={20} /> Personal Information
            </h2>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Username</label>
                <input
                  type="text"
                  value={profileForm.userName}
                  onChange={(e) => setProfileForm({ ...profileForm, userName: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={profileForm.fullName}
                  onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Email</label>
                <input
                  type="email"
                  value={profileForm.email}
                  disabled
                  className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-500 cursor-not-allowed"
                  title="Email cannot be changed"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition-colors mt-2"
              >
                Save Changes
              </button>
            </form>
          </div>

          {/* Change Password */}
          <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Lock size={20} /> Change Password
            </h2>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Current Password</label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">New Password</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-zinc-700 hover:bg-zinc-600 text-white font-medium py-2 rounded-lg transition-colors mt-2"
              >
                Update Password
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
