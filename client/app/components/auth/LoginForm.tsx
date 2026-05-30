"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "../ui/Input";
import Button from "../ui/Button";
import SocialLogin from "./SocialLogin";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // الـ Endpoint الخاص بعلياء
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "تأكد من صحة البيانات المدخلة");
      }

      // حفظ التوكن في الـ LocalStorage
      localStorage.setItem("token", data.token);
      
      // 💡 ملحوظة: لو المشروع بيستخدم كوكيز للحماية، هتحتاجي تسجلي التوكن في الـ document.cookie هنا

      // التوجيه للوحة الأونبوردنج
      router.push("/onboarding");
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء تسجيل الدخول، يرجى المحاولة مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 font-sans text-right" dir="rtl">
      {error && (
        <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-sm font-bold text-primary text-center">
          ⚠️ {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-black text-ink mb-2">البريد الإلكتروني للوالدين</label>
        <Input
          type="email"
          placeholder="example@mail.com"
          required
          disabled={isLoading}
          value={formData.email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })} 
          label={""}        
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-black text-ink">كلمة المرور</label>
          <Link href="/auth/forgot-password" className="text-xs font-bold text-magic hover:underline">
            نسيت كلمة المرور؟
          </Link>
        </div>
        <Input
          type="password"
          placeholder="••••••••"
          required
          disabled={isLoading}
          value={formData.password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, password: e.target.value })} 
          label={""}        
        />
      </div>

      <div className="pt-2">
        <Button type="submit" variant="primary" fullWidth={true} disabled={isLoading} className="!py-3.5 font-black">
          {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
        </Button>
      </div>

      <SocialLogin isLoading={isLoading} />
    </form>
  );
}