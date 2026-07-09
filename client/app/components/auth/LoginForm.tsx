"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { API_ORIGIN } from "@/lib/apiConfig";
import SocialLogin from "./SocialLogin";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAccessToken, login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get("error") === "AdminGoogleBlocked") {
      setError("لا يمكن لحساب الأدمن الدخول عبر جوجل، استخدم البريد وكلمة المرور");
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const res = await fetch(`${API_ORIGIN}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "تأكد من البيانات");

      const token = data?.data?.accessToken;
      const refreshToken = data?.data?.refreshToken;
      if (!token) throw new Error("Token not found");

      const user = data?.data?.user;
      if (user) {
        login(token, user, refreshToken);
      } else {
        setAccessToken(token);
        localStorage.setItem("accessToken", token);
        localStorage.setItem("token", token);
        if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
      }

      let role = null;
      try {
        role = JSON.parse(atob(token.split(".")[1]))?.role ?? null;
      } catch {}

      router.push(role === "admin" ? "/dashboard/admin" : "/auth/ChildrenChoosen");
    } catch (err) {
      setError(err.message || "حدث خطأ أثناء تسجيل الدخول");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div dir="rtl">
      {/* العنوان */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">أهلاً بعودتك</h2>
        <p className="mt-2 text-sm text-gray-500">تابع رحلة طفلك اليومية</p>
      </div>

      {error && (
        <p className="mb-4 text-center text-sm text-red-500">{error}</p>
      )}

      {/* زرار جوجل */}
      <SocialLogin isLoading={isLoading} />

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-3 text-gray-400">أو</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div className="relative">
          <Mail className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            id="email"
            type="email"
            required
            disabled={isLoading}
            placeholder="البريد الإلكتروني"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full rounded-full bg-gray-50 border border-gray-200 pr-12 pl-4 py-4 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
        </div>

        {/* Password */}
        <div className="relative">
          <Lock className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            required
            disabled={isLoading}
            placeholder="كلمة المرور"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full rounded-full bg-gray-50 border-2 border-gray-800 pr-12 pl-12 py-4 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* نسيت كلمة المرور */}
        <div className="text-left">
          <Link
            href="/auth/forgot-password"
            className="text-xs font-medium text-gray-500 hover:text-gray-700"
          >
            نسيت كلمة المرور؟
          </Link>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-full bg-orange-400 hover:bg-orange-500 py-4 text-base font-bold text-gray-900 transition-colors disabled:opacity-50"
        >
          {isLoading ? "جاري الدخول..." : "تسجيل الدخول"}
        </button>
      </form>
    </div>
  );
}