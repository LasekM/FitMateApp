/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ExerciseDto } from './ExerciseDto';
/**
 * Data transfer object for creating or updating a scheduled workout.
 */
export type CreateScheduledDto = {
    /**
     * Date of the workout.
     */
    date: string;
    /**
     * Optional time of the workout.
     */
    time?: string | null;
    /**
     * ID of the plan to schedule.
     */
    planId: string;
    /**
     * Optional name of the plan (if overriding or for display).
     */
    planName?: string | null;
    /**
     * Optional notes for the workout.
     */
    notes?: string | null;
    /**
     * List of exercises to include.
     */
    exercises?: Array<ExerciseDto> | null;
    /**
     * Status of the workout.
     * Possible values: "planned", "completed".
     */
    status?: string | null;
    /**
     * Whether to make this workout visible to friends.
     */
    visibleToFriends?: boolean;
};

