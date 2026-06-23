"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { accessToken, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !accessToken) {
      router.replace("/auth/login");
    }
  }, [accessToken, isLoading, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!accessToken) {
    return null;
  }

  return children;
}