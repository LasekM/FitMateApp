/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Represents a data point for volume over time.
 */
export type TimePointDto = {
    /**
     * The time period for this data point (e.g., "2024-01-15" for day, "2024-W03" for week).
     */
    period?: string | null;
    /**
     * The volume value for this period.
     */
    value?: number;
    /**
     * Name of the exercise if grouped by exercise, otherwise null.
     */
    exerciseName?: string | null;
};

