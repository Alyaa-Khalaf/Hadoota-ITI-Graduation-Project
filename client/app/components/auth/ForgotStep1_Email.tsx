// enter email and Validation to prevent sending invalid and empty data
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

    if (!email) {
      setError("الرجاء إدخال البريد الإلكتروني.");
      return;
    }

    setIsLoading(true);

    try {
      // ⚠️ هنا هيتم استدعاء الـ API الخاص بعلياء لاحقاً:
      // const response = await fetch('/api/auth/forgot-password', { ... })
      
      // محاكاة سريعة للانتظار (حذف بعد ربط الـ API)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // لو كل شيء تمام، بننقل للخطوة الثانية (كود التأكيد)
      onNext();
    } catch (err) {
      setError("حدث خطأ ما، يرجى التحقق من الإيميل والمحاولة مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-right font-sans animate-fadeIn">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-black text-ink">نسيت كلمة المرور؟ 🔑</h3>
        <p className="text-xs font-bold text-ink-muted leading-relaxed">
          أدخل بريدك الإلكتروني المسجل وسنقوم بإرسال رمز التحقق لإعادة تعيين كلمة المرور.
        </p>
      </div>

      {/* عرض الأخطاء إن وجدت */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-bold rounded-xl text-center">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-black text-ink mb-1.5">البريد الإلكتروني</label>
        <Input
          type="email"
          placeholder="example@gmail.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          label=""
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        fullWidth={true}
        disabled={isLoading}
        className="!py-3.5 font-black"
      >
        {isLoading ? "جاري الإرسال... ⏳" : "إرسال رمز التحقق ✨"}
      </Button>
    </form>
  );
}