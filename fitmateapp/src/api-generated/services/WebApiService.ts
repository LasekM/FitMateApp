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
        });
    }
}
