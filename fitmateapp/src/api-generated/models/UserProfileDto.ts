/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Represents the profile of a user.
 */
export type UserProfileDto = {
    /**
     * Unique identifier of the user.
     */
    id?: string;
    /**
     * Unique username.
     */
    userName?: string | null;
    /**
     * Full name of the user.
     */
    fullName?: string | null;
    /**
     * Email address of the user.
     */
    email?: string | null;
    /**
     * List of roles assigned to the user.
     */
    roles?: Array<string> | null;
    /**
     * Target weight goal in kilograms.
     */
    targetWeightKg?: number | null;
    /**
     * Whether biometric data is shared with friends.
     */
    shareBiometricsWithFriends?: boolean;
};

