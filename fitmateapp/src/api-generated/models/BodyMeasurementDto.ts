/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Represents a body measurement record.
 */
export type BodyMeasurementDto = {
    /**
     * Unique identifier of the measurement.
     */
    id?: string;
    /**
     * Date and time when the measurement was taken.
     */
    measuredAtUtc?: string;
    /**
     * Body weight in kilograms.
     */
    weightKg?: number;
    /**
     * Height in centimeters.
     */
    heightCm?: number;
    /**
     * Calculated Body Mass Index.
     */
    bmi?: number;
    /**
     * Optional body fat percentage.
     */
    bodyFatPercentage?: number | null;
    /**
     * Optional chest circumference in centimeters.
     */
    chestCm?: number | null;
    /**
     * Optional waist circumference in centimeters.
     */
    waistCm?: number | null;
    /**
     * Optional hips circumference in centimeters.
     */
    hipsCm?: number | null;
    /**
     * Optional biceps circumference in centimeters.
     */
    bicepsCm?: number | null;
    /**
     * Optional thighs circumference in centimeters.
     */
    thighsCm?: number | null;
    /**
     * Optional notes about the measurement.
     */
    notes?: string | null;
};

