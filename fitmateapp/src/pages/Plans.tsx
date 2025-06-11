import { useEffect, useState, useRef } from "react";
import type { Plan } from "../types/plan";
import AddPlanModal from "../components/AddPlanModal";
import { PlanCard } from "../components/PlanCard";

export default function Plans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    console.log("Attempting to load plans from localStorage...");
    const stored = localStorage.getItem("plans");
    if (stored) {
      try {
        const parsedPlans: Plan[] = JSON.parse(stored);
        const plansArray = Array.isArray(parsedPlans)
          ? parsedPlans
          : parsedPlans && typeof parsedPlans === "object" && "0" in parsedPlans
          ? (Object.values(parsedPlans).filter(
              (item) =>
                typeof item === "object" && item !== null && "id" in item
            ) as Plan[])
          : [];

        console.log("Plans loaded:", plansArray);
        setPlans(plansArray);
      } catch (e) {
        console.error("Error parsing plans from localStorage:", e);
      }
    } else {
      console.log("No plans found in localStorage.");
    }
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    console.log("Saving plans to localStorage:", plans);
    try {
      localStorage.setItem("plans", JSON.stringify(plans));
    } catch (e) {
      console.error("Error saving plans to localStorage:", e);
    }
  }, [plans]);

  const handleAddOrUpdatePlan = (plan: Plan) => {
    if (editingPlan) {
      setPlans((prev) => prev.map((p) => (p.id === plan.id ? plan : p)));
    } else {
      setPlans((prev) => [...prev, { ...plan, id: Date.now() }]);
    }
    setEditingPlan(null);
    setIsModalOpen(false);
  };

  const handleDeletePlan = (id: number) => {
    const confirmed = confirm("Are you sure you want to delete this plan?");
    if (!confirmed) return;

    setPlans((prev) => prev.filter((p) => p.id !== id));
  };

  const handleEditPlan = (plan: Plan) => {
    setEditingPlan(plan);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Your training plans</h1>
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl transition"
          onClick={() => {
            setEditingPlan(null);
            setIsModalOpen(true);
          }}
        >
          Add new
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            onEdit={() => handleEditPlan(plan)}
            onDelete={() => handleDeletePlan(plan.id)}
          />
        ))}
      </div>

      <AddPlanModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPlan(null);
        }}
        onSave={handleAddOrUpdatePlan}
        initialData={editingPlan}
      />
    </div>
  );
}
