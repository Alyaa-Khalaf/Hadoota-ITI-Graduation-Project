"use client";

import { useState, useEffect } from "react";
import { API_BASE } from "@/lib/apiConfig";
import { useAuth } from "@/context/AuthContext";
import { fetchWithAuthRetry, getUsableAccessToken } from "@/utils/authFetch";

interface Subscription {
  plan: "free" | "pro" | "family" | "schools";
  status: "active" | "inactive" | "cancelled";
  expiresAt?: string;
  provider?: string;
}

export default function BillingPage() {
  const { accessToken, refreshAccessToken } = useAuth();
  const [sub, setSub] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [notice, setNotice] = useState<{ type: "error" | "info"; text: string } | null>(null);

  // Handle return from Paymob redirect
  useEffect(() => {
    const payment = new URLSearchParams(window.location.search).get("payment");
    if (payment === "success" || payment === "processing") {
      setNotice({ type: "info", text: "تم استلام الدفعة — جاري تفعيل اشتراك المدرسة ⏳" });
    } else if (payment === "failed") {
      setNotice({ type: "error", text: "فشلت عملية الدفع — حاول مرة أخرى." });
    }
  }, []);

  const fetchStatus = async () => {
    try {
      const token = await getUsableAccessToken(accessToken, refreshAccessToken);
      if (!token) return;

      const res = await fetchWithAuthRetry(
        `${API_BASE}/payments/status`,
        { headers: {} },
        token,
        refreshAccessToken
      );
      const result = await res.json();
      if (res.ok && result.success) setSub(result.data);
    } catch {
      // silent
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [accessToken, refreshAccessToken]);

  const handleSubscribe = async () => {
    setIsCheckingOut(true);
    setNotice(null);
    try {
      const token = await getUsableAccessToken(accessToken, refreshAccessToken);
      if (!token) {
        setNotice({ type: "error", text: "انتهت الجلسة، يرجى تسجيل الدخول مرة أخرى." });
        return;
      }

      const res = await fetchWithAuthRetry(
        `${API_BASE}/payments/create-checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ plan: "schools" }),
        },
        token,
        refreshAccessToken
      );
      const result = await res.json();
      if (res.ok && result.data?.url) {
        window.location.href = result.data.url; // → Paymob Unified Checkout
      } else {
        setNotice({ type: "error", text: result.message || "تعذّر بدء عملية الدفع." });
      }
    } catch {
      setNotice({ type: "error", text: "خطأ في الاتصال بالخادم." });
    } finally {
      setIsCheckingOut(false);
    }
  };

  const isActive = sub?.status === "active" && sub?.plan === "schools";
  const renewalDate = sub?.expiresAt ? new Date(sub.expiresAt).toLocaleDateString("ar-EG") : null;

  if (isLoading) return <div className="text-center py-10 font-bold text-gray-400">جاري تحميل بيانات الدفع...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto text-right space-y-6" dir="rtl">
      {notice && (
        <div
          className={`p-4 rounded-2xl text-xs font-black ${
            notice.type === "error" ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
          }`}
        >
          {notice.text}
        </div>
      )}

      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <h2 className="text-xl font-black text-gray-800">إدارة الحساب والفواتير 💳</h2>
        <p className="text-xs font-bold text-gray-400">تابع حالة اشتراك مدرستك وادفع بأمان عبر Paymob.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current subscription */}
        <div className="bg-white p-6 rounded-[30px] border border-gray-100 shadow-sm space-y-4">
          <h3 className="text-sm font-black text-gray-400">الاشتراك الحالي</h3>
          <p className="text-lg font-black text-gray-800">الخطة السنوية للمؤسسات (منصة حدوتة)</p>
          <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
            <span className="text-xs font-bold text-gray-500">حالة الدفع:</span>
            <span className={`text-xs font-black ${isActive ? "text-emerald-600" : "text-gray-500"}`}>
              {isActive ? "نشط ✅" : "غير مشترك"}
            </span>
          </div>
          <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
            <span className="text-xs font-bold text-gray-500">التكلفة والمدة:</span>
            <span className="text-xs font-mono font-black text-gray-700">4999 ج.م / سنويًا</span>
          </div>
          {renewalDate && (
            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
              <span className="text-xs font-bold text-gray-500">{isActive ? "ينتهي في:" : "انتهى في:"}</span>
              <span className="text-xs font-mono font-black text-gray-700">{renewalDate}</span>
            </div>
          )}
        </div>

        {/* Action */}
        <div className="bg-white p-6 rounded-[30px] border border-gray-100 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-black text-gray-400">الإجراءات والتحكم</h3>
            <p className="text-xs text-gray-400 mt-2 leading-relaxed">
              اشترك أو جدّد اشتراك مدرستك السنوي. الدفع يتم بأمان عبر بوابة Paymob (بطاقات الائتمان والمحافظ الإلكترونية).
            </p>
          </div>
          <button
            onClick={handleSubscribe}
            disabled={isCheckingOut}
            className="w-full bg-indigo-600 text-white font-black text-xs py-3 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {isCheckingOut ? "جاري التحويل للدفع... ⏳" : isActive ? "تجديد الاشتراك السنوي 🔁" : "اشترك الآن 💳"}
          </button>
        </div>
      </div>
    </div>
  );
}
