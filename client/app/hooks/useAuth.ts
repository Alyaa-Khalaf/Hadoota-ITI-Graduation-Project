import { useCallback } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/services/authService";

export const useAuth = () => {
  const {
    user,
    token,
    isLoading,
    error,
    setUser,
    setToken,
    setLoading,
    setError,
    logout,
  } = useAuthStore();

  const login = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await authService.login(email, password);
        if (response.success && response.data) {
          setUser(response.data.user);
          setToken(response.data.accessToken);
          if (typeof window !== "undefined") {
            localStorage.setItem("accessToken", response.data.accessToken);
          }
          return true;
        } else {
          setError(response.error || "Login failed");
          return false;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [setUser, setToken, setLoading, setError],
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await authService.register(name, email, password);
        if (response.success && response.data) {
          setUser(response.data.user);
        } else {
          setError(response.error || "Registration failed");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    },
    [setUser, setLoading, setError],
  );

  const handleLogout = useCallback(() => {
    authService.logout();
    logout();
  }, [logout]);

  return {
    user,
    token,
    isLoading,
    error,
    login,
    register,
    logout: handleLogout,
  };
};
