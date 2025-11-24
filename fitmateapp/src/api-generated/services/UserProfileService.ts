/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChangePasswordRequest } from '../models/ChangePasswordRequest';
import type { UpdateProfileRequest } from '../models/UpdateProfileRequest';
import type { UserProfileDto } from '../models/UserProfileDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserProfileService {
    /**
     * Pobiera dane profilowe zalogowanego użytkownika.
     * Zwraca podstawowe informacje o koncie (ID, login, email, imię i nazwisko) oraz listę przypisanych ról.
     * Identyfikacja użytkownika odbywa się na podstawie tokena JWT (Claims).
     * @returns UserProfileDto Zwraca dane profilowe.
     * @throws ApiError
     */
    public static getApiUserprofile(): CancelablePromise<UserProfileDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/userprofile',
            errors: {
                400: `Bad request / validation or business error.`,
                401: `Użytkownik niezalogowany (brak lub nieważny token).`,
                403: `Forbidden`,
                404: `Nie znaleziono użytkownika w bazie (np. konto usunięte, a token jeszcze ważny).`,
                500: `Unexpected server error.`,
            },
        });
    }
    /**
     * Aktualizuje dane profilowe (Imię, Email, Login).
     * Pozwala użytkownikowi na samodzielną edycję swoich danych.
     *
     * **Przykładowe żądanie:**
     *
     * PUT /api/userprofile
     * {
         * "userName": "nowy_nick",
         * "fullName": "Jan Kowalski",
         * "email": "jan.kowalski@example.com"
         * }
         *
         * **Zasady walidacji:**
         * * `UserName`: Unikalny w systemie, bez spacji.
         * * `Email`: Unikalny w systemie, poprawny format.
         * @returns UserProfileDto Dane zostały zaktualizowane.
         * @throws ApiError
         */
        public static putApiUserprofile({
            requestBody,
        }: {
            /**
             * Obiekt z nowymi danymi.
             */
            requestBody?: UpdateProfileRequest,
        }): CancelablePromise<UserProfileDto> {
            return __request(OpenAPI, {
                method: 'PUT',
                url: '/api/userprofile',
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Błąd walidacji lub konflikt danych.
                    Możliwe komunikaty:
                     * "This username is already taken."
                     * "This email is already in use."
                     * "UserName cannot contain spaces."`,
                    401: `Użytkownik niezalogowany.`,
                    403: `Forbidden`,
                    404: `Resource not found.`,
                    500: `Unexpected server error.`,
                },
            });
        }
        /**
         * Zmienia hasło zalogowanego użytkownika.
         * Wymaga podania aktualnego hasła w celu weryfikacji tożsamości.
         *
         * **Przykładowe żądanie:**
         *
         * POST /api/userprofile/change-password
         * {
             * "currentPassword": "StareHaslo123!",
             * "newPassword": "NoweSuperHaslo1!",
             * "confirmPassword": "NoweSuperHaslo1!"
             * }
             *
             * **Wymagania nowego hasła:**
             * * Minimum 8 znaków.
             * * Przynajmniej jedna litera i jedna cyfra.
             * * `ConfirmPassword` musi być identyczne jak `NewPassword`.
             * @returns void
             * @throws ApiError
             */
            public static postApiUserprofileChangePassword({
                requestBody,
            }: {
                /**
                 * Dane do zmiany hasła.
                 */
                requestBody?: ChangePasswordRequest,
            }): CancelablePromise<void> {
                return __request(OpenAPI, {
                    method: 'POST',
                    url: '/api/userprofile/change-password',
                    body: requestBody,
                    mediaType: 'application/json',
                    errors: {
                        400: `Błąd walidacji (np. hasło za słabe) lub nieprawidłowe stare hasło.
                        Komunikat: "Current password is incorrect."`,
                        401: `Użytkownik niezalogowany.`,
                        403: `Forbidden`,
                        404: `Resource not found.`,
                        500: `Unexpected server error.`,
                    },
                });
            }
        }
