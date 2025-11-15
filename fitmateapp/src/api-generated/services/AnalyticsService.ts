/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdherenceDto } from '../models/AdherenceDto';
import type { E1rmPointDto } from '../models/E1rmPointDto';
import type { OverviewDto } from '../models/OverviewDto';
import type { PlanVsActualItemDto } from '../models/PlanVsActualItemDto';
import type { TimePointDto } from '../models/TimePointDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AnalyticsService {
    /**
     * @returns OverviewDto OK
     * @throws ApiError
     */
    public static getApiAnalyticsOverview({
        from,
        to,
    }: {
        from?: string,
        to?: string,
    }): CancelablePromise<OverviewDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/analytics/overview',
            query: {
                'from': from,
                'to': to,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }
    /**
     * @returns TimePointDto OK
     * @throws ApiError
     */
    public static getApiAnalyticsVolume({
        from,
        to,
        groupBy = 'day',
        exerciseName,
    }: {
        from?: string,
        to?: string,
        groupBy?: string,
        exerciseName?: string,
    }): CancelablePromise<Array<TimePointDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/analytics/volume',
            query: {
                'from': from,
                'to': to,
                'groupBy': groupBy,
                'exerciseName': exerciseName,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }
    /**
     * @returns E1rmPointDto OK
     * @throws ApiError
     */
    public static getApiAnalyticsExercisesE1Rm({
        name,
        from,
        to,
    }: {
        name: string,
        from?: string,
        to?: string,
    }): CancelablePromise<Array<E1rmPointDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/analytics/exercises/{name}/e1rm',
            path: {
                'name': name,
            },
            query: {
                'from': from,
                'to': to,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }
    /**
     * @returns AdherenceDto OK
     * @throws ApiError
     */
    public static getApiAnalyticsAdherence({
        fromDate,
        toDate,
    }: {
        fromDate?: string,
        toDate?: string,
    }): CancelablePromise<AdherenceDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/analytics/adherence',
            query: {
                'fromDate': fromDate,
                'toDate': toDate,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }
    /**
     * @returns PlanVsActualItemDto OK
     * @throws ApiError
     */
    public static getApiAnalyticsPlanVsActual({
        sessionId,
    }: {
        sessionId?: string,
    }): CancelablePromise<Array<PlanVsActualItemDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/analytics/plan-vs-actual',
            query: {
                'sessionId': sessionId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }
}
