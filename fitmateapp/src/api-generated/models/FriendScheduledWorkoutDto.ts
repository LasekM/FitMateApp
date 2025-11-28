/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Represents a scheduled workout from a friend's timeline.
 */
export type FriendScheduledWorkoutDto = {
    /**
     * Unique identifier of the scheduled workout.
     */
    scheduledId?: string;
    /**
     * ID of the friend user who owns this workout.
     */
    userId?: string;
    /**
     * Username of the friend.
     */
    userName?: string | null;
    /**
     * Full name of the friend.
     */
    fullName?: string | null;
    /**
     * Date of the scheduled workout.
     */
    date?: string;
    /**
     * Optional time of the workout.
     */
    time?: string | null;
    /**
     * Name of the workout plan.
     */
    planName?: string | null;
    /**
     * Status of the workout.
     * Possible values: "planned", "completed".
     */
    status?: string | null;
};

