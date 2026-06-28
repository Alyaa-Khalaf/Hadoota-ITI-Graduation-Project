"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import { API_BASE } from "@/lib/apiConfig";

interface Subscription {
  plan: "free" | "pro" | "family" | "schools";
  status: "active" | "inactive" | "cancelled";
  expiresAt?: string;
  provider?: string;
}

const PLAN_LABELS: Record<string, string> = {
  free: "الخطة المجانية",
  pro: "خطة Pro",
  family: "خطة العائلة",
  schools: "خطة المدارس",
};

const PLANS = [
  { key: "pro", name: "Pro", price: "149 ج.م / شهريًا", desc: "كل المميزات لطفل واحد" },
  { key: "family", name: "العائلة", price: "249 ج.م / شهريًا", desc: "حتى 4 أطفال + تقارير متقدمة" },
];

export default function SubscriptionPage() {
  const [sub, setSub] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [checkoutPlan, setCheckoutPlan] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);

  // Handle return from Paymob redirect (?payment=success|failed|processing)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const payment = params.get("payment");
    if (payment === "success" || payment === "processing") {
      setNotice({ type: "info", text: "تم استلام الدفعة — جاري تفعيل اشتراكك خلال لحظات ⏳" });
    } else if (payment === "failed") {
      setNotice({ type: "error", text: "فشلت عملية الدفع — حاول مرة أخرى." });
    }
  }, []);

  const fetchStatus = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_BASE}/payments/status`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (res.ok && result.success) setSub(result.data);
    } catch {
      // keep silent — UI shows default
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleSubscribe = async (plan: string) => {
    setCheckoutPlan(plan);
    setNotice(null);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_BASE}/payments/create-checkout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan }),
      });
      const result = await res.json();
      if (res.ok && result.data?.url) {
        window.location.href = result.data.url; // → Paymob Unified Checkout
      } else {
        setNotice({ type: "error", text: result.message || "تعذّر بدء عملية الدفع." });
      }
    } catch {
      setNotice({ type: "error", text: "خطأ في الاتصال بالخادم." });
    } finally {
      setCheckoutPlan(null);
    }
  };

  const isActive = sub?.status === "active" && sub?.plan !== "free";
  const renewalDate = sub?.expiresAt
    ? new Date(sub.expiresAt).toLocaleDateString("ar-EG")
    : null;

  if (isLoading) {
    return <div className="text-center py-10 font-bold text-gray-400">جاري تحميل بيانات الاشتراك...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 text-right" dir="rtl">
      {notice && (
        <div
          className={`p-4 rounded-2xl text-xs font-black ${
            notice.type === "error"
              ? "bg-red-50 text-red-600"
              : notice.type === "success"
              ? "bg-emerald-50 text-emerald-600"
              : "bg-blue-50 text-blue-600"
          }`}
        >
          {notice.text}
        </div>
      )}

      {/* Current subscription */}
      <div className="bg-white p-6 rounded-[30px] border border-gray-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span
            className={`text-xs font-black px-3 py-1 rounded-full ${
              isActive ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-500"
            }`}
          >
            حالة الحساب: {isActive ? "نشط ✅" : "غير مشترك"}
          </span>
          <h3 className="text-xl font-black text-gray-800 mt-2">
            الاشتراك الحالي: {PLAN_LABELS[sub?.plan || "free"]}
          </h3>
          {renewalDate && (
            <p className="text-xs font-bold text-gray-400 mt-1">
              {isActive ? `ينتهي الاشتراك في: ${renewalDate}` : `انتهى في: ${renewalDate}`}
            </p>
          )}
        </div>
        <Button variant="outline" className="!py-2.5 !px-6 text-xs font-black" onClick={fetchStatus}>
          تحديث الحالة 🔄
        </Button>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {PLANS.map((p) => (
          <div key={p.key} className="bg-white p-6 rounded-[30px] border border-gray-100 shadow-sm space-y-3">
            <h4 className="text-lg font-black text-gray-800">{p.name}</h4>
            <p className="text-2xl font-black text-purple-600">{p.price}</p>
            <p className="text-xs font-bold text-gray-400">{p.desc}</p>
            <Button
              variant="primary"
              className="w-full !py-3 text-xs font-black"
              onClick={() => handleSubscribe(p.key)}
              disabled={checkoutPlan !== null}
            >
              {checkoutPlan === p.key
                ? "جاري التحويل للدفع... ⏳"
                : isActive && sub?.plan === p.key
                ? "تجديد الاشتراك 🔁"
                : "اشترك الآن 💳"}
            </Button>
          </div>
        ))}
      </div>

      <p className="text-[11px] font-bold text-gray-400 text-center">
        الدفع آمن عبر Paymob 🔒 — بطاقات الائتمان والمحافظ الإلكترونية
      </p>
    </div>
  );
}
