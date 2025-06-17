import type { Exercise } from "./plan";

export interface ScheduledWorkout {
  id: number;
  date: string;
  time?: string;
  planId: number;
  planName: string;
  exercises: Exercise[];
  status: "planned" | "completed" | "skipped";
}
