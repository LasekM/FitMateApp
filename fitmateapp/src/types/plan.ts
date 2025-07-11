export interface SetDetails {
  reps: number;
  weight: number;
}

export interface Exercise {
  name: string;
  rest: number; // in seconds
  sets: SetDetails[];
}

export interface Plan {
  id: number;
  name: string;
  type: string;
  description: string;
  exercises: Exercise[];
}
