import type { Plan } from "../types/plan"; // Nadal potrzebujemy typu Exercise

interface PlanCardProps {
  plan: Plan;
  onEdit: () => void;
  onDelete: () => void;
}

export const PlanCard = ({ plan, onEdit, onDelete }: PlanCardProps) => {
  const exercises = plan.exercises || []; // Zapewniamy, że exercises to zawsze tablica
  const totalExercises = exercises.length;

  // Wyświetl do 5 pierwszych ćwiczeń, jeśli jest ich więcej
  const exercisesToShow = exercises.slice(0, 5);
  const hasMoreExercises = exercises.length > exercisesToShow.length;

  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 flex flex-col justify-between hover:border-green-500 transition-all duration-200 transform hover:scale-[1.01]">
      <div>
        <h3 className="text-2xl font-bold text-white mb-2 leading-tight">
          {plan.name}
        </h3>
        {plan.type && (
          <p className="text-green-400 text-sm font-semibold mb-3">
            {plan.type.toUpperCase()}
          </p>
        )}

        <p className="text-gray-400 text-base mb-4 line-clamp-3">
          {plan.description || "Brak opisu dla tego planu."}
        </p>

        {totalExercises > 0 ? (
          <div className="mt-4 pt-4 border-t border-gray-700">
            <h4 className="text-lg font-semibold text-white mb-3">
              Exercises:
            </h4>
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              {exercisesToShow.map((exercise, index) => (
                <li key={index} className="text-base">
                  {exercise.name}
                </li>
              ))}
              {hasMoreExercises && (
                <li className="text-gray-500 text-sm italic">
                  and {exercises.length - exercisesToShow.length} more...
                </li>
              )}
            </ul>
          </div>
        ) : (
          <div className="mt-4 pt-4 border-t border-gray-700 text-gray-300">
            <p className="text-base italic">No exercises.</p>
          </div>
        )}
        <div className="mt-4 pt-4 border-t border-gray-700 text-gray-300 flex items-center justify-between">
          <span className="text-base font-medium">
            Total number of exercises:
          </span>
          <span className="text-xl font-bold text-green-400">
            {totalExercises}
          </span>
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <button
          onClick={onEdit}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition-colors duration-200 font-medium"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg transition-colors duration-200 font-medium"
        >
          Delete
        </button>
      </div>
    </div>
  );
};
