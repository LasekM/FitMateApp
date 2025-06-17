import { useState, useEffect } from "react";
import type { Plan, Exercise, SetDetails } from "../types/plan";
import type { ScheduledWorkout } from "../types/schedule";

interface AddWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (workout: ScheduledWorkout) => void;
  date: Date | null; // Date from calendar, for new workout
  availablePlans: Plan[];
  initialWorkoutData?: ScheduledWorkout | null; // Prop for editing, optional
}

export default function AddWorkoutModal({
  isOpen,
  onClose,
  onSave,
  date,
  availablePlans,
  initialWorkoutData,
}: AddWorkoutModalProps) {
  const [step, setStep] = useState(1);
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [workoutData, setWorkoutData] = useState<Exercise[]>([]); // Exercises with weights, reps etc.
  const [time, setTime] = useState("12:00");

  useEffect(() => {
    if (isOpen) {
      if (initialWorkoutData) {
        // Edit mode
        setStep(2); // Go directly to step 2 as plan is already selected
        setSelectedPlanId(String(initialWorkoutData.planId));
        // Deep copy exercises to avoid modifying the original plan object
        setWorkoutData(
          JSON.parse(JSON.stringify(initialWorkoutData.exercises))
        );
        setTime(initialWorkoutData.time || "12:00"); // Set time from data
      } else {
        // Add mode
        setStep(1);
        setSelectedPlanId("");
        setWorkoutData([]);
        setTime("12:00");
      }
    }
  }, [isOpen, initialWorkoutData]);

  const handleNextStep = () => {
    const plan = availablePlans.find((p) => p.id === Number(selectedPlanId));
    if (plan) {
      // Deep copy exercises so weights can be modified without affecting the original plan
      const exercisesCopy = JSON.parse(JSON.stringify(plan.exercises));
      setWorkoutData(exercisesCopy);
      setStep(2);
    }
  };

  const handleWeightChange = (
    exIndex: number,
    setIndex: number,
    weight: number
  ) => {
    const updatedWorkoutData = [...workoutData];
    // Ensure sets exist on the given exercise and set
    if (
      updatedWorkoutData[exIndex] &&
      updatedWorkoutData[exIndex].sets &&
      updatedWorkoutData[exIndex].sets[setIndex]
    ) {
      updatedWorkoutData[exIndex].sets[setIndex].weight = weight;
      setWorkoutData(updatedWorkoutData);
    }
  };

  const handleSave = () => {
    // Date comes from initialWorkoutData for editing, or from prop.date for adding
    const workoutDateString = initialWorkoutData
      ? initialWorkoutData.date
      : date
      ? date.toISOString().split("T")[0]
      : "";

    if (!workoutDateString || !selectedPlanId) return;

    const plan = availablePlans.find((p) => p.id === Number(selectedPlanId));
    if (!plan) return;

    const newWorkout: ScheduledWorkout = {
      id: initialWorkoutData ? initialWorkoutData.id : Date.now(), // Use existing ID or generate new
      date: workoutDateString,
      time: time,
      planId: plan.id,
      planName: plan.name,
      exercises: workoutData, // Save modified exercises
      status: initialWorkoutData ? initialWorkoutData.status : "planned", // Retain status for editing
    };
    onSave(newWorkout);
    onClose();
  };

  // Modal header and date display based on mode
  const modalTitle = initialWorkoutData ? "Edit Workout" : "Add Workout";
  const displayDate = initialWorkoutData
    ? new Date(initialWorkoutData.date).toLocaleDateString()
    : date
    ? date.toLocaleDateString()
    : "No date";

  if (!isOpen || (!date && !initialWorkoutData)) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur flex justify-center items-center z-50">
      <div className="bg-zinc-900 text-white rounded-xl p-6 w-full max-w-2xl overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-bold mb-4">
          {modalTitle} for {displayDate}
        </h2>
        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold mb-4">
              Step 1: Choose a plan for {date?.toLocaleDateString()}
            </h2>
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
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded disabled:bg-zinc-600 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-xl font-bold mb-2">
              Step 2: Adjust workout details
            </h2>
            <div className="mb-4">
              <label
                htmlFor="workout-time"
                className="block text-sm text-zinc-400 mb-1"
              >
                Time of workout
              </label>
              <input
                id="workout-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="p-2 rounded bg-zinc-800 border border-zinc-700"
              />
            </div>
            {workoutData.map((ex, exIndex) => (
              <div key={exIndex} className="bg-zinc-800 p-3 rounded mb-3">
                <p className="font-semibold text-lg">{ex.name}</p>
                {ex.sets &&
                  ex.sets.map((set, setIndex) => (
                    <div
                      key={setIndex}
                      className="grid grid-cols-3 gap-4 items-center mt-2"
                    >
                      <p className="text-zinc-400">
                        Set {setIndex + 1}: {set.reps} reps
                      </p>
                      <div className="col-span-2 flex items-center gap-2">
                        <input
                          type="number"
                          value={set.weight || ""}
                          onChange={(e) =>
                            handleWeightChange(
                              exIndex,
                              setIndex,
                              Number(e.target.value)
                            )
                          }
                          className="w-24 p-1 rounded bg-zinc-900 border border-zinc-700"
                        />
                        <span className="text-zinc-400">kg</span>
                      </div>
                    </div>
                  ))}
              </div>
            ))}
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setStep(1)}
                className="bg-zinc-700 px-4 py-2 rounded"
              >
                Back
              </button>
              <button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
              >
                {initialWorkoutData ? "Save Changes" : "Save Workout"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
