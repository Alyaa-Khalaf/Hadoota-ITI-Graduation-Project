"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { API_ORIGIN } from "@/lib/apiConfig";

/**
 * ⚠️ ملاحظة مهمة:
 * - الإيميل بييجي من useAuth().user.email (المستخدم أصلاً Login من قبل).
 *   لو شكل الـ context عندك مختلف (مثلاً user.userEmail أو user مش موجود أصلاً
 *   إلا بعد فetch تاني)، لازم تعدّل السطر اللي فيه `user?.email` بس.
 * - الفورم ده مش login جديد، هو "Parent Gate": تأكيد هوية البالغ
 *   قبل دخوله على Parent Dashboard، عن طريق إعادة كتابة الباسوورد بتاعه.
 * - بنستخدم نفس endpoint بتاع /api/auth/login زي ما اتفقنا، وبنبعت
 *   الإيميل المحفوظ + الباسوورد الجديد اللي كتبه.
 */

export default function ParentGateForm() {
  const router = useRouter();
  const { user, login } = useAuth();

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // الإيميل لازم يكون معروف من السيستم أصلاً (المستخدم مسجل دخول فعلاً)
    if (!user?.email) {
      setError("تعذر التحقق من الحساب، حاول تسجيل الدخول من جديد");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${API_ORIGIN}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: user.email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "كلمة المرور غير صحيحة");
      }

      const token = data?.data?.accessToken;
      const refreshToken = data?.data?.refreshToken;

      if (!token) {
        throw new Error("Token not found");
      }

      // ✔️ المصدر الأساسي للتوكن (نفس منطق اللوجن الأساسي)
      login(token, data?.data?.user || user || {}, refreshToken);

      router.push("/ParentDashboard");
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء التأكيد، حاول مرة أخرى");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 font-sans text-right"
      dir="rtl"
    >
      {/* شعار/صورة خاصة بواجهة الـ Parent Dashboard */}
      <div className="flex flex-col items-center mb-2">
        
        <h1 className="text-lg font-black text-center">
          تأكيد هوية ولي الأمر
        </h1>
        <p className="text-sm text-gray-500 text-center mt-1">
          {user?.email
            ? `أدخل كلمة المرور المرتبطة بحساب ${user.email} للمتابعة`
            : "أدخل كلمة المرور بحسابك للمتابعة"}
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-sm font-bold text-primary text-center">
          ⚠️ {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-black mb-2">
          كلمة المرور
        </label>

        <Input
          type="password"
          placeholder="••••••••"
          required
          autoFocus
          disabled={isLoading}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          label=""
        />
      </div>

     <Button
  type="submit"
  variant="default"
  disabled={isLoading || !password}
  className="w-full !py-6 text-base font-black rounded-xl shadow-lg hover:shadow-xl transition-all"
>
  {isLoading ? "جاري التأكيد..." : "تأكيد والدخول"}
</Button>
    </form>
  );
}
