// when the parent enter the code which at least 6 digit and confirm password
"use client";
import { useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";

interface Step3Props {
  onNext: () => void;
  onPrev: () => void;
  email: string;
}

export default function ForgotStep3_NewPassword({ onNext, onPrev, email }: Step3Props) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // التحقق من طول كلمة المرور
    if (password.length < 6) {
      setError("كلمة المرور يجب أن لا تقل عن 6 أحرف أو أرقام.");
      return;
    }

    // التحقق من تطابق كلمتي المرور
    if (password !== confirmPassword) {
      setError("كلمتا المرور غير متطابقتين. يرجى التأكد وإعادة الكتابة.");
      return;
    }

    setIsLoading(true);

    try {
      // ⚠️ هنا هيتم ربط الـ API النهائي لتغيير الباسورد:
      // const response = await fetch('/api/auth/reset-password', { method: 'POST', body: JSON.stringify({ email, password }) })
      
      await new Promise((resolve) => setTimeout(resolve, 1500));

      onNext(); // لو نجح التغيير، اظهر شاشة النجاح
    } catch (err) {
      setError("حدث خطأ أثناء تحديث كلمة المرور، يرجى المحاولة مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-right font-sans animate-fadeIn">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-black text-ink">كلمة مرور جديدة 🔒</h3>
        <p className="text-xs font-bold text-ink-muted">
          يرجى اختيار كلمة مرور قوية وسهلة التذكر لحماية حساب عائلتك.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-bold rounded-xl text-center">
          {error}
        </div>
      )}

      {/* حقل كلمة المرور الجديدة */}
      <div>
        <label className="block text-sm font-black text-ink mb-1.5">كلمة المرور الجديدة</label>
        <Input
          type="password"
          placeholder="••••••••"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          label=""
        />
      </div>

      {/* حقل تأكيد كلمة المرور */}
      <div>
        <label className="block text-sm font-black text-ink mb-1.5">تأكيد كلمة المرور</label>
        <Input
          type="password"
          placeholder="••••••••"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isLoading}
          label=""
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          type="submit"
          variant="primary"
          fullWidth={true}
          disabled={isLoading}
          className="!py-3.5 font-black order-2"
        >
          {isLoading ? "جاري الحفظ... ⏳" : "تغيير كلمة المرور 🚀"}
        </Button>
        <Button
          type="button"
          variant="sky"
          fullWidth={false}
          onClick={onPrev}
          disabled={isLoading}
          className="!py-3.5 px-6 font-bold text-ink order-1"
        >
          رجوع
        </Button>
      </div>
    </form>
  );
}