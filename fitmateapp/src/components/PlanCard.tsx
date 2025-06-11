import type { Plan } from "../types/plan";

interface PlanCardProps {
  plan: Plan;
  onEdit: () => void;
  onDelete: () => void;
}

export const PlanCard = ({ plan, onEdit, onDelete }: PlanCardProps) => {
  return (
    <div className="bg-gray-800 rounded-xl p-4 text-white shadow">
      <h2 className="text-lg font-semibold">{plan.name}</h2>
      <p className="text-sm text-gray-400">{plan.type}</p>
      <p className="mt-2">{plan.description}</p>

      <div className="mt-4 flex justify-end gap-2">
        <button
          onClick={onEdit}
          className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 rounded text-sm"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
};
