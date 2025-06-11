export interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight: number;
  rest: number; // in seconds
}

export interface Plan {
  id: number;
  name: string;
  type: string;
  description: string;
  exercises: Exercise[];
}
