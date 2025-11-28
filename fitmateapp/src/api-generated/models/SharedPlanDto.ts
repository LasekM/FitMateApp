/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Represents a workout plan shared between users.
 */
export type SharedPlanDto = {
    /**
     * Unique identifier of the shared plan record.
     */
    id?: string;
    /**
     * ID of the plan being shared.
     */
    planId?: string;
    /**
     * Name of the plan.
     */
    planName?: string | null;
    /**
     * Name of the user who shared the plan.
     */
    sharedByName?: string | null;
    /**
     * Name of the user with whom the plan is shared.
     */
    sharedWithName?: string | null;
    /**
     * Date and time when the plan was shared.
     */
    sharedAtUtc?: string;
    /**
     * Status of the shared plan.
     * Possible values: "Pending", "Accepted", "Rejected".
     */
    status?: string | null;
    /**
     * Date and time when the recipient responded to the share request.
     */
    respondedAtUtc?: string | null;
};

