"use client";
import { useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";

interface Step1Props {
  onNext: () => void;
  setEmail: (email: string) => void;
  email: string;
}

export default function ForgotStep1_Email({ onNext, setEmail, email }: Step1Props) {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // 🚀 ربط API علياء لإرسال كود التحقق للإيميل
      const res = await fetch("ضع_رابط_علياء_لإرسال_الكود_هنا", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        onNext(); // لو الإيميل صح والكود اتبعث، انقل للخطوة التانية
      } else {
        setError("❌ هذا البريد الإلكتروني غير مسجل لدينا.");
      }
    } catch (err) {
      setError("❌ حدث خطأ في الاتصال بالسيرفر، حاول مجدداً.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-right" dir="rtl">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-black text-gray-800">نسيت كلمة المرور؟ 🧐</h3>
        <p className="text-xs font-bold text-gray-400">أدخل بريدك الإلكتروني لإرسال كود استعادة الحساب.</p>
      </div>

      {error && <div className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-xl text-center">{error}</div>}

      <div>
        <label className="block text-sm font-black text-gray-700 mb-1.5">البريد الإلكتروني</label>
        <Input type="email" placeholder="name@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} label="" />
      </div>

      <Button type="submit" variant="primary" fullWidth={true} disabled={isLoading} className="!py-3.5 font-black">
        {isLoading ? "جاري الإرسال... ⏳" : "إرسال كود التحقق 🚀"}
      </Button>
    </form>
  );
}