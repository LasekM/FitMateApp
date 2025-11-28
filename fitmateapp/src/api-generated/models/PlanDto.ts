/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ExerciseDto } from './ExerciseDto';
/**
 * Represents a workout plan.
 */
export type PlanDto = {
    id?: string;
    planName?: string | null;
    type?: string | null;
    notes?: string | null;
    exercises?: Array<ExerciseDto> | null;
};

