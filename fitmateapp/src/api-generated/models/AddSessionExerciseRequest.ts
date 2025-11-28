/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AddSessionSetRequest } from './AddSessionSetRequest';
/**
 * Request to add a new exercise to an active workout session.
 */
export type AddSessionExerciseRequest = {
    /**
     * Order of the exercise in the session.
     */
    order?: number | null;
    /**
     * Name of the exercise.
     */
    name: string;
    /**
     * Planned rest time in seconds.
     */
    restSecPlanned?: number | null;
    /**
     * List of sets to add for this exercise.
     */
    sets: Array<AddSessionSetRequest>;
};

