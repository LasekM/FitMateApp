import { useState, useEffect } from "react";
import type { Plan as PlanForm } from "../types/plan";
import type { ScheduledWorkout as ScheduleForm } from "../types/schedule";
import { toDateOnly } from "../utils/dateUtils";

interface AddWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (workout: ScheduleForm) => void;
  dateString: string;
  availablePlans: PlanForm[];
  initialWorkoutData?: ScheduleForm | null;
}

export default function AddWorkoutModal({
  isOpen,
  onClose,
  onSave,
  dateString,
  availablePlans,
  initialWorkoutData,
}: AddWorkoutModalProps) {
  const [step, setStep] = useState(1);
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");

  const [formData, setFormData] = useState<Partial<ScheduleForm>>({
    visibleToFriends: true,
  });

  useEffect(() => {
    if (isOpen) {
      if (initialWorkoutData) {
        // Tryb edycji
        setStep(2);
        setSelectedPlanId(String(initialWorkoutData.planId));
        setFormData(initialWorkoutData);
      } else {
        // Tryb dodawania
        setStep(1);
        setSelectedPlanId("");
        setFormData({
          date: dateString || toDateOnly(new Date()),
          time: "12:00",
          status: "planned",
          visibleToFriends: true,
        });
      }
    }
  }, [isOpen, initialWorkoutData, dateString]);

  const handleNextStep = () => {
    const plan = availablePlans.find((p) => p.id === selectedPlanId);
    if (plan) {
      setFormData((prev) => ({
        ...prev,
        planId: plan.id,
        planName: plan.name,
        exercises: JSON.parse(JSON.stringify(plan.exercises)),
      }));
      setStep(2);
    }
  };

  const handleWeightChange = (
    exIndex: number,
    setIndex: number,
    weight: number
  ) => {
    const updatedExercises = formData.exercises ? [...formData.exercises] : [];
    if (updatedExercises[exIndex]?.sets[setIndex]) {
      updatedExercises[exIndex].sets[setIndex].weight = weight;
      setFormData({ ...formData, exercises: updatedExercises });
    }
  };

  const handleSave = () => {
    onSave(formData as ScheduleForm);
    onClose();
  };

  const modalTitle = initialWorkoutData ? "Edit Workout" : "Add Workout";
  const displayDate = initialWorkoutData
    ? initialWorkoutData.date
    : dateString
    ? dateString
    : "No date";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur flex justify-center items-center z-50">
      <div className="bg-zinc-900 text-white rounded-xl p-6 w-full max-w-2xl overflow-y-auto max-h-[90vh]">
        {/* ZMIANA: Używamy zmiennych tutaj */}
        <h2 className="text-xl font-bold mb-4">
          {modalTitle}{" "}
          <span className="text-zinc-400 text-sm font-normal">
            ({displayDate})
          </span>
        </h2>

        {step === 1 && (
          <div>
            <select
              value={selectedPlanId}
              onChange={(e) => setSelectedPlanId(e.target.value)}
              className="w-full mb-4 p-2 rounded bg-zinc-800 border border-zinc-700"
            >
              <option value="" disabled>
                -- Select a workout plan --
              </option>
              {availablePlans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name} ({plan.type})
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={onClose}
                className="bg-zinc-700 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleNextStep}
                disabled={!selectedPlanId}
                className="bg-green-600 px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <label className="block text-sm text-zinc-400 mb-1">Time</label>
                <input
                  type="time"
                  value={formData.time || "12:00"}
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                  className="w-full p-2 rounded bg-zinc-800 border border-zinc-700"
                />
              </div>
              <div className="flex items-center pt-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.visibleToFriends || false}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        visibleToFriends: e.target.checked,
                      })
                    }
                    className="w-5 h-5 rounded border-zinc-600 text-green-600 focus:ring-green-500 bg-zinc-800"
                  />
                  <span className="ml-2 text-sm text-zinc-300">
                    Visible to friends
                  </span>
                </label>
              </div>
            </div>

            {formData.exercises?.map((ex, exIndex) => (
              <div key={exIndex} className="bg-zinc-800 p-3 rounded mb-3">
                <p className="font-semibold">{ex.name}</p>
                {ex.sets.map((set, setIndex) => (
                  <div key={setIndex} className="flex gap-2 mt-1">
                    <span className="text-zinc-400 text-sm w-20">
                      Set {setIndex + 1}:
                    </span>
                    <span className="text-zinc-400 text-sm w-16">
                      {set.reps} reps
                    </span>
                    <input
                      type="number"
                      value={set.weight}
                      onChange={(e) =>
                        handleWeightChange(
                          exIndex,
                          setIndex,
                          Number(e.target.value)
                        )
                      }
                      className="w-24 p-1 bg-zinc-900 border border-zinc-700 rounded"
                      placeholder="kg"
                    />
                    <span className="text-zinc-500 text-sm self-center">
                      kg
                    </span>
                  </div>
                ))}
              </div>
            ))}

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setStep(1)}
                className="bg-zinc-700 px-4 py-2 rounded hover:bg-zinc-600"
              >
                Back
              </button>
              <button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
