/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SessionExerciseDto } from './SessionExerciseDto';
export type WorkoutSessionDto = {
    id?: string;
    scheduledId?: string;
    startedAtUtc?: string;
    completedAtUtc?: string | null;
    durationSec?: number | null;
    status?: string | null;
    sessionNotes?: string | null;
    exercises?: Array<SessionExerciseDto> | null;
};

