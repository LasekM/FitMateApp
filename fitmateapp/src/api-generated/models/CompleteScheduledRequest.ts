/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Request to mark a scheduled workout as completed.
 */
export type CompleteScheduledRequest = {
    /**
     * Optional start time of the session. Defaults to now if not provided.
     */
    startedAtUtc?: string | null;
    /**
     * Optional completion time of the session. Defaults to now if not provided.
     */
    completedAtUtc?: string | null;
    /**
     * Optional notes for the completed session.
     */
    sessionNotes?: string | null;
    /**
     * If true, copies planned reps/weight to actual reps/weight for each set. Defaults to true.
     */
    populateActuals?: boolean;
};

