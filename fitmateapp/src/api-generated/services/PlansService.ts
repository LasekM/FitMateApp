/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreatePlanDto } from '../models/CreatePlanDto';
import type { PlanDto } from '../models/PlanDto';
import type { RespondSharedPlanRequest } from '../models/RespondSharedPlanRequest';
import type { SharedPlanDto } from '../models/SharedPlanDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PlansService {
    /**
     * Tworzy nowy plan treningowy.
     * Tworzy plan z listą ćwiczeń i serii, przypisując go do aktualnie zalogowanego użytkownika.
     *
     * **Ograniczenia walidacji:**
     * * `PlanName`: 3-100 znaków.
     * * `Type`: 2-50 znaków (np. "Split", "FBW").
     * * `Exercises`: Max 100 ćwiczeń w planie.
     * * `Sets`: Max 50 serii na ćwiczenie.
     *
     * **Przykładowe żądanie:**
     *
     * POST /api/plans
     * {
         * "planName": "Mój Plan Siłowy",
         * "type": "Push Pull",
         * "notes": "Trening 4x w tygodniu",
         * "exercises": [
             * {
                 * "name": "Wyciskanie sztangi",
                 * "rest": 120,
                 * "sets": [
                     * { "reps": 8, "weight": 80 },
                     * { "reps": 8, "weight": 80 }
                     * ]
                     * }
                     * ]
                     * }
                     * @returns PlanDto Plan został pomyślnie utworzony.
                     * @throws ApiError
                     */
                    public static postApiPlans({
                        requestBody,
                    }: {
                        /**
                         * Kompletny obiekt planu wraz z ćwiczeniami.
                         */
                        requestBody?: CreatePlanDto,
                    }): CancelablePromise<PlanDto> {
                        return __request(OpenAPI, {
                            method: 'POST',
                            url: '/api/plans',
                            body: requestBody,
                            mediaType: 'application/json',
                            errors: {
                                400: `Błąd walidacji danych wejściowych (np. pusta nazwa, brak ćwiczeń).`,
                                401: `Unauthorized`,
                                403: `Forbidden`,
                                404: `Resource not found.`,
                                500: `Unexpected server error.`,
                            },
                        });
                    }
                    /**
                     * Pobiera listę planów użytkownika.
                     * Zwraca plany stworzone przez zalogowanego użytkownika. Opcjonalnie może zwrócić również plany,
                     * które inni użytkownicy udostępnili Tobie (i które zaakceptowałeś).
                     * @returns PlanDto Lista planów.
                     * @throws ApiError
                     */
                    public static getApiPlans({
                        includeShared = false,
                    }: {
                        /**
                         * Jeśli `true`, lista zawiera również plany udostępnione (status `Accepted`).
                         * Domyślnie `false` (tylko własne).
                         */
                        includeShared?: boolean,
                    }): CancelablePromise<Array<PlanDto>> {
                        return __request(OpenAPI, {
                            method: 'GET',
                            url: '/api/plans',
                            query: {
                                'includeShared': includeShared,
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
                     * Pobiera szczegóły konkretnego planu.
                     * Zwraca pełną strukturę planu (ćwiczenia, serie).
                     * Dostępne tylko dla właściciela planu.
                     * @returns PlanDto Szczegóły planu.
                     * @throws ApiError
                     */
                    public static getApiPlans1({
                        id,
                    }: {
                        /**
                         * Identyfikator planu (GUID).
                         */
                        id: string,
                    }): CancelablePromise<PlanDto> {
                        return __request(OpenAPI, {
                            method: 'GET',
                            url: '/api/plans/{id}',
                            path: {
                                'id': id,
                            },
                            errors: {
                                400: `Bad request / validation or business error.`,
                                401: `Unauthorized`,
                                403: `Forbidden`,
                                404: `Plan nie istnieje lub nie masz do niego dostępu.`,
                                500: `Unexpected server error.`,
                            },
                        });
                    }
                    /**
                     * Aktualizuje istniejący plan.
                     * Nadpisuje dane planu (nazwę, notatki, typ) oraz **wymienia całą listę ćwiczeń** na nową.
                     * Stare ćwiczenia i serie w tym planie są usuwane i zastępowane tymi z żądania.
                     * @returns PlanDto Plan zaktualizowany pomyślnie.
                     * @throws ApiError
                     */
                    public static putApiPlans({
                        id,
                        requestBody,
                    }: {
                        /**
                         * Identyfikator edytowanego planu.
                         */
                        id: string,
                        /**
                         * Nowa definicja planu.
                         */
                        requestBody?: CreatePlanDto,
                    }): CancelablePromise<PlanDto> {
                        return __request(OpenAPI, {
                            method: 'PUT',
                            url: '/api/plans/{id}',
                            path: {
                                'id': id,
                            },
                            body: requestBody,
                            mediaType: 'application/json',
                            errors: {
                                400: `Błąd walidacji.`,
                                401: `Unauthorized`,
                                403: `Forbidden`,
                                404: `Plan nie istnieje lub nie jest Twój.`,
                                500: `Unexpected server error.`,
                            },
                        });
                    }
                    /**
                     * Usuwa plan treningowy.
                     * Trwale usuwa plan wraz ze wszystkimi ćwiczeniami i seriami.
                     * @returns void
                     * @throws ApiError
                     */
                    public static deleteApiPlans({
                        id,
                    }: {
                        /**
                         * Identyfikator planu.
                         */
                        id: string,
                    }): CancelablePromise<void> {
                        return __request(OpenAPI, {
                            method: 'DELETE',
                            url: '/api/plans/{id}',
                            path: {
                                'id': id,
                            },
                            errors: {
                                400: `Bad request / validation or business error.`,
                                401: `Unauthorized`,
                                403: `Forbidden`,
                                404: `Plan nie istnieje lub nie jest Twój.`,
                                500: `Unexpected server error.`,
                            },
                        });
                    }
                    /**
                     * Duplikuje (kopiuje) istniejący plan.
                     * Tworzy głęboką kopię planu (wraz z ćwiczeniami i seriami), dodając do nazwy dopisek "(Copy)".
                     * Nowy plan staje się własnością użytkownika wykonującego akcję.
                     * @returns PlanDto Kopia planu została utworzona.
                     * @throws ApiError
                     */
                    public static postApiPlansDuplicate({
                        id,
                    }: {
                        /**
                         * Identyfikator planu źródłowego.
                         */
                        id: string,
                    }): CancelablePromise<PlanDto> {
                        return __request(OpenAPI, {
                            method: 'POST',
                            url: '/api/plans/{id}/duplicate',
                            path: {
                                'id': id,
                            },
                            errors: {
                                400: `Bad request / validation or business error.`,
                                401: `Unauthorized`,
                                403: `Forbidden`,
                                404: `Plan źródłowy nie istnieje.`,
                                500: `Unexpected server error.`,
                            },
                        });
                    }
                    /**
                     * Udostępnia plan innemu użytkownikowi.
                     * Wysyła zaproszenie do współdzielenia planu. Odbiorca zobaczy je w sekcji "Pending" i będzie mógł je zaakceptować.
                     *
                     * **Ograniczenia:**
                     * * Nie możesz udostępnić planu samemu sobie.
                     * * Nie możesz udostępnić planu, który nie należy do Ciebie.
                     * * Jeśli plan jest już udostępniony tej osobie (nawet w statusie Pending), operacja zwróci błąd.
                     * @returns any Zaproszenie do udostępnienia zostało wysłane.
                     * @throws ApiError
                     */
                    public static postApiPlansShareTo({
                        planId,
                        targetUserId,
                    }: {
                        /**
                         * Identyfikator Twojego planu.
                         */
                        planId: string,
                        /**
                         * Identyfikator użytkownika (GUID), któremu chcesz pokazać plan.
                         */
                        targetUserId: string,
                    }): CancelablePromise<any> {
                        return __request(OpenAPI, {
                            method: 'POST',
                            url: '/api/plans/{planId}/share-to/{targetUserId}',
                            path: {
                                'planId': planId,
                                'targetUserId': targetUserId,
                            },
                            errors: {
                                400: `Błąd biznesowy (np. już udostępniono, target == user).`,
                                401: `Unauthorized`,
                                403: `Forbidden`,
                                404: `Nie znaleziono planu lub użytkownika docelowego.`,
                                500: `Unexpected server error.`,
                            },
                        });
                    }
                    /**
                     * Pobiera listę planów udostępnionych MI przez innych (status Accepted).
                     * Są to "cudze" plany, do których użytkownik uzyskał dostęp i je zaakceptował.
                     * @returns PlanDto Lista planów.
                     * @throws ApiError
                     */
                    public static getApiPlansSharedWithMe(): CancelablePromise<Array<PlanDto>> {
                        return __request(OpenAPI, {
                            method: 'GET',
                            url: '/api/plans/shared-with-me',
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
                     * Pobiera otrzymane zaproszenia do planów (Oczekujące).
                     * Lista udostępnień skierowanych do Ciebie, które mają status `Pending` (czekają na decyzję).
                     * @returns SharedPlanDto Lista oczekujących udostępnień (Przychodzące).
                     * @throws ApiError
                     */
                    public static getApiPlansSharedPending(): CancelablePromise<Array<SharedPlanDto>> {
                        return __request(OpenAPI, {
                            method: 'GET',
                            url: '/api/plans/shared/pending',
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
                     * Pobiera wysłane zaproszenia do planów (Oczekujące).
                     * Lista udostępnień, które Ty wysłałeś innym, ale oni jeszcze nie podjęli decyzji (status `Pending`).
                     * @returns SharedPlanDto Lista oczekujących udostępnień (Wychodzące).
                     * @throws ApiError
                     */
                    public static getApiPlansSharedSentPending(): CancelablePromise<Array<SharedPlanDto>> {
                        return __request(OpenAPI, {
                            method: 'GET',
                            url: '/api/plans/shared/sent/pending',
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
                     * Decyzja o przyjęciu lub odrzuceniu udostępnionego planu.
                     * Pozwala zmienić status zaproszenia z `Pending` na `Accepted` lub `Rejected`.
                     *
                     * **Przykład ciała żądania:**
                     *
                     * { "accept": true }
                     * @returns any Status zaktualizowany.
                     * @throws ApiError
                     */
                    public static postApiPlansSharedRespond({
                        sharedPlanId,
                        requestBody,
                    }: {
                        /**
                         * Identyfikator wpisu udostępnienia (SharedPlan ID).
                         */
                        sharedPlanId: string,
                        /**
                         * Obiekt decyzyjny.
                         */
                        requestBody?: RespondSharedPlanRequest,
                    }): CancelablePromise<any> {
                        return __request(OpenAPI, {
                            method: 'POST',
                            url: '/api/plans/shared/{sharedPlanId}/respond',
                            path: {
                                'sharedPlanId': sharedPlanId,
                            },
                            body: requestBody,
                            mediaType: 'application/json',
                            errors: {
                                400: `Zaproszenie nie jest już w statusie Pending.`,
                                401: `Unauthorized`,
                                403: `Forbidden`,
                                404: `Nie znaleziono zaproszenia.`,
                                500: `Unexpected server error.`,
                            },
                        });
                    }
                    /**
                     * Historia udostępnień (Zakończone).
                     * Zwraca historię udostępnień, które zostały już rozpatrzone (status `Accepted` lub `Rejected`).
                     * Plany w statusie `Pending` są pomijane (do tego służą osobne endpointy).
                     *
                     * **Parametr scope:**
                     * * `received` (domyślny) – Plany otrzymane od innych.
                     * * `sent` – Plany wysłane przez Ciebie innym.
                     * * `all` – Wszystkie powiązane z Tobą.
                     * @returns SharedPlanDto OK
                     * @throws ApiError
                     */
                    public static getApiPlansSharedHistory({
                        scope,
                    }: {
                        /**
                         * Zakres historii: `received`, `sent`, `all`.
                         */
                        scope?: string,
                    }): CancelablePromise<Array<SharedPlanDto>> {
                        return __request(OpenAPI, {
                            method: 'GET',
                            url: '/api/plans/shared/history',
                            query: {
                                'scope': scope,
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
                     * Usuwa lub anuluje udostępnienie planu.
                     * Pozwala wycofać udostępnienie (jeśli jesteś nadawcą) lub usunąć plan z listy "Udostępnione mi" (jeśli jesteś odbiorcą).
                     *
                     * **Tryb onlyPending:**
                     * * Jeśli `true`: Usuwa wpis TYLKO jeśli jest w statusie `Pending` (anulowanie zaproszenia).
                     * * Jeśli `false` (domyślnie): Usuwa wpis bez względu na status (np. odebranie dostępu po czasie).
                     * @returns void
                     * @throws ApiError
                     */
                    public static deleteApiPlansShared({
                        sharedPlanId,
                        onlyPending = false,
                    }: {
                        /**
                         * Identyfikator wpisu udostępnienia.
                         */
                        sharedPlanId: string,
                        /**
                         * Czy ograniczyć usuwanie tylko do oczekujących zaproszeń.
                         */
                        onlyPending?: boolean,
                    }): CancelablePromise<void> {
                        return __request(OpenAPI, {
                            method: 'DELETE',
                            url: '/api/plans/shared/{sharedPlanId}',
                            path: {
                                'sharedPlanId': sharedPlanId,
                            },
                            query: {
                                'onlyPending': onlyPending,
                            },
                            errors: {
                                400: `Błąd logiczny (np. wymuszono onlyPending, a status był Accepted).`,
                                401: `Unauthorized`,
                                403: `Forbidden`,
                                404: `Nie znaleziono wpisu udostępnienia.`,
                                500: `Unexpected server error.`,
                            },
                        });
                    }
                    /**
                     * Usuwa udostępniony plan na podstawie ID planu (wygodne dla frontendu).
                     * Usuwa wpis udostępnienia (SharedPlan) dla zalogowanego użytkownika na podstawie ID planu.
                     * Działa to analogicznie do usunięcia przez ID udostępnienia, ale pozwala frontendowi użyć ID planu, który już zna.
                     * @returns void
                     * @throws ApiError
                     */
                    public static deleteApiPlansSharedByPlan({
                        planId,
                    }: {
                        /**
                         * Identyfikator planu (nie SharedPlanId).
                         */
                        planId: string,
                    }): CancelablePromise<void> {
                        return __request(OpenAPI, {
                            method: 'DELETE',
                            url: '/api/plans/shared/by-plan/{planId}',
                            path: {
                                'planId': planId,
                            },
                            errors: {
                                400: `Bad request / validation or business error.`,
                                401: `Unauthorized`,
                                403: `Forbidden`,
                                404: `Nie znaleziono wpisu udostępnienia dla tego planu.`,
                                500: `Unexpected server error.`,
                            },
                        });
                    }
                }
