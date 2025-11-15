/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserDto } from '../models/UserDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UsersService {
    /**
     * @returns UserDto OK
     * @throws ApiError
     */
    public static getApiUsers({
        search,
    }: {
        search?: string,
    }): CancelablePromise<Array<UserDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/users',
            query: {
                'search': search,
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
    public static putApiUsersRole({
        id,
        roleName,
    }: {
        id: string,
        roleName?: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/users/{id}/role',
            path: {
                'id': id,
            },
            query: {
                'roleName': roleName,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }
}
