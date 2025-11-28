/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SetDto } from './SetDto';
/**
 * Represents an exercise within a workout plan.
 */
export type ExerciseDto = {
    name: string;
    rest?: number;
    sets?: Array<SetDto> | null;
};

