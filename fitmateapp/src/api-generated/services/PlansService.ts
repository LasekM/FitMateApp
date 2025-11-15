/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreatePlanDto } from '../models/CreatePlanDto';
import type { PlanDto } from '../models/PlanDto';
import type { RespondSharedPlanRequest } from '../models/RespondSharedPlanRequest';
import type { SharedPlanDto } from '../models/SharedPlanDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PlansService {
    /**
     * @returns any OK
     * @throws ApiError
     */
    public static postApiPlans({
        requestBody,
    }: {
        requestBody?: CreatePlanDto,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/plans',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }
    /**
     * @returns any OK
     * @throws ApiError
     */
    public static getApiPlans(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/plans',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }
    /**
     * @returns any OK
     * @throws ApiError
     */
    public static getApiPlans1({
        id,
    }: {
        id: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/plans/{id}',
            path: {
                'id': id,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }
    /**
     * @returns any OK
     * @throws ApiError
     */
    public static putApiPlans({
        id,
        requestBody,
    }: {
        id: string,
        requestBody?: CreatePlanDto,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/plans/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }
    /**
     * @returns any OK
     * @throws ApiError
     */
    public static deleteApiPlans({
        id,
    }: {
        id: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/plans/{id}',
            path: {
                'id': id,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }
    /**
     * @returns any OK
     * @throws ApiError
     */
    public static postApiPlansDuplicate({
        id,
    }: {
        id: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/plans/{id}/duplicate',
            path: {
                'id': id,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }
    /**
     * @returns any OK
     * @throws ApiError
     */
    public static postApiPlansShareTo({
        planId,
        targetUserId,
    }: {
        planId: string,
        targetUserId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/plans/{planId}/share-to/{targetUserId}',
            path: {
                'planId': planId,
                'targetUserId': targetUserId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }
    /**
     * @returns PlanDto OK
     * @throws ApiError
     */
    public static getApiPlansSharedWithMe(): CancelablePromise<Array<PlanDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/plans/shared-with-me',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }
    /**
     * @returns SharedPlanDto OK
     * @throws ApiError
     */
    public static getApiPlansSharedPending(): CancelablePromise<Array<SharedPlanDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/plans/shared/pending',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }
    /**
     * @returns any OK
     * @throws ApiError
     */
    public static postApiPlansSharedRespond({
        sharedPlanId,
        requestBody,
    }: {
        sharedPlanId: string,
        requestBody?: RespondSharedPlanRequest,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/plans/shared/{sharedPlanId}/respond',
            path: {
                'sharedPlanId': sharedPlanId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }
    /**
     * @returns SharedPlanDto OK
     * @throws ApiError
     */
    public static getApiPlansSharedHistory(): CancelablePromise<Array<SharedPlanDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/plans/shared/history',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }
    /**
     * @returns any OK
     * @throws ApiError
     */
    public static deleteApiPlansShared({
        sharedPlanId,
    }: {
        sharedPlanId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/plans/shared/{sharedPlanId}',
            path: {
                'sharedPlanId': sharedPlanId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }
}
