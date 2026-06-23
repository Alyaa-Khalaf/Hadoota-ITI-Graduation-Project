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
  refreshAccessToken: () => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

import { API_ORIGIN } from "@/lib/apiConfig";

const API = API_ORIGIN;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // =========================
  // Refresh Token
  // =========================
  const refreshAccessToken = useCallback(async () => {
  try {
    setIsLoading(true);

    const res = await fetch(`${API}/api/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    const data = await res.json();
    

console.log("REFRESH STATUS:", res.status);
console.log("REFRESH DATA:", data);

    if (res.ok && data?.data?.accessToken) {
      setAccessToken(data.data.accessToken);
    } else {
      setAccessToken(null);
    }
  } catch {
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
}, []);

  // =========================
  // Init
  // =========================
  useEffect(() => {
    refreshAccessToken();
  }, [refreshAccessToken]);
  

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        setAccessToken,
        refreshAccessToken,
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