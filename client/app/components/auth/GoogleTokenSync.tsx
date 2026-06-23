"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function GoogleTokenSync() {
  const { data: session, status } = useSession();
  const { setAccessToken } = useAuth();

  useEffect(() => {
    if (status === "authenticated" && session?.backendToken) {
      localStorage.setItem("accessToken", session.backendToken);
      if (session.backendRefreshToken) {
        localStorage.setItem("refreshToken", session.backendRefreshToken);
      }
      setAccessToken(session.backendToken);
    }
  }, [status, session]);

  return null;
}