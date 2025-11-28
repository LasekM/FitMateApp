/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SessionSetDto } from './SessionSetDto';
/**
 * Represents an exercise performed during a workout session.
 */
export type SessionExerciseDto = {
    id?: string;
    order?: number;
    name?: string | null;
    restSecPlanned?: number;
    restSecActual?: number | null;
    sets?: Array<SessionSetDto> | null;
};

