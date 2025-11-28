import type { ScheduledDto } from "../api-generated";
import { toDateOnly } from "./dateUtils";

export const normalizeWorkoutDates = (workouts: ScheduledDto[]): ScheduledDto[] => {
  return workouts.map((w) => ({
    ...w,
    date: w.date ? toDateOnly(new Date(w.date)) : w.date,
  }));
};
