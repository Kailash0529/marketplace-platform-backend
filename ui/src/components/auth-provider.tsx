'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { api, ApiEnvelope, setAccessToken } from "../../lib/api";

interface AuthContextValue {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshTokenId: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    fullName?: string,
    phone?: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
}

interface LoginData {
  accessToken: string;
  expiresIn: number;
  refreshTokenId: string;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const ACCESS_TOKEN_KEY = "marketplace_access_token";
const REFRESH_TOKEN_KEY = "marketplace_refresh_token_id";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessTokenState, setAccessTokenState] = useState<string | null>(null);
  const [refreshTokenIdState, setRefreshTokenIdState] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedAccess = window.localStorage.getItem(ACCESS_TOKEN_KEY);
    const storedRefresh = window.localStorage.getItem(REFRESH_TOKEN_KEY);
    if (storedAccess) {
      setAccessTokenState(storedAccess);
      setAccessToken(storedAccess);
    }
    if (storedRefresh) {
      setRefreshTokenIdState(storedRefresh);
    }
  }, []);

  const applyTokens = useCallback((token: string, refreshTokenId: string) => {
    setAccessTokenState(token);
    setRefreshTokenIdState(refreshTokenId);
    setAccessToken(token);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
      window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshTokenId);
    }
  }, []);

  const clearTokens = useCallback(() => {
    setAccessTokenState(null);
    setRefreshTokenIdState(null);
    setAccessToken(null);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(ACCESS_TOKEN_KEY);
      window.localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const response = await api.post<ApiEnvelope<LoginData>>("/auth/login", {
        email,
        password,
      });
      if (!response.success || !response.data) {
        throw new Error(response.message || "Login failed");
      }
      applyTokens(response.data.accessToken, response.data.refreshTokenId);
    },
    [applyTokens],
  );

  const register = useCallback(
    async (
      email: string,
      password: string,
      fullName?: string,
      phone?: string,
    ) => {
      const body: Record<string, unknown> = { email, password };
      if (fullName) body.fullName = fullName;
      if (phone) body.phone = phone;

      const response = await api.post<ApiEnvelope<Record<string, unknown>>>(
        "/auth/register",
        body,
      );
      if (!response.success) {
        throw new Error(response.message || "Registration failed");
      }
      await login(email, password);
    },
    [login],
  );

  const logout = useCallback(async () => {
    if (refreshTokenIdState) {
      try {
        await api.post<ApiEnvelope<null>>("/auth/logout", {
          refreshTokenId: refreshTokenIdState,
        });
      } catch {
        // ignore logout errors
      }
    }
    clearTokens();
  }, [clearTokens, refreshTokenIdState]);

  const value: AuthContextValue = {
    isAuthenticated: !!accessTokenState,
    accessToken: accessTokenState,
    refreshTokenId: refreshTokenIdState,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}

