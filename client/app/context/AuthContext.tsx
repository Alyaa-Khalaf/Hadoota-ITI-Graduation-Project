"use client";

import {motion} from "framer-motion";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useRef,
} from "react";

interface User {
  id?: string;
  name?: string;
  email?: string;
}
interface AuthContextType {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  refreshAccessToken: () => Promise<string | null>;
  logout: () => Promise<void>;
  isLoading: boolean;
  updateUser: (user: User) => void;
  login: (token: string, newUser: User, refreshToken?: string) => void;
  user: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

import { API_ORIGIN } from "@/lib/apiConfig";
import { isTokenExpiring } from "@/utils/authFetch";

const API = API_ORIGIN;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      setAccessToken(token);
    }
  }, []);
  
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  // =========================
  // Refresh Token
  // =========================
  // يمنع تكرار نداء الـ refresh في نفس اللحظة (بيحل مشكلة الـ Strict Mode
  // اللي بينفذ الـ useEffect مرتين، وأي نداء متزامن تاني من مكان تاني في الكود)
  const refreshPromiseRef = useRef<Promise<string | null> | null>(null);

  const refreshAccessToken = useCallback(async (): Promise<string | null> => {
    // لو فيه request شغال بالفعل، استني نتيجته بدل ما تبعتي واحد جديد
    if (refreshPromiseRef.current) {
      return refreshPromiseRef.current;
    }

    const storedAccessToken =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken") || localStorage.getItem("token")
        : null;

    const keepStoredTokenIfUsable = () => {
      if (storedAccessToken && !isTokenExpiring(storedAccessToken)) {
        setAccessToken(storedAccessToken);
        return storedAccessToken;
      }

      setAccessToken(null);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      return null;
    };

    const doRefresh = async (): Promise<string | null> => {
      try {
        const refreshToken =
          typeof window !== "undefined"
            ? localStorage.getItem("refreshToken")
            : null;

        const res = await fetch(`${API}/api/auth/refresh`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(refreshToken ? { refreshToken } : {}),
        });

        const data = await res.json();

        if (res.ok && data?.data?.accessToken) {
          setAccessToken(data.data.accessToken);
          localStorage.setItem("accessToken", data.data.accessToken);
          localStorage.setItem("token", data.data.accessToken);
          if (data.data.refreshToken) {
            localStorage.setItem('refreshToken', data.data.refreshToken);
          }
          return data.data.accessToken;
        } else {
          return keepStoredTokenIfUsable();
        }
      } catch {
        return keepStoredTokenIfUsable();
      } finally {
        // فضّي الـ lock عشان أي نداء جديد (بعد ما العملية دي تخلص فعلاً) يقدر يبعت request تاني
        refreshPromiseRef.current = null;
      }
    };

    refreshPromiseRef.current = doRefresh();
    return refreshPromiseRef.current;
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
    } catch { }

    setAccessToken(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
  }, []);

  // =========================
  // Init — bootstrap auth once on mount. This is the ONLY place that drives
  // the global `isLoading` gate, so token refreshes triggered later by API
  // calls don't remount the whole app mid-action.
  // =========================
  useEffect(() => {
    refreshAccessToken().finally(() => setIsLoading(false));
  }, [refreshAccessToken]);

  // ==========================
  // login
  // ==========================

  const login = (newToken: string, newUser: User, refreshToken?: string) => {
    setAccessToken(newToken);
    setUser(newUser);
    localStorage.setItem("accessToken", newToken);
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }
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
        updateUser
      }}
    >
      {isLoading ? (
  <div className="min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden">
    {/* خلفية تجميلية - Blobs */}
    <div className="absolute top-1/4 -left-20 w-72 h-72 bg-primary/20 rounded-full blur-[100px]" />
    <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-rose-200/30 rounded-full blur-[100px]" />

    <div className="relative z-10 flex flex-col items-center gap-8 p-8 max-w-sm w-full text-center">
      {/* أيقونات متحركة بانسيابية */}
      <div className="flex gap-4">
        {['🐶', '🐱', '🐸'].map((emoji, i) => (
          <motion.div
            key={emoji}
            animate={{ y: [0, -15, 0] }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              delay: i * 0.2,
              ease: "easeInOut" 
            }}
            className="text-5xl"
          >
            {emoji}
          </motion.div>
        ))}
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-black text-primary">جاري التجهيز...</h2>
        <p className="text-muted-foreground text-sm font-medium">مغامرتك الرائعة تبدأ الآن ✨</p>
      </div>

      {/* شريط تحميل عصري */}
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-primary"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      </div>
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