/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SessionExerciseDto } from './SessionExerciseDto';
/**
 * Represents a workout session.
 */
export type WorkoutSessionDto = {
    id?: string;
    scheduledId?: string;
    startedAtUtc?: string;
    completedAtUtc?: string | null;
    durationSec?: number | null;
    /**
     * Current status of the session.
     * Possible values: "in_progress", "completed", "aborted".
     */
    status?: string | null;
    sessionNotes?: string | null;
    exercises?: Array<SessionExerciseDto> | null;
};

