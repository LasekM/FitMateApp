/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AbortSessionRequest } from '../models/AbortSessionRequest';
import type { AddSessionExerciseRequest } from '../models/AddSessionExerciseRequest';
import type { CompleteSessionRequest } from '../models/CompleteSessionRequest';
import type { PatchSetRequest } from '../models/PatchSetRequest';
import type { StartSessionRequest } from '../models/StartSessionRequest';
import type { WorkoutSessionDto } from '../models/WorkoutSessionDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SessionsService {
    /**
     * Rozpoczyna nową sesję treningową (Live Workout).
     * Tworzy nową sesję na podstawie zaplanowanego treningu (`ScheduledWorkout`).
     * Kopiuje wszystkie ćwiczenia i serie z planu do sesji, ustawiając jej status na `in_progress`.
     *
     * **Działanie:**
     * * Wymaga podania ID zaplanowanego treningu.
     * * Jeśli zaplanowany trening nie istnieje lub nie należy do użytkownika, zwraca 404.
     *
     * **Przykładowe żądanie:**
     *
     * POST /api/sessions/start
     * {
         * "scheduledId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
         * }
         * @returns WorkoutSessionDto Sesja została wystartowana.
         * @throws ApiError
         */
        public static postApiSessionsStart({
            requestBody,
        }: {
            /**
             * Obiekt zawierający ID zaplanowanego treningu.
             */
            requestBody?: StartSessionRequest,
        }): CancelablePromise<WorkoutSessionDto> {
            return __request(OpenAPI, {
                method: 'POST',
                url: '/api/sessions/start',
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Błąd walidacji (np. pusty GUID).`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Nie znaleziono zaplanowanego treningu.`,
                    500: `Unexpected server error.`,
                },
            });
        }
        /**
         * Częściowo aktualizuje wyniki pojedynczej serii w trakcie sesji.
         * Aktualizuje dane o wykonanej serii (powtórzenia, ciężar, RPE) w trwającej sesji.
         *
         * **Logika biznesowa:**
         * * Sesja musi być w statusie `in_progress`.
         * * Identyfikacja serii odbywa się poprzez `ExerciseOrder` (kolejność ćwiczenia) oraz `SetNumber` (numer serii).
         * * Nie musisz przesyłać wszystkich pól – metoda służy do aktualizacji "na bieżąco".
         *
         * **Przykładowe żądanie:**
         *
         * PATCH /api/sessions/{id}/set
         * {
             * "exerciseOrder": 1,
             * "setNumber": 2,
             * "repsDone": 10,
             * "weightDone": 80.5,
             * "rpe": 8,
             * "isFailure": false
             * }
             * @returns WorkoutSessionDto Seria została zaktualizowana.
             * @throws ApiError
             */
            public static patchApiSessionsSets({
                sessionId,
                setId,
                requestBody,
            }: {
                /**
                 * Identyfikator trwającej sesji.
                 */
                sessionId: string,
                /**
                 * Identyfikator serii.
                 */
                setId: string,
                /**
                 * Dane aktualizujące serię.
                 */
                requestBody?: PatchSetRequest,
            }): CancelablePromise<WorkoutSessionDto> {
                return __request(OpenAPI, {
                    method: 'PATCH',
                    url: '/api/sessions/{sessionId}/sets/{setId}',
                    path: {
                        'sessionId': sessionId,
                        'setId': setId,
                    },
                    body: requestBody,
                    mediaType: 'application/json',
                    errors: {
                        400: `Błąd walidacji (np. ujemne wartości) LUB sesja nie jest w toku (np. jest już zakończona).`,
                        401: `Unauthorized`,
                        403: `Forbidden`,
                        404: `Sesja, ćwiczenie lub seria nie została znaleziona.`,
                        500: `Unexpected server error.`,
                    },
                });
            }
            /**
             * Dodaje dodatkowe ćwiczenie do trwającej sesji (Ad-Hoc).
             * Pozwala dodać niezaplanowane wcześniej ćwiczenie do aktywnej sesji.
             *
             * **Zasady:**
             * * Ćwiczenie jest dodawane tylko do tej konkretnej sesji (nie zmienia planu treningowego).
             * * Jeśli nie podasz `Order`, ćwiczenie zostanie dodane na koniec listy.
             * * Wymagane jest zdefiniowanie przynajmniej jednej serii.
             *
             * **Przykładowe żądanie:**
             *
             * POST /api/sessions/{id}/exercises
             * {
                 * "name": "Dodatkowe Pompki",
                 * "restSecPlanned": 60,
                 * "sets": [
                     * { "repsPlanned": 15, "weightPlanned": 0 }
                     * ]
                     * }
                     * @returns WorkoutSessionDto Ćwiczenie dodane pomyślnie.
                     * @throws ApiError
                     */
                    public static postApiSessionsExercises({
                        id,
                        requestBody,
                    }: {
                        /**
                         * Identyfikator sesji.
                         */
                        id: string,
                        /**
                         * Definicja nowego ćwiczenia.
                         */
                        requestBody?: AddSessionExerciseRequest,
                    }): CancelablePromise<WorkoutSessionDto> {
                        return __request(OpenAPI, {
                            method: 'POST',
                            url: '/api/sessions/{id}/exercises',
                            path: {
                                'id': id,
                            },
                            body: requestBody,
                            mediaType: 'application/json',
                            errors: {
                                400: `Błąd walidacji lub sesja nie jest w toku.`,
                                401: `Unauthorized`,
                                403: `Forbidden`,
                                404: `Sesja nie istnieje.`,
                                500: `Unexpected server error.`,
                            },
                        });
                    }
                    /**
                     * Kończy sesję treningową (Success).
                     * Zmienia status sesji na `completed`, wylicza czas trwania i oznacza powiązany plan w kalendarzu jako wykonany.
                     * Po wykonaniu tej operacji nie można już modyfikować serii ani dodawać ćwiczeń.
                     *
                     * **Opcjonalne parametry:**
                     * * `CompletedAtUtc`: Czas zakończenia (domyślnie `DateTime.UtcNow`).
                     * * `SessionNotes`: Notatka końcowa do treningu.
                     * @returns WorkoutSessionDto Sesja zakończona pomyślnie.
                     * @throws ApiError
                     */
                    public static postApiSessionsComplete({
                        id,
                        requestBody,
                    }: {
                        /**
                         * Identyfikator sesji.
                         */
                        id: string,
                        /**
                         * Opcjonalne dane kończące sesję.
                         */
                        requestBody?: CompleteSessionRequest,
                    }): CancelablePromise<WorkoutSessionDto> {
                        return __request(OpenAPI, {
                            method: 'POST',
                            url: '/api/sessions/{id}/complete',
                            path: {
                                'id': id,
                            },
                            body: requestBody,
                            mediaType: 'application/json',
                            errors: {
                                400: `Próba zakończenia sesji, która nie jest w toku.`,
                                401: `Unauthorized`,
                                403: `Forbidden`,
                                404: `Sesja nie istnieje.`,
                                500: `Unexpected server error.`,
                            },
                        });
                    }
                    /**
                     * Przerywa/Anuluje sesję treningową.
                     * Zmienia status sesji na `aborted`. Używane, gdy użytkownik musi nagle przerwać trening (np. kontuzja, brak czasu).
                     * @returns WorkoutSessionDto Sesja została anulowana.
                     * @throws ApiError
                     */
                    public static postApiSessionsAbort({
                        id,
                        requestBody,
                    }: {
                        /**
                         * Identyfikator sesji.
                         */
                        id: string,
                        /**
                         * Powód przerwania sesji.
                         */
                        requestBody?: AbortSessionRequest,
                    }): CancelablePromise<WorkoutSessionDto> {
                        return __request(OpenAPI, {
                            method: 'POST',
                            url: '/api/sessions/{id}/abort',
                            path: {
                                'id': id,
                            },
                            body: requestBody,
                            mediaType: 'application/json',
                            errors: {
                                400: `Próba anulowania sesji, która nie jest w toku.`,
                                401: `Unauthorized`,
                                403: `Forbidden`,
                                404: `Sesja nie istnieje.`,
                                500: `Unexpected server error.`,
                            },
                        });
                    }
                    /**
                     * Pobiera szczegóły sesji treningowej.
                     * Zwraca pełny stan sesji: status, czasy, listę ćwiczeń oraz stan wszystkich serii.
                     * @returns WorkoutSessionDto Szczegóły sesji.
                     * @throws ApiError
                     */
                    public static getApiSessions({
                        id,
                    }: {
                        /**
                         * Identyfikator sesji.
                         */
                        id: string,
                    }): CancelablePromise<WorkoutSessionDto> {
                        return __request(OpenAPI, {
                            method: 'GET',
                            url: '/api/sessions/{id}',
                            path: {
                                'id': id,
                            },
                            errors: {
                                400: `Bad request / validation or business error.`,
                                401: `Unauthorized`,
                                403: `Forbidden`,
                                404: `Sesja nie istnieje.`,
                                500: `Unexpected server error.`,
                            },
                        });
                    }
                    /**
                     * Pobiera historię sesji w zadanym przedziale czasu.
                     * Służy do wyświetlania historii treningów lub statystyk.
                     * Daty powinny być przekazane w formacie ISO 8601 (UTC).
                     *
                     * **Przykładowe zapytanie:**
                     *
                     * GET /api/sessions/by-range?fromUtc=2026-11-01T00:00:00Z&toUtc=2026-11-30T23:59:59Z
                     * @returns WorkoutSessionDto Lista sesji.
                     * @throws ApiError
                     */
                    public static getApiSessionsByRange({
                        fromUtc,
                        toUtc,
                    }: {
                        fromUtc: string,
                        toUtc: string,
                    }): CancelablePromise<Array<WorkoutSessionDto>> {
                        return __request(OpenAPI, {
                            method: 'GET',
                            url: '/api/sessions/by-range',
                            query: {
                                'FromUtc': fromUtc,
                                'ToUtc': toUtc,
                            },
                            errors: {
                                400: `Nieprawidłowy zakres dat (np. To < From).`,
                                401: `Unauthorized`,
                                403: `Forbidden`,
                                404: `Resource not found.`,
                                500: `Unexpected server error.`,
                            },
                        });
                    }
                }
