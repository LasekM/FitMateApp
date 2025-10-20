/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreatePlanDto } from '../models/CreatePlanDto';
import type { PlanDto } from '../models/PlanDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PlansService {
    /**
     * Get all plans
     * @returns PlanDto List of plans
     * @throws ApiError
     */
    public static getPlans(): CancelablePromise<Array<PlanDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/plans',
        });
    }
    /**
     * Create a plan
     * @returns PlanDto Created plan
     * @throws ApiError
     */
    public static createPlan({
        requestBody,
    }: {
        requestBody: CreatePlanDto,
    }): CancelablePromise<PlanDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/plans',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get a plan by ID
     * @returns PlanDto Plan found
     * @throws ApiError
     */
    public static getPlans1({
        id,
    }: {
        id: string,
    }): CancelablePromise<PlanDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/plans/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Update a plan
     * @returns PlanDto Updated plan
     * @throws ApiError
     */
    public static putPlans({
        id,
        requestBody,
    }: {
        id: string,
        requestBody: CreatePlanDto,
    }): CancelablePromise<PlanDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/plans/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete a plan
     * @returns void
     * @throws ApiError
     */
    public static deletePlans({
        id,
    }: {
        id: string,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/plans/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Duplicate a plan
     * @returns PlanDto Duplicated plan
     * @throws ApiError
     */
    public static postPlansDuplicate({
        id,
    }: {
        id: string,
    }): CancelablePromise<PlanDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/plans/{id}/duplicate',
            path: {
                'id': id,
            },
        });
    }
}
