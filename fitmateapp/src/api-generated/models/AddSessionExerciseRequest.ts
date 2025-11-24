/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AddSessionSetRequest } from './AddSessionSetRequest';
export type AddSessionExerciseRequest = {
    order?: number | null;
    name: string;
    restSecPlanned?: number | null;
    sets: Array<AddSessionSetRequest>;
};

