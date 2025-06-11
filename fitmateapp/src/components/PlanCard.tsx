import type { Plan } from "../types/plan";

interface PlanCardProps {
  plan: Plan;
}

export function PlanCard({ plan }: PlanCardProps) {
  return (
    <div className="rounded-2xl bg-zinc-800 text-white p-5 shadow-lg">
      <h2 className="text-xl font-semibold">{plan.name}</h2>
      <p className="text-sm text-zinc-400 mb-2">
        {plan.type} – {plan.description}
      </p>
      <ul className="text-sm list-disc pl-5 mb-4">
        {plan.exercises.map((ex, i) => (
          <li key={i}>
            {ex.name}: {ex.sets} sets ({ex.weight} kg, {ex.rest}s)
          </li>
        ))}
      </ul>
      <div className="flex gap-2">
        <button className="bg-zinc-700 hover:bg-zinc-600 px-3 py-1 rounded text-white">
          Edit
        </button>
        <button className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white">
          Delete
        </button>
      </div>
    </div>
  );
}
