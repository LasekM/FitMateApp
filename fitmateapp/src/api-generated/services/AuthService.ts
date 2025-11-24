/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AuthResponse } from '../models/AuthResponse';
import type { LoginRequest } from '../models/LoginRequest';
import type { LogoutRequestDto } from '../models/LogoutRequestDto';
import type { RefreshRequestDto } from '../models/RefreshRequestDto';
import type { RegisterRequest } from '../models/RegisterRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthService {
    /**
     * Rejestracja nowego konta użytkownika.
     * Tworzy nowego użytkownika w systemie, przypisuje mu domyślną rolę i automatycznie loguje, zwracając tokeny.
     *
     * **Przykładowe żądanie:**
     *
     * POST /api/auth/register
     * {
         * "email": "jan.kowalski@example.com",
         * "username": "jankowal",
         * "password": "TrudneHaslo123!",
         * "fullName": "Jan Kowalski"
         * }
         *
         * **Logika biznesowa:**
         * * Email i UserName muszą być unikalne.
         * * Hasło jest hashowane przed zapisem (BCrypt).
         * @returns AuthResponse Rejestracja przebiegła pomyślnie, zwrócono tokeny.
         * @throws ApiError
         */
        public static postApiAuthRegister({
            requestBody,
        }: {
            /**
             * Obiekt DTO zawierający wymagane dane rejestracyjne.
             */
            requestBody?: RegisterRequest,
        }): CancelablePromise<AuthResponse> {
            return __request(OpenAPI, {
                method: 'POST',
                url: '/api/auth/register',
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Błąd walidacji lub danych biznesowych.
                    Możliwe przyczyny (zwracane w polu \`detail\` struktury ProblemDetails):
                     * "Email already registered."
                     * "Username already registered."`,
                    401: `Unauthorized – brak lub błędny token.`,
                    403: `Forbidden – brak uprawnień.`,
                    404: `Resource not found.`,
                    500: `Unexpected server error.`,
                },
            });
        }
        /**
         * Logowanie użytkownika.
         * Weryfikuje poświadczenia i generuje nowe tokeny dostępowe.
         *
         * **Przykładowe żądanie:**
         *
         * POST /api/auth/login
         * {
             * "userNameOrEmail": "jankowal",
             * "password": "TrudneHaslo123!"
             * }
             *
             * Uwaga: Pole `userNameOrEmail` akceptuje zarówno login jak i adres e-mail.
             * @returns AuthResponse Logowanie poprawne.
             * @throws ApiError
             */
            public static postApiAuthLogin({
                requestBody,
            }: {
                /**
                 * Dane logowania (Login/Email + Hasło).
                 */
                requestBody?: LoginRequest,
            }): CancelablePromise<AuthResponse> {
                return __request(OpenAPI, {
                    method: 'POST',
                    url: '/api/auth/login',
                    body: requestBody,
                    mediaType: 'application/json',
                    errors: {
                        400: `Błędne dane logowania.
                        Zwracany komunikat: "Invalid credentials."`,
                        401: `Unauthorized – brak lub błędny token.`,
                        403: `Forbidden – brak uprawnień.`,
                        404: `Resource not found.`,
                        500: `Unexpected server error.`,
                    },
                });
            }
            /**
             * Odświeżanie tokena dostępowego (Refresh Token Flow).
             * Pozwala uzyskać nowy `accessToken` bez konieczności ponownego logowania, używając ważnego `refreshToken`.
             *
             * **Przykładowe żądanie:**
             *
             * POST /api/auth/refresh
             * {
                 * "refreshToken": "8a7b...123z"
                 * }
                 * @returns AuthResponse Token został pomyślnie odświeżony.
                 * @throws ApiError
                 */
                public static postApiAuthRefresh({
                    requestBody,
                }: {
                    /**
                     * Obiekt DTO zawierający token odświeżania.
                     */
                    requestBody?: RefreshRequestDto,
                }): CancelablePromise<AuthResponse> {
                    return __request(OpenAPI, {
                        method: 'POST',
                        url: '/api/auth/refresh',
                        body: requestBody,
                        mediaType: 'application/json',
                        errors: {
                            400: `Przesłany refresh token jest nieprawidłowy, wygasł lub został unieważniony.
                            Komunikat: "Invalid refresh token."`,
                            401: `Unauthorized – brak lub błędny token.`,
                            403: `Forbidden – brak uprawnień.`,
                            404: `Resource not found.`,
                            500: `Unexpected server error.`,
                        },
                    });
                }
                /**
                 * Wylogowanie (Unieważnienie Refresh Tokena).
                 * Usuwa wskazany `refreshToken` z bazy danych, zapobiegając jego dalszemu użyciu do generowania nowych tokenów dostępowych.
                 * Operacja jest idempotentna – jeśli token nie istnieje, endpoint również zwraca 204.
                 *
                 * **Wymagania:**
                 * * Użytkownik musi być zalogowany (wymagany nagłówek `Authorization: Bearer ...`).
                 * @returns void
                 * @throws ApiError
                 */
                public static postApiAuthLogout({
                    requestBody,
                }: {
                    /**
                     * Obiekt zawierający token do unieważnienia.
                     */
                    requestBody?: LogoutRequestDto,
                }): CancelablePromise<void> {
                    return __request(OpenAPI, {
                        method: 'POST',
                        url: '/api/auth/logout',
                        body: requestBody,
                        mediaType: 'application/json',
                        errors: {
                            400: `Bad request / validation or business error.`,
                            401: `Brak ważnego tokena dostępowego w nagłówku (użytkownik niezalogowany).`,
                            403: `Forbidden`,
                            404: `Resource not found.`,
                            500: `Unexpected server error.`,
                        },
                    });
                }
            }
