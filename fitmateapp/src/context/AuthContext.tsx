import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { AuthService } from "../api-generated";
import type { LoginRequest, RegisterRequest, AuthResponse } from "../api-generated";
import { setAuthToken } from "../config/api.config";

interface JwtPayload {
  sub?: string;
  id?: string;
  email?: string;
  [key: string]: any;
}

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (credentials: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Inicjalizacja - sprawdź czy user ma już token w localStorage
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        const userId = decoded.sub || decoded.id || "";
        const userEmail = decoded.email || "";

        if (userId) {
          setUser({ id: userId, email: userEmail });
          setAuthToken(token);
        } else {
          // Token jest invalid
          logout();
        }
      } catch (error) {
        console.error("Invalid token on init:", error);
        logout();
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginRequest) => {
    const response = await AuthService.postApiAuthLogin({ requestBody: credentials });
    handleAuthResponse(response);
  };

  const register = async (credentials: RegisterRequest) => {
    const response = await AuthService.postApiAuthRegister({ requestBody: credentials });
    handleAuthResponse(response);
  };

  const handleAuthResponse = (response: AuthResponse) => {
    if (!response.accessToken || !response.refreshToken) {
      throw new Error("Invalid auth response");
    }

    localStorage.setItem("accessToken", response.accessToken);
    localStorage.setItem("refreshToken", response.refreshToken);
    setAuthToken(response.accessToken);

    const decoded = jwtDecode<JwtPayload>(response.accessToken);
    setUser({
      id: decoded.sub || decoded.id || "",
      email: decoded.email || "",
    });
  };

  const logout = () => {
    const refreshToken = localStorage.getItem("refreshToken");
    
    // Opcjonalnie wywołaj endpoint logout (best practice)
    if (refreshToken) {
      AuthService.postApiAuthLogout({ requestBody: { refreshToken } }).catch((err) =>
        console.error("Logout API call failed:", err)
      );
    }

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setAuthToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
