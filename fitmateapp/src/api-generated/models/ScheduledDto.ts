/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ExerciseDto } from './ExerciseDto';
/**
 * Represents a scheduled workout.
 */
export type ScheduledDto = {
    /**
     * Unique identifier of the scheduled workout.
     */
    id?: string;
    /**
     * Date of the scheduled workout.
     */
    date?: string;
    /**
     * Optional time of the scheduled workout.
     */
    time?: string | null;
    /**
     * ID of the plan used for this workout.
     */
    planId?: string;
    /**
     * Name of the plan.
     */
    planName?: string | null;
    /**
     * Optional notes for the scheduled workout.
     */
    notes?: string | null;
    /**
     * List of exercises in the scheduled workout.
     */
    exercises?: Array<ExerciseDto> | null;
    /**
     * Status of the workout.
     * Possible values: "planned", "completed".
     */
    status?: string | null;
    /**
     * Whether this workout is visible to friends.
     */
    visibleToFriends?: boolean;
};

