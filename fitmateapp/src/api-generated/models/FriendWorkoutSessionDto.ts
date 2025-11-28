/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Represents a workout session from a friend's timeline.
 */
export type FriendWorkoutSessionDto = {
    /**
     * Unique identifier of the workout session.
     */
    sessionId?: string;
    /**
     * ID of the scheduled workout this session is based on.
     */
    scheduledId?: string;
    /**
     * ID of the friend user who performed this session.
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
     * Name of the workout plan.
     */
    planName?: string | null;
    /**
     * Start time of the session in UTC.
     */
    startedAtUtc?: string;
    /**
     * Completion time of the session in UTC (if completed).
     */
    completedAtUtc?: string | null;
    /**
     * Duration of the session in seconds.
     */
    durationSec?: number | null;
    /**
     * Status of the session.
     * Possible values: "in_progress", "completed", "aborted".
     */
    status?: string | null;
};

