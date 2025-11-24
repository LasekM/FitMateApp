/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FriendScheduledWorkoutDto } from '../models/FriendScheduledWorkoutDto';
import type { FriendWorkoutSessionDto } from '../models/FriendWorkoutSessionDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class FriendsWorkoutsService {
    /**
     * Pobiera kalendarz treningowy znajomych w zadanym przedziale dat.
     * Zwraca listę zaplanowanych treningów (Scheduled Workouts) należących do Twoich znajomych.
     *
     * **Zasady filtrowania:**
     * * Uwzględniani są tylko znajomi ze statusem relacji `Accepted`.
     * * Trening musi mieć ustawioną flagę `IsVisibleToFriends = true`.
     * * Przedział dat jest domknięty (włącznie z `from` i `to`).
     *
     * **Wymagany format daty:** `yyyy-MM-dd`
     *
     * **Przykładowe zapytanie:**
     *
     * GET /api/friends/workouts/scheduled?from=2026-11-01&to=2026-11-30
     * @returns FriendScheduledWorkoutDto Pobrano listę treningów.
     * @throws ApiError
     */
    public static getApiFriendsWorkoutsScheduled({
        from,
        to,
    }: {
        from: string,
        to: string,
    }): CancelablePromise<Array<FriendScheduledWorkoutDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/friends/workouts/scheduled',
            query: {
                'From': from,
                'To': to,
            },
            errors: {
                400: `Niepoprawny format daty lub błąd logiczny (np. data "Do" jest wcześniejsza niż "Od").`,
                401: `Użytkownik niezalogowany.`,
                403: `Forbidden`,
                404: `Resource not found.`,
                500: `Unexpected server error.`,
            },
        });
    }
    /**
     * Pobiera historię sesji treningowych znajomych w zadanym przedziale czasu.
     * Zwraca listę sesji (rozpoczętych/zakończonych treningów) Twoich znajomych.
     *
     * **Zasady filtrowania:**
     * * Zakres dotyczy daty rozpoczęcia sesji (`StartedAtUtc`).
     * * Zwracane są sesje powiązane z zaplanowanymi treningami, które są publiczne dla znajomych.
     * * Przedział czasu jest lewostronnie domknięty: `start >= fromUtc` oraz `start < toUtc`.
     *
     * **Wymagany format:** ISO 8601 UTC (np. `2026-11-01T15:30:00Z`).
     *
     * **Przykładowe zapytanie:**
     *
     * GET /api/friends/workouts/sessions?fromUtc=2026-11-01T00:00:00Z&toUtc=2026-11-02T00:00:00Z
     * @returns FriendWorkoutSessionDto Pobrano listę sesji.
     * @throws ApiError
     */
    public static getApiFriendsWorkoutsSessions({
        fromUtc,
        toUtc,
    }: {
        fromUtc: string,
        toUtc: string,
    }): CancelablePromise<Array<FriendWorkoutSessionDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/friends/workouts/sessions',
            query: {
                'FromUtc': fromUtc,
                'ToUtc': toUtc,
            },
            errors: {
                400: `Niepoprawny format ISO 8601 lub data końcowa jest wcześniejsza niż początkowa.`,
                401: `Użytkownik niezalogowany.`,
                403: `Forbidden`,
                404: `Resource not found.`,
                500: `Unexpected server error.`,
            },
        });
    }
}
