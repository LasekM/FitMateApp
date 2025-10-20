import { useEffect, useState } from "react";
import type { Plan as PlanForm } from "../types/plan";
import AddPlanModal from "../components/AddPlanModal";
import { PlanCard } from "../components/PlanCard";
import { PlansService } from "../api-generated";
import type { PlanDto, CreatePlanDto } from "../api-generated";

export default function Plans() {
  const [plans, setPlans] = useState<PlanDto[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingPlan, setEditingPlan] = useState<PlanForm | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPlans = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const plansData = await PlansService.getPlans();
        setPlans(plansData);
      } catch (err) {
        console.error("Error loading plans from API:", err);
        setError("Failed to load plans. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    loadPlans();
  }, []);

  const handleEditPlan = (planFromApi: PlanDto) => {
    const planForForm: PlanForm = {
      id: planFromApi.id,
      name: planFromApi.planName,
      type: planFromApi.type,
      description: planFromApi.notes || "",
      exercises: planFromApi.exercises,
    };
    setEditingPlan(planForForm);
    setIsModalOpen(true);
  };

  const handleAddOrUpdatePlan = async (formData: PlanForm) => {
    try {
      const planDto: CreatePlanDto = {
        planName: formData.name,
        type: formData.type,
        notes: formData.description,
        exercises: formData.exercises,
      };

      if (editingPlan) {
        await PlansService.putPlans({
          id: editingPlan.id,
          requestBody: planDto,
        });
      } else {
        await PlansService.createPlan({
          requestBody: planDto,
        });
      }

      const updatedPlans = await PlansService.getPlans();
      setPlans(updatedPlans);

      setEditingPlan(null);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to save plan:", err);
      alert("Error: Could not save plan. Check console for details.");
    }
  };

  const handleDeletePlan = async (id: string) => {
    const confirmed = confirm("Are you sure you want to delete this plan?");
    if (!confirmed) return;

    try {
      await PlansService.deletePlans({ id: id });
      setPlans((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Failed to delete plan:", err);
      alert("Error: Could not delete plan.");
    }
  };

  if (isLoading) {
    return <div className="p-6 text-white text-center text-xl">Loading...</div>;
  }
  if (error) {
    return <div className="p-6 text-red-500 text-center text-xl">{error}</div>;
  }

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
        {plans.length > 0 ? (
          plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={{
                id: plan.id,
                name: plan.planName,
                type: plan.type,
                description: plan.notes || "",
                exercises: plan.exercises,
              }}
              onEdit={() => handleEditPlan(plan)}
              onDelete={() => handleDeletePlan(plan.id)}
            />
          ))
        ) : (
          <p className="text-zinc-400 md:col-span-2 text-center">
            You don't have any plans yet. Click "Add new" to create one!
          </p>
        )}
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
