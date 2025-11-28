/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Request to change user password.
 */
export type ChangePasswordRequest = {
    /**
     * Current password for verification.
     */
    currentPassword: string;
    /**
     * New password.
     */
    newPassword: string;
    /**
     * Confirmation of the new password.
     */
    confirmPassword: string;
};

