/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Represents adherence statistics.
 */
export type AdherenceDto = {
    /**
     * Number of planned workouts in the period.
     */
    planned?: number;
    /**
     * Number of completed workouts in the period.
     */
    completed?: number;
    /**
     * Number of missed workouts (Planned - Completed).
     */
    readonly missed?: number;
    /**
     * Adherence percentage (Completed / Planned × 100), rounded to 1 decimal place.
     */
    readonly adherencePct?: number;
};

