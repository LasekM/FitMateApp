import { useEffect, useState } from "react";
import { BodyMetricsService, type BodyMeasurementDto } from "../api-generated";
import { toast } from "react-toastify";
import { toDateOnly } from "../utils/dateUtils";

export default function MeasurementsPage() {
  const [measurements, setMeasurements] = useState<BodyMeasurementDto[]>([]);
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");

  useEffect(() => {
    loadMeasurements();
  }, []);

  const loadMeasurements = async () => {
    try {
      const data = await BodyMetricsService.getApiBodyMetrics({});
      setMeasurements(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await BodyMetricsService.postApiBodyMetrics({
        requestBody: {
          weightKg: Number(weight),
          heightCm: Number(height) || 180,
          notes: "Quick add",
        },
      });
      setMeasurements([created, ...measurements]);
      setWeight("");
      toast.success("Measurement added!");
    } catch (e) {
      toast.error("Error adding measurement");
    }
  };

  return (
    <div className="p-6 text-white max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Body Metrics</h1>

      <form
        onSubmit={handleAdd}
        className="bg-zinc-800 p-4 rounded-lg mb-8 flex gap-4 items-end"
      >
        <div>
          <label className="block text-sm text-zinc-400">Weight (kg)</label>
          <input
            type="number"
            step="0.1"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="p-2 rounded bg-zinc-900 border border-zinc-700 w-32"
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-400">Height (cm)</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="p-2 rounded bg-zinc-900 border border-zinc-700 w-32"
          />
        </div>
        <button className="bg-green-600 px-4 py-2 rounded hover:bg-green-700">
          Add Entry
        </button>
      </form>

      <div className="space-y-2">
        {measurements.map((m) => (
          <div
            key={m.id}
            className="bg-zinc-800 p-4 rounded flex justify-between items-center"
          >
            <div>
              <span className="font-bold text-lg">{m.weightKg} kg</span>
              <span className="text-zinc-500 text-sm ml-2">
                BMI: {m.bmi?.toFixed(1)}
              </span>
            </div>
            <div className="text-zinc-400">
              {toDateOnly(new Date(m.measuredAtUtc!))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
