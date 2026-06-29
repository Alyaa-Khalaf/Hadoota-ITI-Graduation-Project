"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function decodeRole(): string | null {
  if (typeof window === "undefined") return null;
  const token =
    localStorage.getItem("accessToken") || localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role ?? null;
  } catch {
    return null;
  }
}

export default function RoleGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const role = decodeRole();
    if (role === "admin") {
      setAllowed(true);
    } else {
      router.replace("/auth/login");
    }
    setChecked(true);
  }, [router]);

  if (!checked || !allowed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFBF0]">
        <p className="text-[#FF7043] font-bold animate-pulse">
          جاري التحقق من الصلاحيات...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
