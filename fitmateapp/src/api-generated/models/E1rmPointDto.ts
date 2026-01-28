/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Represents a data point for estimated 1-rep max over time.
 */
export type E1rmPointDto = {
    /**
     * The date of this E1RM measurement.
     */
    day?: string;
    /**
     * Estimated 1-rep max value calculated using Epley formula.
     */
    e1Rm?: number;
    /**
     * ID of the workout session where this E1RM was achieved, if applicable.
     */
    sessionId?: string | null;
};

