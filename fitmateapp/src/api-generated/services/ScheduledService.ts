/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateScheduledDto } from '../models/CreateScheduledDto';
import type { ScheduledDto } from '../models/ScheduledDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ScheduledService {
    /**
     * Planuje nowy trening w kalendarzu.
     * Tworzy wpis w kalendarzu na podstawie istniejącego `PlanId`.
     *
     * **Logika działania:**
     * * Jeśli lista `Exercises` jest pusta (lub null), system automatycznie skopiuje ćwiczenia z planu bazowego (`PlanId`).
     * * Jeśli przekażesz `Exercises`, nadpiszą one domyślny zestaw z planu (pozwala to modyfikować trening tylko na ten jeden dzień).
     *
     * **Formatowanie:**
     * * `Date`: Wymagany format `yyyy-MM-dd` (np. "2026-11-15").
     * * `Time`: Opcjonalny format `HH:mm` (np. "18:30").
     *
     * **Przykładowe żądanie:**
     *
     * POST /api/scheduled
     * {
         * "date": "2026-11-15",
         * "time": "18:00",
         * "planId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
         * "status": "planned",
         * "visibleToFriends": true
         * }
         * @returns ScheduledDto Trening został pomyślnie zaplanowany.
         * @throws ApiError
         */
        public static postApiScheduled({
            requestBody,
        }: {
            /**
             * Obiekt tworzenia zaplanowanego treningu.
             */
            requestBody?: CreateScheduledDto,
        }): CancelablePromise<ScheduledDto> {
            return __request(OpenAPI, {
                method: 'POST',
                url: '/api/scheduled',
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Błąd walidacji danych (np. zły format daty) lub status inny niż 'planned'/'completed'.`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Podany \`PlanId\` nie istnieje lub nie należy do użytkownika.`,
                    500: `Unexpected server error.`,
                },
            });
        }
        /**
         * Pobiera listę wszystkich zaplanowanych treningów użytkownika.
         * Zwraca pełną listę treningów (historię oraz przyszłe plany), posortowaną chronologicznie (Data -> Czas).
         * @returns ScheduledDto Lista treningów.
         * @throws ApiError
         */
        public static getApiScheduled(): CancelablePromise<Array<ScheduledDto>> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/scheduled',
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
         * Pobiera szczegóły konkretnego treningu z kalendarza.
         * @returns ScheduledDto Szczegóły treningu (wraz z ćwiczeniami i seriami).
         * @throws ApiError
         */
        public static getScheduledById({
            id,
        }: {
            /**
             * Identyfikator zaplanowanego treningu (GUID).
             */
            id: string,
        }): CancelablePromise<ScheduledDto> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/scheduled/{id}',
                path: {
                    'id': id,
                },
                errors: {
                    400: `Bad request / validation or business error.`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Trening nie istnieje lub nie należy do zalogowanego użytkownika.`,
                    500: `Unexpected server error.`,
                },
            });
        }
        /**
         * Aktualizuje istniejący trening w kalendarzu.
         * Pozwala zmienić datę, godzinę, notatki, status (np. na "completed") lub zmodyfikować listę ćwiczeń.
         *
         * **Uwaga:** Przesłanie nowej listy `Exercises` całkowicie zastępuje starą listę ćwiczeń i serii dla tego wpisu.
         * @returns ScheduledDto Zaktualizowany trening.
         * @throws ApiError
         */
        public static putApiScheduled({
            id,
            requestBody,
        }: {
            /**
             * Identyfikator edytowanego wpisu.
             */
            id: string,
            /**
             * Nowe dane treningu.
             */
            requestBody?: CreateScheduledDto,
        }): CancelablePromise<ScheduledDto> {
            return __request(OpenAPI, {
                method: 'PUT',
                url: '/api/scheduled/{id}',
                path: {
                    'id': id,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Błąd walidacji (np. format daty).`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Wpis nie istnieje lub plan bazowy (PlanId) został usunięty.`,
                    500: `Unexpected server error.`,
                },
            });
        }
        /**
         * Usuwa zaplanowany trening z kalendarza.
         * Operacja jest nieodwracalna. Usuwa wpis wraz z przypisanymi do niego seriami/ćwiczeniami (Cascade Delete).
         * @returns void
         * @throws ApiError
         */
        public static deleteApiScheduled({
            id,
        }: {
            /**
             * Identyfikator wpisu do usunięcia.
             */
            id: string,
        }): CancelablePromise<void> {
            return __request(OpenAPI, {
                method: 'DELETE',
                url: '/api/scheduled/{id}',
                path: {
                    'id': id,
                },
                errors: {
                    400: `Bad request / validation or business error.`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Wpis nie istnieje lub nie należy do użytkownika.`,
                    500: `Unexpected server error.`,
                },
            });
        }
        /**
         * Pobiera treningi zaplanowane na konkretny dzień.
         * Filtruje listę treningów po dacie.
         *
         * **Przykładowe użycie:**
         *
         * GET /api/scheduled/by-date?date=2026-10-25
         * @returns ScheduledDto Lista treningów (może być pusta).
         * @throws ApiError
         */
        public static getApiScheduledByDate({
            date,
        }: {
            /**
             * Data w formacie `yyyy-MM-dd`.
             */
            date?: string,
        }): CancelablePromise<Array<ScheduledDto>> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/scheduled/by-date',
                query: {
                    'date': date,
                },
                errors: {
                    400: `Podano datę w nieprawidłowym formacie.`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Resource not found.`,
                    500: `Unexpected server error.`,
                },
            });
        }
        /**
         * Duplikuje istniejący wpis w kalendarzu.
         * Duplikuje zaplanowany trening (taka sama data, czas i ćwiczenia), ale z nowym ID.
         * Przydatne np. gdy użytkownik chce zrobić ten sam trening dwa razy dziennie lub szybko skopiować ustawienia.
         * @returns ScheduledDto Kopia została utworzona pomyślnie.
         * @throws ApiError
         */
        public static postApiScheduledDuplicate({
            id,
        }: {
            /**
             * Identyfikator wpisu źródłowego.
             */
            id: string,
        }): CancelablePromise<ScheduledDto> {
            return __request(OpenAPI, {
                method: 'POST',
                url: '/api/scheduled/{id}/duplicate',
                path: {
                    'id': id,
                },
                errors: {
                    400: `Bad request / validation or business error.`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Wpis źródłowy nie istnieje.`,
                    500: `Unexpected server error.`,
                },
            });
        }
    }
