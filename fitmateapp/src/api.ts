import axios from "axios";
import type { Plan } from "./types/plan";

const API_BASE = "http://localhost:5000/api";

export const api = {
  async getPlans(): Promise<Plan[]> {
    const res = await axios.get(`${API_BASE}/TrainingPlan`);
    return res.data;
  },

  async addPlan(plan: Omit<Plan, "id">): Promise<Plan> {
    const res = await axios.post(`${API_BASE}/TrainingPlan`, plan);
    return res.data;
  },

  async deletePlan(id: number): Promise<void> {
    await axios.delete(`${API_BASE}/TrainingPlan/${id}`);
  },

  async updatePlan(plan: Plan): Promise<Plan> {
    const res = await axios.put(`${API_BASE}/TrainingPlan/${plan.id}`, plan);
    return res.data;
  },
};
