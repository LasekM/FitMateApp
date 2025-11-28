/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BodyMeasurementDto } from '../models/BodyMeasurementDto';
import type { BodyMetricsProgressDto } from '../models/BodyMetricsProgressDto';
import type { BodyMetricsStatsDto } from '../models/BodyMetricsStatsDto';
import type { CreateBodyMeasurementDto } from '../models/CreateBodyMeasurementDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class BodyMetricsService {
    /**
     * Dodaje nowy pomiar ciała.
     * Rejestruje nowy pomiar wagi, wzrostu i innych wymiarów.
     * BMI jest obliczane automatycznie na podstawie wzrostu i wagi.
     *
     * **Wymagania:**
     * * `WeightKg`: Wartość dodatnia (np. 80.5).
     * * `HeightCm`: Wartość dodatnia (np. 180).
     *
     * **Przykładowe żądanie:**
     *
     * POST /api/body-metrics
     * {
         * "weightKg": 82.5,
         * "heightCm": 178,
         * "bodyFatPercentage": 18.5,
         * "notes": "Po treningu"
         * }
         * @returns BodyMeasurementDto Pomiar został pomyślnie dodany.
         * @throws ApiError
         */
        public static postApiBodyMetrics({
            requestBody,
        }: {
            /**
             * Dane nowego pomiaru.
             */
            requestBody?: CreateBodyMeasurementDto,
        }): CancelablePromise<BodyMeasurementDto> {
            return __request(OpenAPI, {
                method: 'POST',
                url: '/api/body-metrics',
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Błąd walidacji danych.`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Resource not found.`,
                    500: `Unexpected server error.`,
                },
            });
        }
        /**
         * Pobiera historię pomiarów w zadanym zakresie dat.
         * Zwraca listę pomiarów posortowaną malejąco po dacie (najnowsze pierwsze).
         * Jeśli nie podano dat, zwraca wszystkie dostępne pomiary.
         * @returns BodyMeasurementDto Lista pomiarów (może być pusta).
         * @throws ApiError
         */
        public static getApiBodyMetrics({
            from,
            to,
        }: {
            /**
             * Data początkowa (opcjonalna).
             */
            from?: string,
            /**
             * Data końcowa (opcjonalna).
             */
            to?: string,
        }): CancelablePromise<Array<BodyMeasurementDto>> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/body-metrics',
                query: {
                    'from': from,
                    'to': to,
                },
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
         * Pobiera najnowszy zarejestrowany pomiar.
         * Przydatne do szybkiego sprawdzenia aktualnej wagi i BMI użytkownika.
         * @returns BodyMeasurementDto Najnowszy pomiar.
         * @throws ApiError
         */
        public static getApiBodyMetricsLatest(): CancelablePromise<BodyMeasurementDto> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/body-metrics/latest',
                errors: {
                    400: `Bad request / validation or business error.`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Użytkownik nie posiada żadnych pomiarów.`,
                    500: `Unexpected server error.`,
                },
            });
        }
        /**
         * Pobiera podsumowanie statystyk pomiarów.
         * Zwraca zagregowane dane, takie jak:
         * * Aktualna waga i BMI.
         * * Najwyższa i najniższa zanotowana waga.
         * * Całkowita liczba pomiarów.
         * * Kategoria BMI (np. "Normal", "Overweight").
         * @returns BodyMetricsStatsDto Statystyki pomiarów.
         * @throws ApiError
         */
        public static getApiBodyMetricsStats(): CancelablePromise<BodyMetricsStatsDto> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/body-metrics/stats',
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
         * Pobiera dane do wykresu progresji w czasie.
         * Zwraca uproszczoną listę punktów danych (data, waga, BMI) z zadanego okresu,
         * idealną do rysowania wykresów liniowych postępu.
         * @returns BodyMetricsProgressDto Dane progresji.
         * @throws ApiError
         */
        public static getApiBodyMetricsProgress({
            from,
            to,
        }: {
            /**
             * Początek okresu wykresu.
             */
            from?: string,
            /**
             * Koniec okresu wykresu.
             */
            to?: string,
        }): CancelablePromise<Array<BodyMetricsProgressDto>> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/body-metrics/progress',
                query: {
                    'from': from,
                    'to': to,
                },
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
         * Usuwa pojedynczy wpis pomiaru.
         * Trwale usuwa wskazany pomiar z historii użytkownika.
         * Operacja jest nieodwracalna.
         * @returns void
         * @throws ApiError
         */
        public static deleteApiBodyMetrics({
            id,
        }: {
            /**
             * Identyfikator pomiaru (GUID).
             */
            id: string,
        }): CancelablePromise<void> {
            return __request(OpenAPI, {
                method: 'DELETE',
                url: '/api/body-metrics/{id}',
                path: {
                    'id': id,
                },
                errors: {
                    400: `Bad request / validation or business error.`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Pomiar nie istnieje lub nie należy do użytkownika.`,
                    500: `Unexpected server error.`,
                },
            });
        }
        /**
         * Pobiera pomiary znajomego (jeśli udostępnił).
         * @returns BodyMeasurementDto OK
         * @throws ApiError
         */
        public static getApiBodyMetricsFriends({
            friendId,
        }: {
            /**
             * ID znajomego.
             */
            friendId: string,
        }): CancelablePromise<BodyMeasurementDto> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/body-metrics/friends/{friendId}',
                path: {
                    'friendId': friendId,
                },
                errors: {
                    400: `Bad request / validation or business error.`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Not Found`,
                    500: `Unexpected server error.`,
                },
            });
        }
    }
