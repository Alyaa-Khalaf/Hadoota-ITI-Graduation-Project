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
    setIsLoading(true);

    try {
      // 🚀 ربط API علياء للتأكد من صحة الكود
      const res = await fetch("ضع_رابط_علياء_للتحقق_من_الكود_هنا", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      if (res.ok) {
        onNext(); // لو الكود صح، انقل لشاشة الباسورد الجديد
      } else {
        setError("❌ الكود غير صحيح أو انتهت صلاحيته.");
      }
    } catch (err) {
      setError("❌ حدث خطأ في السيرفر، يرجى المحاولة مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-right" dir="rtl">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-black text-gray-800">أدخل كود التحقق 🔢</h3>
        <p className="text-xs font-bold text-gray-400">قم بكتابة الكود المكون من 6 أرقام المرسل إلى إيميلك.</p>
      </div>

      {error && <div className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-xl text-center">{error}</div>}

      <div>
        <label className="block text-sm font-black text-gray-700 mb-1.5">كود التحقق</label>
        <Input type="text" placeholder="123456" maxLength={6} required value={code} onChange={(e) => setCode(e.target.value)} disabled={isLoading} label="" />
      </div>

      <div className="flex gap-3">
        <Button type="submit" variant="primary" className="flex-1 !py-3.5 font-black" disabled={isLoading}>
          {isLoading ? "جاري التحقق..." : "تأكيد الكود 🎯"}
        </Button>
        <Button type="button" variant="sky" className="!py-3.5 px-6 font-bold" onClick={onPrev} disabled={isLoading}>رجوع</Button>
      </div>
    </form>
  );
}