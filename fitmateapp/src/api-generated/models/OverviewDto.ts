/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Represents an overview of workout statistics.
 */
export type OverviewDto = {
    /**
     * Total volume (weight × reps) across all sessions.
     */
    totalVolume?: number;
    /**
     * Average intensity of workouts.
     */
    avgIntensity?: number;
    /**
     * Total number of workout sessions.
     */
    sessionsCount?: number;
    /**
     * Adherence percentage (completed workouts / planned workouts × 100).
     */
    adherencePct?: number;
    /**
     * Number of new personal records achieved.
     */
    newPrs?: number;
};

