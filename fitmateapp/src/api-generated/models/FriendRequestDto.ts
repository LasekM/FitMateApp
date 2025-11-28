/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Represents a friendship request between two users.
 */
export type FriendRequestDto = {
    /**
     * Unique identifier of the friendship request.
     */
    id: string;
    /**
     * ID of the user who sent the request.
     */
    fromUserId: string;
    /**
     * Username of the requester.
     */
    fromName: string;
    /**
     * ID of the user who received the request.
     */
    toUserId: string;
    /**
     * Username of the recipient.
     */
    toName: string;
    /**
     * Current status of the request.
     * Possible values: "Pending", "Accepted", "Rejected".
     */
    status: string;
    /**
     * Date and time when the request was created.
     */
    createdAtUtc: string;
    /**
     * Date and time when the request was responded to.
     */
    respondedAtUtc?: string | null;
};

