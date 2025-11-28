/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Request to update user profile information.
 */
export type UpdateProfileRequest = {
    /**
     * New username.
     */
    userName: string;
    /**
     * New full name.
     */
    fullName?: string | null;
    /**
     * New email address.
     */
    email?: string | null;
};

