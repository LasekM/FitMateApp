/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Statistics summary of body metrics.
 */
export type BodyMetricsStatsDto = {
    /**
     * Current weight in kilograms.
     */
    currentWeightKg?: number | null;
    /**
     * Current Body Mass Index.
     */
    currentBMI?: number | null;
    /**
     * BMI category (Underweight, Normal, Overweight, Obese).
     */
    bmiCategory?: string | null;
    /**
     * Weight change in the last 30 days.
     */
    weightChangeLast30Days?: number | null;
    /**
     * Lowest recorded weight.
     */
    lowestWeight?: number | null;
    /**
     * Highest recorded weight.
     */
    highestWeight?: number | null;
    /**
     * Total number of measurements recorded.
     */
    totalMeasurements?: number;
};

