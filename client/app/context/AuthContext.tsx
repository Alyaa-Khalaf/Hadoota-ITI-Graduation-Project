"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";

interface User {
  id?: string;
  name?: string;
  email?: string;
}
interface AuthContextType {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  refreshAccessToken: () => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  updateUser: (user: User) => void;
  login: (token: string, newUser: User) => void;
  user: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

import { API_ORIGIN } from "@/lib/apiConfig";

const API = API_ORIGIN;

// لو السيرفر ما ردّش خلال المدة دي، نوقف شاشة التحميل بدل ما تفضل معلقة للأبد
const REFRESH_TIMEOUT_MS = 8000;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  // =========================
  // Refresh Token
  // =========================
  const refreshAccessToken = useCallback(async () => {
    try {
      setIsLoading(true);

      // ⏱ حماية ضد تعليق الشاشة للأبد لو السيرفر بطيء أو واقع
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), REFRESH_TIMEOUT_MS);

      const res = await fetch(`${API}/api/auth/refresh`, {
        method: "POST",
        credentials: "include",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await res.json();

      if (res.ok && data?.data?.accessToken) {
        setAccessToken(data.data.accessToken);

        // لو السيرفر رجّع بيانات يوزر محدثة مع التوكن، نحدّث الـ user كمان
        // (بدل ما نسيب user القديم في localStorage بدون تأكيد)
        if (data?.data?.user) {
          setUser(data.data.user);
          localStorage.setItem("user", JSON.stringify(data.data.user));
        }
      } else {
        setAccessToken(null);
      }
    } catch (err) {
      console.error("Refresh token failed:", err);
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
    } catch (err) {
      console.error("Logout request failed:", err);
    }

    setAccessToken(null);
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  }, []);

  // =========================
  // Init
  // =========================
  // ⚠️ شلت الإفيكت القديم اللي كان يقرا accessToken من localStorage مباشرة.
  // كان ده كود ميت فعليًا: الإفيكت ده كان يحصل في نفس اللحظة تقريبًا مع
  // refreshAccessToken()، اللي بيجيب التوكن من الكوكي عبر السيرفر مش من
  // localStorage، فكانت قيمته دايمًا تتستبدل فورًا. localStorage هنا
  // مستخدم بس كمصدر تخزين للعرض الأولي السريع لـ "user" (نقطة 6 تحت)،
  // وليس لـ accessToken الذي مصدر الحقيقة الوحيد له هو السيرفر/الكوكي.
  useEffect(() => {
    refreshAccessToken();
  }, [refreshAccessToken]);

  // ==========================
  // login
  // ==========================
  const login = (newToken: string, newUser: User) => {
    setAccessToken(newToken);
    setUser(newUser);
    localStorage.setItem("accessToken", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const updateUser = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        setAccessToken,
        refreshAccessToken,
        login,
        logout,
        isLoading,
        user,
        updateUser,
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