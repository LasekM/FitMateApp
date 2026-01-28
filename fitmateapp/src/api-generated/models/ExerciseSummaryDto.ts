/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Represents a summary of an exercise performed by the user.
 */
export type ExerciseSummaryDto = {
    /**
     * Name of the exercise.
     */
    name?: string | null;
    /**
     * Number of workout sessions containing this exercise.
     */
    workoutCount?: number;
    /**
     * First time this exercise was performed (UTC).
     */
    firstPerformedUtc?: string;
    /**
     * Most recent time this exercise was performed (UTC).
     */
    lastPerformedUtc?: string;
};

