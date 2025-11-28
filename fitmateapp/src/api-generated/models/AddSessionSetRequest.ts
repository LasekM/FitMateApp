/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Request to add a set to a session exercise.
 */
export type AddSessionSetRequest = {
    /**
     * Set number (1-based).
     */
    setNumber?: number | null;
    /**
     * Planned number of repetitions.
     */
    repsPlanned?: number;
    /**
     * Planned weight.
     */
    weightPlanned?: number;
};

