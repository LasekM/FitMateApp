import axios from "axios";

const API_URL = "http://localhost:5000/api/training-plans";

export interface TrainingPlan {
  id: string;
  name: string;
  description: string;
  type: string;
  exercises: Exercise[];
}

export interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight: number;
  rest: number;
}

export const BackendTrainingPlanStorage = {
  async getAll(): Promise<TrainingPlan[]> {
    const response = await axios.get(API_URL);
    return response.data;
  },

  async add(plan: Omit<TrainingPlan, "id">): Promise<TrainingPlan> {
    const response = await axios.post(API_URL, plan);
    return response.data;
  },

  async update(id: string, updatedPlan: TrainingPlan): Promise<void> {
    await axios.put(`${API_URL}/${id}`, updatedPlan);
  },

  async delete(id: string): Promise<void> {
    await axios.delete(`${API_URL}/${id}`);
  },
};
