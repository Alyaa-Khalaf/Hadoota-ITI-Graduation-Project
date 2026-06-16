"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function SchoolRegisterPage() {
  const router = useRouter();
  const [schoolName, setSchoolName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // 1️⃣ تسجيل مدرسة جديدة (Register School)
      const res = await fetch("http://localhost:5000/api/schools/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: schoolName, email: adminEmail, password: password })
      });

      const result = await res.json();

      if (res.ok && result.success) {
        // حفظ التوكن الذي يرجعه السيرفر مباشرة لتسجيل الدخول التلقائي
        if (result.data?.token || result.token) {
          localStorage.setItem("accessToken", result.data?.token || result.token);
        }

        const schoolId = result.data?._id || result.data?.id || result.data?.schoolId;
        if (schoolId) {
            localStorage.setItem("currentSchoolId", schoolId);
        }
        // التوجيه فوراً لداشبورد المدرسة للبدء بالتيست والمناقشة
        router.push("/dashboard/school");
      } else {
        setError(result.message || "فشل تسجيل المدرسة، يرجى مراجعة الحقول.");
      }
    } catch (err) {
      setError("حدث خطأ أثناء الاتصال بالسيرفر، تأكد من تشغيل الباك إيند.");
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
          <p className="text-xs font-bold text-gray-400">سجل حساب مدرستك الآن لتخصيص مسارات تعليمية ذكية.</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-600 text-xs font-black rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          <Input 
            type="text" 
            placeholder="مثال: مدرسة الجيل الجديد" 
            label="اسم المدرسة أو المنشأة" 
            value={schoolName} 
            onChange={(e: any) => setSchoolName(e.target.value)} 
            required 
            disabled={isLoading} 
          />
          <Input 
            type="email" 
            placeholder="school@example.com" 
            label="البريد الإلكتروني للإدارة" 
            value={adminEmail} 
            onChange={(e: any) => setAdminEmail(e.target.value)} 
            required 
            disabled={isLoading} 
          />
          <Input 
            type="password" 
            placeholder="••••••••" 
            label="كلمة المرور الحامية للحساب" 
            value={password} 
            onChange={(e: any) => setPassword(e.target.value)} 
            required 
            disabled={isLoading} 
          />

          <Button type="submit" variant="primary" fullWidth={true} className="!py-3 font-black mt-2" disabled={isLoading}>
            {isLoading ? "جاري إنشاء الكيان للمدرسة... ⏳" : "تسجيل المدرسة وتفعيل لوحة التحكم ✨"}
          </Button>
        </form>
      </div>
    </div>
  );
}