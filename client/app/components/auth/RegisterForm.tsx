"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "../ui/Input";
import Button from "../ui/Button";
import SocialLogin from "./SocialLogin";

export default function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("كلمتا المرور غير متطابقتين!");
      return;
    }

    if (formData.password.length < 8) {
      setError("يجب أن تكون كلمة المرور 8 أحرف أو أكثر!");
      return;
    }

    setIsLoading(true);

    try {
      // الـ Endpoint الخاص بعلياء لإنشاء الحساب
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

      // تسجيل دخول تلقائي بعد الإنشاء أو التوجيه لصفحة تأكيد الإيميل
      localStorage.setItem("token", data.token);
      localStorage.setItem("parentName", name);
      router.push("/onboarding");
    } catch (err: any) {
      setError(err.message || "تعذر إنشاء الحساب، يرجى المحاولة لاحقاً.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-sans text-right" dir="rtl">
      {error && (
        <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-sm font-bold text-primary text-center">
          ⚠️ {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-black text-ink mb-1.5">اسم الوالد / الوالدة</label>
        <Input
                  type="text"
                  placeholder="الاسم الكامل"
                  required
                  disabled={isLoading}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })} label={""}        />
      </div>

      <div>
        <label className="block text-sm font-black text-ink mb-1.5">البريد الإلكتروني</label>
        <Input
          type="email"
          placeholder="example@mail.com"
          required
          disabled={isLoading}
          value={formData.email}
          label=""
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-black text-ink mb-1.5">كلمة المرور</label>
        <Input
          type="password"
          placeholder="••••••••"
          required
          minLength={8}
          disabled={isLoading}
          value={formData.password}
          label=""
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-black text-ink mb-1.5">تأكيد كلمة المرور</label>
        <Input
          type="password"
          placeholder="••••••••"
          required
          disabled={isLoading}
          value={formData.confirmPassword}
          label=""
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
        />
      </div>

      <div className="pt-2">
        <Button type="submit" variant="primary" fullWidth={true} disabled={isLoading} className="!py-3.5 font-black">
          {isLoading ? "جاري إنشاء الحساب..." : "إنشاء حساب جديد"}
        </Button>
      </div>

      <SocialLogin isLoading={isLoading} />
    </form>
  );
}