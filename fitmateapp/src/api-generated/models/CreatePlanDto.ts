/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ExerciseDto } from './ExerciseDto';
/**
 * Data transfer object for creating a new workout plan.
 */
export type CreatePlanDto = {
    planName: string;
    type: string;
    notes?: string | null;
    exercises?: Array<ExerciseDto> | null;
};

