/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdherenceDto } from '../models/AdherenceDto';
import type { E1rmPointDto } from '../models/E1rmPointDto';
import type { OverviewDto } from '../models/OverviewDto';
import type { PlanVsActualItemDto } from '../models/PlanVsActualItemDto';
import type { TimePointDto } from '../models/TimePointDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AnalyticsService {
    /**
     * Pobiera ogólny przegląd statystyk (Dashboard).
     * Zwraca podsumowanie dla zadanego okresu: całkowita objętość, średnia intensywność, liczba sesji i % realizacji planu.
     *
     * **Wymagany format dat:** ISO 8601 UTC (np. `2026-11-01T00:00:00Z`).
     * @returns OverviewDto Statystyki zostały obliczone.
     * @throws ApiError
     */
    public static getApiAnalyticsOverview({
        from,
        to,
    }: {
        from: string,
        to: string,
    }): CancelablePromise<OverviewDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/analytics/overview',
            query: {
                'From': from,
                'To': to,
            },
            errors: {
                400: `Błędny zakres dat (np. To < From).`,
                401: `Użytkownik niezalogowany.`,
                403: `Forbidden`,
                404: `Resource not found.`,
                500: `Unexpected server error.`,
            },
        });
    }
    /**
     * Analiza objętości treningowej (Volume).
     * Zwraca dane wykresu objętości (Volume Load = Series * Reps * Weight).
     *
     * **Opcje grupowania (`groupBy`):**
     * * `day` – Suma objętości na każdy dzień treningowy.
     * * `week` – Suma objętości na tydzień (format ISO Week, np. "2025-W45").
     * * `exercise` – Suma objętości per ćwiczenie w całym zadanym okresie.
     *
     * **Filtrowanie:**
     * Możesz ograniczyć wynik do konkretnego ćwiczenia podając `exerciseName`.
     * @returns TimePointDto Dane objętości.
     * @throws ApiError
     */
    public static getApiAnalyticsVolume({
        from,
        to,
        groupBy,
        exerciseName,
        groupByNormalized,
    }: {
        from: string,
        to: string,
        groupBy?: string,
        exerciseName?: string,
        groupByNormalized?: string,
    }): CancelablePromise<Array<TimePointDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/analytics/volume',
            query: {
                'From': from,
                'To': to,
                'GroupBy': groupBy,
                'ExerciseName': exerciseName,
                'GroupByNormalized': groupByNormalized,
            },
            errors: {
                400: `Nieprawidłowy parametr \`groupBy\` lub zakres dat.`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Resource not found.`,
                500: `Unexpected server error.`,
            },
        });
    }
    /**
     * Historia szacowanego rekordu na 1 powtórzenie (e1RM).
     * Oblicza e1RM (Estimated 1 Rep Max) dla każdego treningu danego ćwiczenia w zadanym okresie.
     *
     * **Algorytm:**
     * Wykorzystywana jest formuła **Epleya**: `Weight * (1 + Reps / 30)`.
     *
     * **Przykład użycia:**
     *
     * GET /api/analytics/exercises/Bench%20Press/e1rm?from=...&to=...
     * @returns E1rmPointDto Historia e1RM.
     * @throws ApiError
     */
    public static getApiAnalyticsExercisesE1Rm({
        name,
        from,
        to,
    }: {
        /**
         * Nazwa ćwiczenia (np. "Bench Press").
         */
        name: string,
        from: string,
        to: string,
    }): CancelablePromise<Array<E1rmPointDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/analytics/exercises/{name}/e1rm',
            path: {
                'name': name,
            },
            query: {
                'From': from,
                'To': to,
            },
            errors: {
                400: `Nie podano nazwy ćwiczenia lub błędny zakres dat.`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Resource not found.`,
                500: `Unexpected server error.`,
            },
        });
    }
    /**
     * Statystyki konsekwencji treningowej (Adherence).
     * Porównuje liczbę zaplanowanych treningów do liczby rzeczywiście zrealizowanych (Completed) w zadanym okresie.
     *
     * **Ważne:** Parametry daty są tu typu `DateOnly` (format: `yyyy-MM-dd`), a nie DateTime UTC.
     * @returns AdherenceDto Statystyki adherence.
     * @throws ApiError
     */
    public static getApiAnalyticsAdherence({
        fromDate,
        toDate,
    }: {
        fromDate: string,
        toDate: string,
    }): CancelablePromise<AdherenceDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/analytics/adherence',
            query: {
                'FromDate': fromDate,
                'ToDate': toDate,
            },
            errors: {
                400: `Data końcowa jest wcześniejsza niż początkowa.`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Resource not found.`,
                500: `Unexpected server error.`,
            },
        });
    }
    /**
     * Porównanie Plan vs Wykonanie dla konkretnej sesji.
     * Zwraca szczegółową listę serii z danej sesji, pokazując różnice między założeniami (Planned)
     * a rzeczywistym wykonaniem (Done) dla ciężaru i powtórzeń.
     * @returns PlanVsActualItemDto Dane porównawcze.
     * @throws ApiError
     */
    public static getApiAnalyticsPlanVsActual({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<Array<PlanVsActualItemDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/analytics/plan-vs-actual',
            query: {
                'SessionId': sessionId,
            },
            errors: {
                400: `Nieprawidłowy identyfikator sesji.`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Resource not found.`,
                500: `Unexpected server error.`,
            },
        });
    }
}
