// for reset code which contain 6 digit
"use client";
import { useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";

interface Step2Props {
  onNext: () => void;
  onPrev: () => void;
  email: string;
}

export default function ForgotStep2_Code({ onNext, onPrev, email }: Step2Props) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (code.length < 4) { // أو 6 حسب الـ API بتاع علياء
      setError("الرجاء إدخال رمز التحقق كاملاً.");
      return;
    }

    setIsLoading(true);

    try {
      // ⚠️ هنا هيتم ربط الـ API للتحقق من صحة الكود:
      // const response = await fetch('/api/auth/verify-code', { method: 'POST', body: JSON.stringify({ email, code }) })
      
      await new Promise((resolve) => setTimeout(resolve, 1200));

      onNext(); // الكود صح؟ انقل لصفحة الباسورد الجديد
    } catch (err) {
      setError("الرمز غير صحيح أو انتهت صلاحيته. يرجى المحاولة مجدداً.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-right font-sans animate-fadeIn">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-black text-ink">تحقق من بريدك الإلكتروني 📩</h3>
        <p className="text-xs font-bold text-emerald-600 bg-emerald-50 py-2 px-3 rounded-xl inline-block direction-ltr">
          تم إرسال الرمز إلى: {email}
        </p>
        <p className="text-xs font-bold text-ink-muted">
          يرجى إدخال رمز التحقق المكون من الأرقام المرسلة إليك لتأكيد هويتك.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-bold rounded-xl text-center">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-black text-ink mb-1.5">رمز التحقق</label>
        <Input
          type="text"
          placeholder="123456"
          maxLength={6}
          required
          className="text-center tracking-widest font-black text-lg"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} // يقبل أرقام فقط
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
          {isLoading ? "جاري التحقق... ⏳" : "تأكيد الرمز 🔓"}
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