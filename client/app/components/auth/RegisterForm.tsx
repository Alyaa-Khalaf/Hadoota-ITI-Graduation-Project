"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "../ui/Input";
import Button from "../ui/Button";
import SocialLogin from "./SocialLogin";
import { useAuth } from "@/context/AuthContext";
import { API_ORIGIN } from "@/lib/apiConfig";

export default function RegisterForm() {
  const router = useRouter();

  const { setAccessToken } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // validation
    if (formData.password !== formData.confirmPassword) {
      setError("كلمتا المرور غير متطابقتين!");
      return;
    }

    if (formData.password.length < 8) {
      setError("كلمة المرور لازم تكون 8 أحرف على الأقل");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(
        `${API_ORIGIN}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "حدث خطأ أثناء إنشاء الحساب");
      }

      const token = data?.data?.accessToken;
      const refresh = data?.data?.refreshToken;

      if (!token) {
        throw new Error("لم يتم استلام التوكن من السيرفر");
      }

      // ✔️ source of truth
      setAccessToken(token);

      // ✔️ persist (important)
      localStorage.setItem("accessToken", token);

      if (refresh) {
        localStorage.setItem("refreshToken", refresh);
      }

      router.push("/onboarding");
    } catch (err: any) {
      setError(err.message || "تعذر إنشاء الحساب");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 font-sans text-right"
      dir="rtl"
    >
      {error && (
        <div className="p-3 rounded-xl bg-red-50 border text-red-600 text-sm font-bold text-center">
          ⚠️ {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-bold mb-1.5">
          اسم الوالد / الوالدة
        </label>

        <Input
          type="text"
          placeholder="الاسم الكامل"
          required
          disabled={isLoading}
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          label=""
        />
      </div>

      <div>
        <label className="block text-sm font-bold mb-1.5">
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
        <label className="block text-sm font-bold mb-1.5">
          كلمة المرور
        </label>

        <Input
          type="password"
          placeholder="••••••••"
          required
          minLength={8}
          disabled={isLoading}
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          label=""
        />
      </div>

      <div>
        <label className="block text-sm font-bold mb-1.5">
          تأكيد كلمة المرور
        </label>

        <Input
          type="password"
          placeholder="••••••••"
          required
          disabled={isLoading}
          value={formData.confirmPassword}
          onChange={(e) =>
            setFormData({
              ...formData,
              confirmPassword: e.target.value,
            })
          }
          label=""
        />
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          fullWidth
          disabled={isLoading}
          className="!py-3.5 font-bold"
        >
          {isLoading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
        </Button>
      </div>

      <SocialLogin isLoading={isLoading} />
    </form>
  );
}