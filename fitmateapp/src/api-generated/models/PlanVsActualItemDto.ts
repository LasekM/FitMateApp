/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Represents a comparison between planned and actual performance for an exercise.
 */
export type PlanVsActualItemDto = {
    /**
     * Name of the exercise.
     */
    exerciseName?: string | null;
    /**
     * Set number within the exercise.
     */
    setNumber?: number;
    /**
     * Number of reps planned for this set.
     */
    repsPlanned?: number;
    /**
     * Weight planned for this set.
     */
    weightPlanned?: number;
    /**
     * Number of reps actually completed, or null if not performed.
     */
    repsDone?: number | null;
    /**
     * Weight actually used, or null if not performed.
     */
    weightDone?: number | null;
    /**
     * Rate of Perceived Exertion (RPE) for this set, if recorded.
     */
    rpe?: number | null;
    /**
     * Indicates whether this set was performed to failure.
     */
    isFailure?: boolean | null;
    /**
     * Indicates whether this set was an extra set not in the original plan.
     */
    isExtra?: boolean;
    /**
     * Difference between actual and planned reps (RepsDone - RepsPlanned).
     */
    readonly repsDiff?: number;
    /**
     * Difference between actual and planned weight (WeightDone - WeightPlanned).
     */
    readonly weightDiff?: number;
};

