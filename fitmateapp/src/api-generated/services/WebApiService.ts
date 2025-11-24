/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class WebApiService {
    /**
     * @returns any OK
     * @throws ApiError
     */
    public static get(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/',
            errors: {
                400: `Bad request / validation or business error.`,
                401: `Unauthorized – brak lub błędny token.`,
                403: `Forbidden – brak uprawnień.`,
                404: `Resource not found.`,
                500: `Unexpected server error.`,
            },
        });
    }
    /**
     * @returns any OK
     * @throws ApiError
     */
    public static getHealthDb(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/health/db',
            errors: {
                400: `Bad request / validation or business error.`,
                401: `Unauthorized – brak lub błędny token.`,
                403: `Forbidden – brak uprawnień.`,
                404: `Resource not found.`,
                500: `Unexpected server error.`,
            },
        });
    }
}
