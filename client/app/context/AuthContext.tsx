"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback,} from "react";

interface AuthContextType {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  refreshToken: () => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // =========================
  // Refresh Token Function
  // =========================
 // =========================
  // Refresh Token Function (نسخة الفحص)
  // =========================
  const refreshToken = useCallback(async () => {
    try {
      setIsLoading(true);
      const storedRefreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
      if (!storedRefreshToken) {
        setAccessToken(null);
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/auth/refresh`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken: storedRefreshToken }),
        }
      );

      const data = await res.json();

      if (res.ok && data?.data?.accessToken) {
        setAccessToken(data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);
      } else {
        setAccessToken(null);
        localStorage.removeItem('refreshToken');
      }
    } catch (err) {
      setAccessToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // =========================
  // Logout Function
  // =========================
  const logout = useCallback(async () => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      setAccessToken(null);
    }
  }, []);

  // =========================
  // Run on App Start
  // =========================
  useEffect(() => {
    refreshToken();
  }, [refreshToken]);

  // =========================
  // Loading Screen
  // =========================
 if (isLoading) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-amber-50">
      <div className="flex gap-4 text-5xl">
        <span className="animate-bounce">🐶</span>
        <span className="[animation-delay:200ms] animate-bounce">🐱</span>
        <span className="[animation-delay:400ms] animate-bounce">🐸</span>
      </div>

      <h2 className="text-2xl font-bold text-purple-600">
        Loading...
      </h2>

      <div className="w-52 h-3 rounded-full bg-gray-200 overflow-hidden">
        <div className="h-full w-full origin-left animate-pulse bg-green-400" />
      </div>
    </div>
  );
}

 // =========================
  // Loading Screen (تعديل ذكي)
  // =========================
  
  // بدل ما نقفل الأبلكيشن كله، هنخلي الـ Provider شغال دايماً
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
      {/* لو لسه بيحمل لأول مرة والموقع محتاج يتأكد من التوكن، بنعرض شاشة اللودنج هنا بس */}
      {isLoading ? (
        <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-amber-50">
          <div className="flex gap-4 text-5xl">
            <span className="animate-bounce">🐶</span>
            <span className="[animation-delay:200ms] animate-bounce">🐱</span>
            <span className="[animation-delay:400ms] animate-bounce">🐸</span>
          </div>

          <h2 className="text-2xl font-bold text-purple-600">
            جاري التحميل...
          </h2>

          <div className="w-52 h-3 rounded-full bg-gray-200 overflow-hidden">
            <div className="h-full w-full origin-left animate-pulse bg-green-400" />
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