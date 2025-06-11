import { useState } from "react";
import type { Plan } from "../types/plan";
import { Trash2 } from "lucide-react";

interface AddPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (plan: Plan) => void;
}

interface SetDetails {
  reps: number;
  weight: number;
}

export default function AddPlanModal({
  isOpen,
  onClose,
  onSave,
}: AddPlanModalProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [exercises, setExercises] = useState<any[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);

  const addExercise = () => {
    setExercises([
      ...exercises,
      {
        name: "",
        rest: 60,
        sets: [
          { reps: 10, weight: 0 },
          { reps: 10, weight: 0 },
          { reps: 10, weight: 0 },
        ],
      },
    ]);
  };

  const updateExerciseField = (
    index: number,
    field: "name" | "rest",
    value: string | number
  ) => {
    const updated = [...exercises];
    updated[index][field] = value;
    setExercises(updated);
  };

  const updateSet = (
    exIndex: number,
    setIndex: number,
    field: keyof SetDetails,
    value: number
  ) => {
    const updated = [...exercises];
    updated[exIndex].sets[setIndex][field] = value;
    setExercises(updated);
  };

  const removeExercise = (index: number) => {
    const updated = [...exercises];
    updated.splice(index, 1);
    setExercises(updated);
  };

  const removeSet = (exIndex: number, setIndex: number) => {
    const updated = [...exercises];
    updated[exIndex].sets.splice(setIndex, 1);
    setExercises(updated);
  };

  const addSet = (exIndex: number) => {
    const updated = [...exercises];
    updated[exIndex].sets.push({ reps: 10, weight: 0 });
    setExercises(updated);
  };

  const toggleExpanded = (index: number) => {
    setExpanded(expanded === index ? null : index);
  };

  const handleSave = () => {
    if (!name.trim()) return;
    const newPlan: Plan = {
      id: Date.now(),
      name,
      type,
      description,
      exercises: exercises.map((ex) => ({
        name: ex.name,
        sets: ex.sets.length,
        reps: Math.round(
          ex.sets.reduce(
            (sum: number, s: { reps: number }) => sum + s.reps,
            0
          ) / ex.sets.length
        ),
        weight: Math.round(
          ex.sets.reduce(
            (sum: number, s: { weight: number }) => sum + s.weight,
            0
          ) / ex.sets.length
        ),
        rest: ex.rest,
      })),
    };
    onSave(newPlan);
    onClose();
    setName("");
    setType("");
    setDescription("");
    setExercises([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur flex justify-center items-center z-50">
      <div className="bg-zinc-900 text-white rounded-xl p-6 w-full max-w-2xl overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-bold mb-4">New Training Plan</h2>

        <input
          className="w-full mb-2 p-2 rounded bg-zinc-800 border border-zinc-700"
          placeholder="Plan name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="w-full mb-2 p-2 rounded bg-zinc-800 border border-zinc-700"
          placeholder="Type (e.g. Strength, FBW, Push/Pull)"
          value={type}
          onChange={(e) => setType(e.target.value)}
        />
        <textarea
          className="w-full mb-4 p-2 rounded bg-zinc-800 border border-zinc-700"
          placeholder="Short description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <h3 className="text-lg font-semibold mb-2">Exercises</h3>

        {exercises.map((ex, i) => (
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
                {ex.sets.map((set: SetDetails, j: number) => (
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
            Save Plan
          </button>
        </div>
      </div>
    </div>
  );
}
