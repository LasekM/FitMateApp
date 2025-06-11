import { useState } from "react";
import type { Plan } from "../types/plan";
import AddPlanModal from "../components/AddPlanModal";
import { dummyPlans } from "../data/dummyPlans";
import { PlanCard } from "../components/PlanCard";

export default function Plans() {
  const [plans, setPlans] = useState<Plan[]>(dummyPlans);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddPlan = (newPlan: Plan) => {
    setPlans((prev) => [...prev, newPlan]);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Your training plans</h1>
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl transition"
          onClick={() => setIsModalOpen(true)}
        >
          Add new
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>

      <AddPlanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddPlan}
      />
    </div>
  );
}
