/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Represents a set performed during a workout session.
 */
export type SessionSetDto = {
    id?: string;
    setNumber?: number;
    repsPlanned?: number;
    weightPlanned?: number;
    repsDone?: number | null;
    weightDone?: number | null;
    rpe?: number | null;
    isFailure?: boolean | null;
};

