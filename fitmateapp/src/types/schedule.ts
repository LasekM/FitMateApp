import type { Exercise } from "./plan";

export interface ScheduledWorkout {
  id: string;
  date: string;
  time?: string;
  planId: string;
  planName: string;
  exercises: Exercise[];
  status: "planned" | "completed" | "skipped";
}
