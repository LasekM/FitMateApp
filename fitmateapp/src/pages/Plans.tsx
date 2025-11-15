import { useEffect, useState } from "react";
import type { Plan as PlanForm } from "../types/plan";
import AddPlanModal from "../components/AddPlanModal";
import { PlanCard } from "../components/PlanCard";

import {
  PlansService,
  type PlanDto,
  type CreatePlanDto,
} from "../api-generated";

export default function Plans() {
  const [myPlans, setMyPlans] = useState<PlanDto[]>([]);
  const [sharedPlans, setSharedPlans] = useState<PlanDto[]>([]);
  const [activeTab, setActiveTab] = useState<"my" | "shared">("my");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PlanForm | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [myPlansData, sharedPlansData] = await Promise.all([
          PlansService.getApiPlans(),
          PlansService.getApiPlansSharedWithMe(),
        ]);
        setMyPlans(myPlansData);
        setSharedPlans(sharedPlansData);
      } catch (err) {
        console.error("Error loading plans from API:", err);
        setError("Failed to load plans. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleEditPlan = (planFromApi: PlanDto) => {
    if (!planFromApi.id) {
      console.error("Attempted to edit a plan with no ID", planFromApi);
      return;
    }

    const planForForm: PlanForm = {
      id: planFromApi.id,
      name: planFromApi.planName || "Untitled Plan",
      type: planFromApi.type || "No Type",
      description: planFromApi.notes || "",
      exercises: (planFromApi.exercises as any) || [],
    };
    setEditingPlan(planForForm);
    setIsModalOpen(true);
  };

  const handleAddOrUpdatePlan = async (formData: PlanForm) => {
    try {
      const planRequest: CreatePlanDto = {
        planName: formData.name,
        type: formData.type,
        notes: formData.description,
        exercises: formData.exercises as any,
      };

      if (editingPlan) {
        await PlansService.putApiPlans({
          id: editingPlan.id,
          requestBody: planRequest,
        });
      } else {
        await PlansService.postApiPlans({
          requestBody: planRequest,
        });
      }

      const updatedPlans = await PlansService.getApiPlans();
      setMyPlans(updatedPlans);

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
      await PlansService.deleteApiPlans({ id: id });
      setMyPlans((prev) => prev.filter((p) => p.id !== id));
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

  const plansToDisplay = activeTab === "my" ? myPlans : sharedPlans;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Your training plans</h1>
        {activeTab === "my" && (
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl transition"
            onClick={() => {
              setEditingPlan(null);
              setIsModalOpen(true);
            }}
          >
            Add new
          </button>
        )}
      </div>

      <div className="flex space-x-4 border-b border-zinc-700 pb-2">
        <button
          onClick={() => setActiveTab("my")}
          className={`pb-2 ${
            activeTab === "my"
              ? "border-b-2 border-green-500 text-white"
              : "text-zinc-400"
          }`}
        >
          My Plans ({myPlans.length})
        </button>
        <button
          onClick={() => setActiveTab("shared")}
          className={`pb-2 ${
            activeTab === "shared"
              ? "border-b-2 border-green-500 text-white"
              : "text-zinc-400"
          }`}
        >
          Shared with me ({sharedPlans.length})
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {plansToDisplay.length > 0 ? (
          plansToDisplay.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={{
                id: plan.id || "",
                name: plan.planName || "Untitled Plan",
                type: plan.type || "No Type",
                description: plan.notes || "",
                exercises: (plan.exercises as any) || [],
              }}
              onEdit={
                activeTab === "my" && plan.id
                  ? () => handleEditPlan(plan)
                  : undefined
              }
              onDelete={
                activeTab === "my" && plan.id
                  ? () => handleDeletePlan(plan.id!)
                  : undefined
              }
              readOnly={activeTab !== "my"}
            />
          ))
        ) : (
          <p className="text-zinc-400 md:col-span-2 text-center">
            {activeTab === "my"
              ? 'You don\'t have any plans yet. Click "Add new" to create one!'
              : "No plans have been shared with you yet."}
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
