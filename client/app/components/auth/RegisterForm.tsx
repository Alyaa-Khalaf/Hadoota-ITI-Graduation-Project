"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { API_ORIGIN } from "@/lib/apiConfig";
import SocialLogin from "./SocialLogin";
import { User, Mail, Lock, CheckCircle2, EyeOff, Eye } from "lucide-react";

export default function RegisterForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);



  const passwordsMatch = formData.password && formData.password === formData.confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("كلمتا المرور غير متطابقتين");
      return;
    }

    if (formData.password.length < 8) {
      setError("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${API_ORIGIN}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "حدث خطأ أثناء إنشاء الحساب");
      }

      const token = data?.data?.accessToken;
      if (!token) {
        throw new Error("لم يتم استلام التوكن");
      }

      const refreshToken = data?.data?.refreshToken;
      const user = data?.data?.user || data?.user;

      if (user) {
        login(token, user, refreshToken);
      } else {
        localStorage.setItem("accessToken", token);
        localStorage.setItem("token", token);
        if (refreshToken) {
          localStorage.setItem("refreshToken", refreshToken);
        }
      }

      setTimeout(() => {
        router.push("/onboarding");
      }, 50);
    } catch (err) {
      setError(err.message || "تعذر إنشاء الحساب");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div dir="rtl">
      {/* العنوان */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">إنشاء حساب جديد</h2>
        <p className="mt-2 text-sm text-gray-500">انضم إلينا لتبدأ رحلة طفلك السحرية</p>
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
        {/* Name */}
        <div className="relative">
          <User className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            required
            disabled={isLoading}
            placeholder="اسم الوالد / الوالدة"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full rounded-full bg-gray-50 border border-gray-200 pr-12 pl-4 py-4 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
        </div>

        {/* Email */}
        <div className="relative">
          <Mail className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="email"
            required
            disabled={isLoading}
            dir="ltr"
            placeholder="البريد الإلكتروني"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full rounded-full bg-gray-50 border border-gray-200 pr-12 pl-4 py-4 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 text-right"
          />
        </div>

        {/* Password */}
        {/* Password */}
<div className="relative">
  <Lock className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
  <input
    type={showPassword ? "text" : "password"}
    required
    disabled={isLoading}
    placeholder="كلمة المرور"
    value={formData.password}
    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
    className="w-full rounded-full bg-gray-50 border border-gray-200 pr-12 pl-12 py-4 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
  />
  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
  >
    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
  </button>
</div>

{/* Confirm Password */}
<div>
  <div className="relative">
    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
    <input
      type={showConfirmPassword ? "text" : "password"}
      required
      disabled={isLoading}
      placeholder="تأكيد كلمة المرور"
      value={formData.confirmPassword}
      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
      className={`w-full rounded-full bg-gray-50 border pr-12 pl-12 py-4 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 ${
        formData.confirmPassword && !passwordsMatch
          ? "border-red-400"
          : "border-gray-200"
      }`}
    />
    <button
      type="button"
      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
    >
      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
    </button>
  </div>
  {formData.confirmPassword &&
    (passwordsMatch ? (
      <p className="mt-2 px-2 text-xs text-green-600 flex items-center gap-1">
        <CheckCircle2 className="h-3 w-3" />
        كلمات المرور متطابقة
      </p>
    ) : (
      <p className="mt-2 px-2 text-xs text-red-500">كلمات المرور غير متطابقة</p>
    ))}
</div>


        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading || !passwordsMatch}
          className="w-full rounded-full bg-primary hover:bg-primary/80 py-4 text-base font-bold text-gray-900 transition-colors disabled:opacity-50"
        >
          {isLoading ? "جاري إنشاء الحساب..." : "ابدأ المغامرة الآن"}
        </button>
      </form>
    </div>
  );
}