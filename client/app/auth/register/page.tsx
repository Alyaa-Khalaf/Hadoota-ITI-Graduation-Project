"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function SchoolRegisterPage() {
  const [schoolName, setSchoolName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // 1️⃣ إرسال الاسم فقط بناءً على سطر 13 في school.controller.js
      const res = await fetch("http://localhost:5000/api/schools/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: schoolName })
      });

      const result = await res.json();

      if (res.ok && result.success) {
        // حفظ الـ schoolId القادم من أوبجكت هند (data.school._id)
        const schoolId = result.data?.school?._id;
        if (schoolId) {
          localStorage.setItem("currentSchoolId", schoolId);
        }

        // 🔥 التوجيه الفوري لرابط الدفع بـ Stripe القادم من السيرفر (data.checkoutUrl)
        if (result.data?.checkoutUrl) {
          window.location.href = result.data.checkoutUrl;
        } else {
          window.location.href = "/dashboard/school";
        }
      } else {
        setError(result.message || "فشل تسجيل المدرسة، يرجى المحاولة مرة أخرى.");
      }
    } catch (err) {
      setError("حدث خطأ أثناء الاتصال بالسيرفر، تأكدي من تشغيل تيرمنال الباك إيند الخاص بهند.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 text-right" dir="rtl">
      <div className="bg-white w-full max-w-md p-8 rounded-[40px] shadow-sm border border-gray-100 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-4xl">🏫</span>
          <h3 className="text-xl font-black text-gray-800">بوابة المدارس والمؤسسات</h3>
          <p className="text-xs font-bold text-gray-400">سجل حساب مدرستك الآن لتفعيل لوحة التحكم وبوابة الدفع.</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-600 text-xs font-black rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          <Input 
            type="text" 
            placeholder="مثال: مدرسة الجيل الجديد الدولية" 
            label="اسم المدرسة أو المنشأة" 
            value={schoolName} 
            onChange={(e: any) => setSchoolName(e.target.value)} 
            required 
            disabled={isLoading} 
          />

          <Button type="submit" variant="primary" fullWidth={true} className="!py-3 font-black mt-2" disabled={isLoading}>
            {isLoading ? "جاري تشييد الكيان والانتقال لـ Stripe... ⏳" : "تسجيل المدرسة وتفعيل لوحة التحكم ✨"}
          </Button>
        </form>
      </div>
    </div>
  );
}