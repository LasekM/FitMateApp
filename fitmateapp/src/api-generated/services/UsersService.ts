/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateUserDto } from '../models/CreateUserDto';
import type { ResetPasswordDto } from '../models/ResetPasswordDto';
import type { UpdateUserDto } from '../models/UpdateUserDto';
import type { UserDto } from '../models/UserDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UsersService {
    /**
     * Pobiera listę wszystkich użytkowników.
     * Pozwala na filtrowanie wyników. Wyszukiwanie jest "case-insensitive" (niewrażliwe na wielkość liter).
     *
     * **Przykładowe żądanie:**
     *
     * GET /api/users?search=kowalski
     * @returns UserDto Zwraca listę użytkowników (pustą, jeśli nie znaleziono pasujących).
     * @throws ApiError
     */
    public static getApiUsers({
        search,
    }: {
        /**
         * (Opcjonalne) Fraza filtrująca. Przeszukuje pola: `FullName`, `Email` oraz `UserName`.
         */
        search?: string,
    }): CancelablePromise<Array<UserDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/users',
            query: {
                'search': search,
            },
            errors: {
                400: `Bad request / validation or business error.`,
                401: `Brak autoryzacji lub niewystarczające uprawnienia (wymagana rola Admin).`,
                403: `Forbidden`,
                404: `Resource not found.`,
                500: `Unexpected server error.`,
            },
        });
    }
    /**
     * Tworzy nowego użytkownika (ręcznie przez Admina).
     * Umożliwia administratorowi dodanie użytkownika z pominięciem procesu rejestracji publicznej.
     *
     * **Przykładowe żądanie:**
     *
     * POST /api/users
     * {
         * "fullName": "Nowy Pracownik",
         * "email": "pracownik@firma.com",
         * "userName": "nowy_pracownik"
         * }
         *
         * **Uwaga:** Hasło nie jest ustawiane w tym kroku (lub jest puste/domyślne, zależnie od logiki encji),
         * administrator powinien użyć endpointu resetowania hasła lub użytkownik powinien skorzystać z procesu "Zapomniałem hasła".
         * @returns UserDto Użytkownik został utworzony pomyślnie.
         * @throws ApiError
         */
        public static postApiUsers({
            requestBody,
        }: {
            /**
             * Dane nowego użytkownika.
             */
            requestBody?: CreateUserDto,
        }): CancelablePromise<UserDto> {
            return __request(OpenAPI, {
                method: 'POST',
                url: '/api/users',
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Błąd walidacji danych lub konflikt biznesowy (np. zajęty email/login).
                    Szczegóły błędu znajdują się w ciele odpowiedzi (ProblemDetails).`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Resource not found.`,
                    500: `Unexpected server error.`,
                },
            });
        }
        /**
         * Aktualizuje dane istniejącego użytkownika.
         * Pozwala zmienić nazwę wyświetlaną, email lub nazwę użytkownika.
         *
         * **Przykładowe żądanie:**
         *
         * PUT /api/users/3fa85f64-5717-4562-b3fc-2c963f66afa6
         * {
             * "fullName": "Zaktualizowany Jan",
             * "email": "nowy.email@firma.com",
             * "userName": "jan.nowy"
             * }
             * @returns void
             * @throws ApiError
             */
            public static putApiUsers({
                id,
                requestBody,
            }: {
                /**
                 * Identyfikator użytkownika (GUID).
                 */
                id: string,
                /**
                 * Zmienione dane.
                 */
                requestBody?: UpdateUserDto,
            }): CancelablePromise<void> {
                return __request(OpenAPI, {
                    method: 'PUT',
                    url: '/api/users/{id}',
                    path: {
                        'id': id,
                    },
                    body: requestBody,
                    mediaType: 'application/json',
                    errors: {
                        400: `Błąd walidacji lub konflikt (np. nowy email jest już zajęty).`,
                        401: `Unauthorized`,
                        403: `Forbidden`,
                        404: `Użytkownik o podanym ID nie istnieje.`,
                        500: `Unexpected server error.`,
                    },
                });
            }
            /**
             * Usuwa użytkownika z systemu.
             * **Ważne:** Nie można usunąć użytkownika posiadającego rolę `Admin` ze względów bezpieczeństwa.
             * @returns void
             * @throws ApiError
             */
            public static deleteApiUsers({
                id,
            }: {
                /**
                 * Identyfikator użytkownika do usunięcia.
                 */
                id: string,
            }): CancelablePromise<void> {
                return __request(OpenAPI, {
                    method: 'DELETE',
                    url: '/api/users/{id}',
                    path: {
                        'id': id,
                    },
                    errors: {
                        400: `Próba usunięcia administratora (operacja zabroniona).`,
                        401: `Unauthorized`,
                        403: `Forbidden`,
                        404: `Użytkownik nie istnieje.`,
                        500: `Unexpected server error.`,
                    },
                });
            }
            /**
             * Przypisuje rolę systemową do użytkownika.
             * Służy do nadawania uprawnień (np. awans na Admina).
             *
             * **Przykładowe użycie:**
             *
             * PUT /api/users/{id}/role?roleName=Admin
             * @returns void
             * @throws ApiError
             */
            public static putApiUsersRole({
                id,
                roleName,
            }: {
                /**
                 * Identyfikator użytkownika.
                 */
                id: string,
                /**
                 * Nazwa roli (np. `Admin`, `User`). Wielkość liter ma znaczenie.
                 */
                roleName?: string,
            }): CancelablePromise<void> {
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
                        400: `Podano nieprawidłową nazwę roli (lub rola nie istnieje w bazie).`,
                        401: `Unauthorized`,
                        403: `Forbidden`,
                        404: `Nie znaleziono użytkownika o podanym ID.`,
                        409: `Konflikt – użytkownik posiada już przypisaną tę rolę.`,
                        500: `Unexpected server error.`,
                    },
                });
            }
            /**
             * Resetuje hasło użytkownika (wymuszenie zmiany).
             * Administrator ustawia nowe hasło dla wskazanego użytkownika. Stare hasło zostaje nadpisane nowym hashem.
             *
             * **Przykładowe żądanie:**
             *
             * POST /api/users/{id}/reset-password
             * {
                 * "newPassword": "SuperTajneHaslo123!"
                 * }
                 * @returns void
                 * @throws ApiError
                 */
                public static postApiUsersResetPassword({
                    id,
                    requestBody,
                }: {
                    /**
                     * Identyfikator użytkownika.
                     */
                    id: string,
                    /**
                     * Obiekt zawierający nowe hasło (minimum 8 znaków).
                     */
                    requestBody?: ResetPasswordDto,
                }): CancelablePromise<void> {
                    return __request(OpenAPI, {
                        method: 'POST',
                        url: '/api/users/{id}/reset-password',
                        path: {
                            'id': id,
                        },
                        body: requestBody,
                        mediaType: 'application/json',
                        errors: {
                            400: `Hasło nie spełnia wymagań walidacji (np. za krótkie).`,
                            401: `Unauthorized`,
                            403: `Forbidden`,
                            404: `Użytkownik nie istnieje.`,
                            500: `Unexpected server error.`,
                        },
                    });
                }
            }
