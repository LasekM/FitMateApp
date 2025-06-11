import type { Plan } from "../types/plan";

const STORAGE_KEY = "fitmate_plans";

export const PlanStorage = {
  loadPlans(): Plan[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  savePlans(plans: Plan[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
  },

  addPlan(plan: Plan) {
    const plans = PlanStorage.loadPlans();
    PlanStorage.savePlans([...plans, plan]);
  },

  deletePlan(id: number) {
    const plans = PlanStorage.loadPlans();
    PlanStorage.savePlans(plans.filter((p) => p.id !== id));
  },

  updatePlan(updatedPlan: Plan) {
    const plans = PlanStorage.loadPlans();
    PlanStorage.savePlans(
      plans.map((p) => (p.id === updatedPlan.id ? updatedPlan : p))
    );
  },
};
