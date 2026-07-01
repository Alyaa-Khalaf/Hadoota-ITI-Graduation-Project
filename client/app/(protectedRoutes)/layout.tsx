"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { accessToken, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const canViewWithoutAuth = pathname === "/dashboard/subscription";

  useEffect(() => {
    if (!isLoading && !accessToken && !canViewWithoutAuth) {
      router.replace("/auth/login");
    }
  }, [accessToken, canViewWithoutAuth, isLoading, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!accessToken && !canViewWithoutAuth) {
    return null;
  }

  return children;
}
