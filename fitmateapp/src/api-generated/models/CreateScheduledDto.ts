/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ExerciseDto } from './ExerciseDto';
export type CreateScheduledDto = {
    date?: string | null;
    time?: string | null;
    planId?: string;
    planName?: string | null;
    notes?: string | null;
    exercises?: Array<ExerciseDto> | null;
    status?: string | null;
};

