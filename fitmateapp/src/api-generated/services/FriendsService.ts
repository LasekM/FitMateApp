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
     * Wysyła zaproszenie do znajomych (po nazwie użytkownika).
     * **Logika biznesowa:**
     * * Nie można wysłać zaproszenia do samego siebie.
     * * Jeśli użytkownicy są już znajomymi, zwrócony zostanie błąd.
     * * **Auto-akceptacja:** Jeśli użytkownik, do którego wysyłasz zaproszenie, wcześniej wysłał zaproszenie do Ciebie (status Pending),
     * system wykryje to i automatycznie nawiąże relację (status Accepted).
     *
     * **Przykładowe żądanie:**
     *
     * POST /api/friends/jankowalski
     * @returns any Zaproszenie wysłane pomyślnie LUB relacja została automatycznie zaakceptowana (gdy istniało zaproszenie zwrotne).
     * @throws ApiError
     */
    public static postApiFriends({
        username,
    }: {
        /**
         * Unikalna nazwa użytkownika (UserName) adresata.
         */
        username: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/friends/{username}',
            path: {
                'username': username,
            },
            errors: {
                400: `Błąd walidacji logicznej. Przykładowe komunikaty błędów:
                 * "You cannot add yourself."
                 * "You are already friends."
                 * "A friend request is already in progress." (gdy już wysłałeś wcześniej zaproszenie).`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Nie znaleziono użytkownika o podanej nazwie.`,
                500: `Unexpected server error.`,
            },
        });
    }
    /**
     * Odpowiada na otrzymane zaproszenie (Akceptacja / Odrzucenie).
     * Pozwala zaakceptować lub odrzucić oczekujące zaproszenie.
     * Można odpowiadać tylko na zaproszenia, w których jest się adresatem (`ToUserId`).
     *
     * **Przykładowe żądanie (Akceptacja):**
     *
     * POST /api/friends/requests/3fa85f64-5717-4562-b3fc-2c963f66afa6/respond
     * {
         * "accept": true
         * }
         * @returns any Decyzja została zapisana (znajomość nawiązana lub zaproszenie odrzucone).
         * @throws ApiError
         */
        public static postApiFriendsRequestsRespond({
            requestId,
            requestBody,
        }: {
            /**
             * Identyfikator zaproszenia (GUID).
             */
            requestId: string,
            /**
             * Obiekt decyzyjny (Accept = true/false).
             */
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
                    400: `Zaproszenie nie jest w stanie "Pending" lub próbujesz odpowiedzieć na własne zaproszenie.`,
                    401: `Próba odpowiedzi na zaproszenie, które nie jest skierowane do Ciebie.`,
                    403: `Forbidden`,
                    404: `Zaproszenie nie istnieje.`,
                    500: `Unexpected server error.`,
                },
            });
        }
        /**
         * Pobiera listę aktualnych znajomych.
         * Zwraca listę użytkowników, z którymi relacja ma status `Accepted`.
         * @returns FriendDto Lista znajomych.
         * @throws ApiError
         */
        public static getApiFriends(): CancelablePromise<Array<FriendDto>> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/friends',
                errors: {
                    400: `Bad request / validation or business error.`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Resource not found.`,
                    500: `Unexpected server error.`,
                },
            });
        }
        /**
         * Pobiera listę oczekujących zaproszeń przychodzących.
         * Są to zaproszenia wysłane przez inne osoby do aktualnie zalogowanego użytkownika.
         * @returns FriendRequestDto Lista zaproszeń do rozpatrzenia.
         * @throws ApiError
         */
        public static getApiFriendsRequestsIncoming(): CancelablePromise<Array<FriendRequestDto>> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/friends/requests/incoming',
                errors: {
                    400: `Bad request / validation or business error.`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Resource not found.`,
                    500: `Unexpected server error.`,
                },
            });
        }
        /**
         * Pobiera listę wysłanych zaproszeń (wychodzących).
         * Są to zaproszenia wysłane przez Ciebie, które wciąż oczekują na decyzję drugiej strony (status `Pending`).
         * @returns FriendRequestDto Lista wysłanych, oczekujących zaproszeń.
         * @throws ApiError
         */
        public static getApiFriendsRequestsOutgoing(): CancelablePromise<Array<FriendRequestDto>> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/friends/requests/outgoing',
                errors: {
                    400: `Bad request / validation or business error.`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Resource not found.`,
                    500: `Unexpected server error.`,
                },
            });
        }
        /**
         * Usuwa użytkownika z listy znajomych.
         * Trwale usuwa relację znajomości (status `Accepted`). Operacja jest dwustronna – użytkownik znika również z listy znajomych drugiej osoby.
         * @returns void
         * @throws ApiError
         */
        public static deleteApiFriends({
            friendUserId,
        }: {
            /**
             * Identyfikator użytkownika (GUID), którego chcemy usunąć.
             */
            friendUserId: string,
        }): CancelablePromise<void> {
            return __request(OpenAPI, {
                method: 'DELETE',
                url: '/api/friends/{friendUserId}',
                path: {
                    'friendUserId': friendUserId,
                },
                errors: {
                    400: `Bad request / validation or business error.`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Taka relacja nie istnieje (nie jesteście znajomymi).`,
                    500: `Unexpected server error.`,
                },
            });
        }
    }
