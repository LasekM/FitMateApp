import { type Plan } from "../types/plan";

export const dummyPlans: Plan[] = [
  {
    id: 1,
    name: "Push Day",
    type: "Strength",
    description: "Chest, shoulders and triceps",
    exercises: [
      { name: "Barbell press", sets: 4, reps: 8, weight: 60, rest: 90 },
      { name: "Arnold press", sets: 3, reps: 10, weight: 15, rest: 60 },
    ],
  },
  {
    id: 2,
    name: "Pull Day",
    type: "Strength",
    description: "Back and biceps",
    exercises: [
      { name: "Pull-ups", sets: 3, reps: 8, weight: 0, rest: 90 },
      { name: "Dumbbell Curl", sets: 3, reps: 12, weight: 10, rest: 60 },
    ],
  },
];
