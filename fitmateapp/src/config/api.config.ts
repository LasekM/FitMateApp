import axios, { AxiosError } from "axios";
import { OpenAPI } from "../api-generated";

// Konfiguracja base URL
OpenAPI.BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
OpenAPI.WITH_CREDENTIALS = false; // JWT usually doesn't need withCredentials unless using cookies

// Token będzie ustawiany dynamicznie przez AuthContext
export const setAuthToken = (token: string | null) => {
  OpenAPI.TOKEN = token || undefined;
};

// Axios Interceptor - automatyczny refresh tokenów
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

// Configure the global axios instance which is used by the generated client
axios.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // Jeśli 401 i nie jest to endpoint refresh/login/register
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh") &&
      !originalRequest.url?.includes("/auth/login") &&
      !originalRequest.url?.includes("/auth/register")
    ) {
      if (isRefreshing) {
        // Czekaj na zakończenie refreshu
        return new Promise((resolve) => {
          addRefreshSubscriber((token: string) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            resolve(axios(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token");
        }

        // Call refresh endpoint
        // Note: Using axios directly to avoid circular dependency if we used AuthService
        const response = await axios.post(`${OpenAPI.BASE}/api/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        if (!accessToken || !newRefreshToken) {
            throw new Error("Invalid refresh response");
        }

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", newRefreshToken);
        setAuthToken(accessToken);

        isRefreshing = false;
        onRefreshed(accessToken);

        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        // Refresh failed - wyloguj użytkownika
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setAuthToken(null);
        
        // Redirect to login if not already there
        if (!window.location.pathname.includes("/login")) {
            window.location.href = "/login";
        }
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
