/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FriendDto } from '../models/FriendDto';
import type { FriendRequestDto } from '../models/FriendRequestDto';
import type { RespondFriendRequest } from '../models/RespondFriendRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class FriendsService {
    /**
     * @returns any OK
     * @throws ApiError
     */
    public static postApiFriends({
        username,
    }: {
        username: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/friends/{username}',
            path: {
                'username': username,
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
    public static postApiFriendsRequestsRespond({
        requestId,
        requestBody,
    }: {
        requestId: string,
        requestBody?: RespondFriendRequest,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/friends/requests/{requestId}/respond',
            path: {
                'requestId': requestId,
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
     * @returns FriendDto OK
     * @throws ApiError
     */
    public static getApiFriends(): CancelablePromise<Array<FriendDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/friends',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }
    /**
     * @returns FriendRequestDto OK
     * @throws ApiError
     */
    public static getApiFriendsRequestsIncoming(): CancelablePromise<Array<FriendRequestDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/friends/requests/incoming',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }
    /**
     * @returns FriendRequestDto OK
     * @throws ApiError
     */
    public static getApiFriendsRequestsOutgoing(): CancelablePromise<Array<FriendRequestDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/friends/requests/outgoing',
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
    public static deleteApiFriends({
        friendUserId,
    }: {
        friendUserId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/friends/{friendUserId}',
            path: {
                'friendUserId': friendUserId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }
}
