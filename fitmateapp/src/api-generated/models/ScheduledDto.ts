/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ExerciseDto } from './ExerciseDto';
import type { ScheduledStatus } from './ScheduledStatus';
export type ScheduledDto = {
    id: string;
    date: string;
    time?: string | null;
    planId: string;
    planName: string;
    notes?: string | null;
    exercises: Array<ExerciseDto>;
    status: ScheduledStatus;
};

