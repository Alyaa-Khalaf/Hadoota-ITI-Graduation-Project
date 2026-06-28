"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Input from "../ui/Input";
import Button from "../ui/Button";
import SocialLogin from "./SocialLogin";
import { useAuth } from "@/context/AuthContext";
import { API_ORIGIN } from "@/lib/apiConfig";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAccessToken } = useAuth();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // عرض خطأ منع دخول الأدمن عبر جوجل القادم من NextAuth
  useEffect(() => {
    if (searchParams.get("error") === "AdminGoogleBlocked") {
      setError("لا يمكن لحساب الأدمن الدخول عبر جوجل، استخدم البريد وكلمة المرور");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch(
        `${API_ORIGIN}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "تأكد من البيانات");
      }

      const token = data?.data?.accessToken;

      if (!token) {
        throw new Error("Token not found");
      }

      // ✔️ المصدر الأساسي للتوكن
      setAccessToken(token);
      console.log("TOKEN FROM LOGIN:", token);
      // //////////
      const user = data?.data?.user;
      login(token, user);

      // ✔️ توجيه حسب الدور: الأدمن للوحة التحكم، غيره للمغامرة
      let role: string | null = null;
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        role = payload?.role ?? null;
      } catch {
        role = null;
      }

      router.push(role === "admin" ? "/dashboard/admin" : "/childAdventure");
    } catch (err: any) {
      setError(
        err.message || "حدث خطأ أثناء تسجيل الدخول"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 font-sans text-right"
      dir="rtl"
    >
      {error && (
        <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-sm font-bold text-primary text-center">
          ⚠️ {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-black mb-2">
          البريد الإلكتروني
        </label>

        <Input
          type="email"
          placeholder="example@mail.com"
          required
          disabled={isLoading}
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
          label=""
        />
      </div>

      <div>
        <label className="block text-sm font-black mb-2">
          كلمة المرور
        </label>

        <Input
          type="password"
          placeholder="••••••••"
          required
          disabled={isLoading}
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          label=""
        />

        <div className="flex justify-between mt-2">
          <Link href="/auth/forgot-password" className="text-xs">
            نسيت كلمة المرور؟
          </Link>
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        fullWidth
        disabled={isLoading}
        className="!py-3.5 font-black"
      >
        {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
      </Button>

      <SocialLogin isLoading={isLoading} />
    </form>
  );
}