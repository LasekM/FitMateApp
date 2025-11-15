import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { AuthService, OpenAPI } from "../api-generated";
import type {
  LoginRequest,
  RegisterRequest,
  RefreshRequestDto,
  AuthResponse,
} from "../api-generated";
import { toast } from "react-toastify";

interface UserClaims {
  nameid?: string;
  unique_name?: string;
  preferred_username?: string;
  email?: string;
  exp: number;
}

interface AuthContextType {
  user: UserClaims | null;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<AuthResponse>;
  register: (data: RegisterRequest) => Promise<AuthResponse>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const setupApiClient = (token: string | null) => {
  OpenAPI.TOKEN = token || undefined;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserClaims | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const setSessionData = (
    accessToken: string | null,
    refreshToken?: string | null
  ) => {
    if (accessToken && (refreshToken || localStorage.getItem("refreshToken"))) {
      localStorage.setItem("accessToken", accessToken);
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }

      setupApiClient(accessToken);

      try {
        const decoded = jwtDecode<UserClaims>(accessToken);
        setUser(decoded);
        setToken(accessToken);
      } catch (e) {
        console.error("Invalid token", e);
        setUser(null);
        setToken(null);
      }
    } else {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setupApiClient(null);
      setToken(null);
      setUser(null);
    }
  };

  useEffect(() => {
    const initializeAuth = () => {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (accessToken && refreshToken) {
        try {
          const decoded = jwtDecode<UserClaims>(accessToken);
          if (decoded.exp * 1000 > Date.now()) {
            setSessionData(accessToken, refreshToken);
          } else {
          }
        } catch (e) {
          setSessionData(null);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const setSession = (authResponse: AuthResponse | null) => {
    if (authResponse && authResponse.accessToken && authResponse.refreshToken) {
      setSessionData(authResponse.accessToken, authResponse.refreshToken);
    } else {
      setSessionData(null);
    }
  };

  const login = async (data: LoginRequest) => {
    const response = await AuthService.postApiAuthLogin({ requestBody: data });
    setSession(response);
    toast.success("Logged in successfully!");
    return response;
  };

  const register = async (data: RegisterRequest) => {
    const response = await AuthService.postApiAuthRegister({
      requestBody: data,
    });
    setSession(response);
    toast.success("Account created successfully!");
    return response;
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      try {
        await AuthService.postApiAuthLogout({ requestBody: { refreshToken } });
      } catch (e) {
        console.error("Logout API call failed, logging out locally.", e);
      }
    }
    setSessionData(null);
    window.location.href = "/login";
  };

  useEffect(() => {
    const interceptorId = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        const isApiRequest = originalRequest.url.startsWith(OpenAPI.BASE);

        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          isApiRequest
        ) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem("refreshToken");
            if (!refreshToken) throw new Error("No refresh token available");

            const refreshRequest: RefreshRequestDto = { refreshToken };

            const response = await AuthService.postApiAuthRefresh({
              requestBody: refreshRequest,
            });

            if (response.accessToken && response.refreshToken) {
              setSession(response);
              originalRequest.headers[
                "Authorization"
              ] = `Bearer ${response.accessToken}`;
              return axios(originalRequest);
            }
          } catch (refreshError) {
            console.error("Silent refresh failed, logging out.", refreshError);
            setSessionData(null);
            window.location.href = "/login";
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptorId);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
