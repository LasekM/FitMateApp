/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ExerciseDto } from './ExerciseDto';
export type CreatePlanDto = {
    planName: string;
    type: string;
    notes?: string | null;
    exercises?: Array<ExerciseDto>;
};

