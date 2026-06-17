"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";

interface AuthContextType {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  refreshToken: () => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // =========================
  // Refresh Token
  // =========================
  const refreshToken = useCallback(async () => {
    try {
      setIsLoading(true);

      const storedRefreshToken =
        typeof window !== "undefined"
          ? localStorage.getItem("refreshToken")
          : null;

      if (!storedRefreshToken) {
        setAccessToken(null);
        return;
      }

      const res = await fetch(`${API}/api/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          refreshToken: storedRefreshToken,
        }),
      });

      const data = await res.json();

      if (res.ok && data?.data?.accessToken) {
        setAccessToken(data.data.accessToken);

        // 🔥 مهم: persist refresh token
        localStorage.setItem(
          "refreshToken",
          data.data.refreshToken
        );

        // (optional but useful)
        localStorage.setItem(
          "accessToken",
          data.data.accessToken
        );
      } else {
        setAccessToken(null);
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("accessToken");
      }
    } catch (err) {
      setAccessToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // =========================
  // Logout
  // =========================
  const logout = useCallback(async () => {
    try {
      await fetch(`${API}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {}

    setAccessToken(null);
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessToken");
  }, []);

  // =========================
  // Init
  // =========================
  useEffect(() => {
    refreshToken();
  }, [refreshToken]);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        setAccessToken,
        refreshToken,
        logout,
        isLoading,
      }}
    >
      {isLoading ? (
        <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-amber-50">
          <div className="flex gap-4 text-5xl">
            <span className="animate-bounce">🐶</span>
            <span className="animate-bounce [animation-delay:200ms]">🐱</span>
            <span className="animate-bounce [animation-delay:400ms]">🐸</span>
          </div>

          <h2 className="text-2xl font-bold text-purple-600">
            جاري التحميل...
          </h2>

          <div className="w-52 h-3 bg-gray-200 rounded overflow-hidden">
            <div className="h-full w-full bg-green-400 animate-pulse origin-left" />
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

// =========================
// Hook
// =========================
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};