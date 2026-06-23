"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Input from "../ui/Input";
import Button from "../ui/Button";
import SocialLogin from "@/components/auth/SocialLogin";
import { useAuth } from "@/context/AuthContext";
import { API_ORIGIN } from "@/lib/apiConfig";

export default function LoginForm() {
  const router = useRouter();
  const { setAccessToken } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

      router.push("/ParentDashboard");
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