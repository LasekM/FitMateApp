/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateScheduledDto } from '../models/CreateScheduledDto';
import type { ScheduledDto } from '../models/ScheduledDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ScheduledService {
    /**
     * Get all scheduled workouts
     * @returns ScheduledDto List of scheduled workouts
     * @throws ApiError
     */
    public static getScheduled(): CancelablePromise<Array<ScheduledDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/scheduled',
        });
    }
    /**
     * Create a scheduled workout
     * @returns ScheduledDto Created scheduled workout
     * @throws ApiError
     */
    public static createScheduled({
        requestBody,
    }: {
        requestBody: CreateScheduledDto,
    }): CancelablePromise<ScheduledDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/scheduled',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
