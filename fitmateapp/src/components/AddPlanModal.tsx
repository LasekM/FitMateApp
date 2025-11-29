import { useEffect, useState } from "react";
import type { Plan, Exercise, SetDetails } from "../types/plan";
import { Trash2 } from "lucide-react";

interface AddPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (plan: Plan) => void;
  initialData?: Plan | null;
}

const getInitialPlanState = (): Plan => ({
  id: Date.now().toString(),
  name: "",
  type: "",
  description: "",
  exercises: [],
});

export default function AddPlanModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: AddPlanModalProps) {
  const [planData, setPlanData] = useState<Plan>(getInitialPlanState());
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    if (initialData) {
      setPlanData(initialData);
    } else {
      setPlanData(getInitialPlanState());
    }
  }, [initialData]);

  const updatePlanField = (field: keyof Plan, value: string) => {
    setPlanData((prev) => ({ ...prev, [field]: value }));
  };

  const updateExerciseField = (
    index: number,
    field: keyof Exercise,
    value: string | number
  ) => {
    const updatedExercises = [...planData.exercises];
    // @ts-ignore
    updatedExercises[index][field] = value;
    setPlanData((prev) => ({ ...prev, exercises: updatedExercises }));
  };

  const updateSet = (
    exIndex: number,
    setIndex: number,
    field: keyof SetDetails,
    value: number
  ) => {
    const updatedExercises = [...planData.exercises];
    updatedExercises[exIndex].sets[setIndex][field] = value;
    setPlanData((prev) => ({ ...prev, exercises: updatedExercises }));
  };

  const addExercise = () => {
    const newExercise: Exercise = {
      name: "",
      rest: 60,
      sets: [{ reps: 10, weight: 0 }],
    };
    setPlanData((prev) => ({
      ...prev,
      exercises: [...prev.exercises, newExercise],
    }));
  };

  const removeExercise = (index: number) => {
    const updatedExercises = planData.exercises.filter((_, i) => i !== index);
    setPlanData((prev) => ({ ...prev, exercises: updatedExercises }));
  };

  const addSet = (exIndex: number) => {
    const updatedExercises = [...planData.exercises];
    const sets = updatedExercises[exIndex].sets;
    const lastSet = sets.length > 0 ? sets[sets.length - 1] : { reps: 10, weight: 0 };
    
    updatedExercises[exIndex].sets.push({ 
      reps: lastSet.reps, 
      weight: lastSet.weight 
    });
    setPlanData((prev) => ({ ...prev, exercises: updatedExercises }));
  };

  const removeSet = (exIndex: number, setIndex: number) => {
    const updatedExercises = [...planData.exercises];
    updatedExercises[exIndex].sets.splice(setIndex, 1);
    setPlanData((prev) => ({ ...prev, exercises: updatedExercises }));
  };

  const toggleExpanded = (index: number) => {
    setExpanded(expanded === index ? null : index);
  };

  const handleSave = () => {
    if (!planData.name.trim()) return;
    onSave(planData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur flex justify-center items-center z-50">
      <div className="bg-zinc-900 text-white rounded-xl p-6 w-full max-w-2xl overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-bold mb-4">
          {initialData ? "Edit Training Plan" : "New Training Plan"}
        </h2>
        <input
          className="w-full mb-2 p-2 rounded bg-zinc-800 border border-zinc-700"
          placeholder="Plan name"
          value={planData.name}
          onChange={(e) => updatePlanField("name", e.target.value)}
          required
        />
        <input
          className="w-full mb-2 p-2 rounded bg-zinc-800 border border-zinc-700"
          placeholder="Type (e.g. Strength, FBW, Push/Pull)"
          value={planData.type}
          onChange={(e) => updatePlanField("type", e.target.value)}
        />
        <textarea
          className="w-full mb-4 p-2 rounded bg-zinc-800 border border-zinc-700"
          placeholder="Short description"
          value={planData.description}
          onChange={(e) => updatePlanField("description", e.target.value)}
        />

        <h3 className="text-lg font-semibold mb-2">Exercises</h3>

        {planData.exercises.map((ex, i) => (
          <div key={i} className="bg-zinc-800 p-3 rounded mb-3">
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 items-center">
              <div className="col-span-2 md:col-span-3">
                <label className="block text-sm text-zinc-400">
                  Exercise Name
                </label>
                <input
                  className="w-full p-1 rounded bg-zinc-900 border border-zinc-700"
                  value={ex.name}
                  onChange={(e) =>
                    updateExerciseField(i, "name", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400">Rest (s)</label>
                <input
                  type="number"
                  className="w-full p-1 rounded bg-zinc-900 border border-zinc-700"
                  value={ex.rest}
                  onChange={(e) =>
                    updateExerciseField(i, "rest", Number(e.target.value))
                  }
                />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm text-zinc-400">Sets</label>
                <button
                  onClick={() => toggleExpanded(i)}
                  className="bg-zinc-700 px-2 py-1.5 rounded text-sm w-full"
                >
                  {expanded === i ? "Hide" : "Show"} sets
                </button>
              </div>
              <div className="md:col-span-1 text-center mt-4">
                <button
                  onClick={() => removeExercise(i)}
                  className="text-red-500 hover:text-red-400"
                >
                  Delete
                </button>
              </div>
            </div>

            {expanded === i && (
              <div className="mt-3 space-y-2">
                {ex.sets.map((set, j) => (
                  <div key={j} className="grid grid-cols-5 gap-2 items-center">
                    <div className="col-span-2 md:col-span-1">
                      <label className="text-sm text-zinc-400">
                        Reps (set {j + 1})
                      </label>
                      <input
                        type="number"
                        className="w-full p-1 rounded bg-zinc-900 border border-zinc-700"
                        value={set.reps}
                        onChange={(e) =>
                          updateSet(i, j, "reps", Number(e.target.value))
                        }
                      />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <label className="text-sm text-zinc-400">
                        Weight (kg)
                      </label>
                      <input
                        type="number"
                        className="w-full p-1 rounded bg-zinc-900 border border-zinc-700"
                        value={set.weight}
                        onChange={(e) =>
                          updateSet(i, j, "weight", Number(e.target.value))
                        }
                      />
                    </div>
                    <div className="sm:col-span-2 flex justify-start items-end h-full ml-3 mb-3">
                      <button
                        onClick={() => removeSet(i, j)}
                        className="text-red-400 hover:text-red-500"
                        title="Delete Set"
                      >
                        <Trash2 size={22} />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => addSet(i)}
                  className="bg-zinc-700 px-3 py-1 rounded text-sm mt-2"
                >
                  + Add Set
                </button>
              </div>
            )}
          </div>
        ))}

        <button
          onClick={addExercise}
          className="bg-zinc-700 px-3 py-1 rounded mb-4"
        >
          + Add Exercise
        </button>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="bg-zinc-700 px-4 py-2 rounded">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
          >
            {initialData ? "Save Changes" : "Save Plan"}
          </button>
        </div>
      </div>
    </div>
  );
}
