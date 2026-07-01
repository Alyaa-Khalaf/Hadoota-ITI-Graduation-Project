"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import { API_BASE } from "@/lib/apiConfig";
import type { Plan } from "@/types/pricing";
import { useAuth } from "@/context/AuthContext";
import { fetchWithAuthRetry, getUsableAccessToken } from "@/utils/authFetch";

interface Subscription {
  plan: string;
  status: "active" | "inactive" | "cancelled";
  expiresAt?: string;
  provider?: string;
}

const PLAN_LABELS: Record<string, string> = {
  free: "الخطة المجانية",
};

export default function SubscriptionPage() {
  const { accessToken, refreshAccessToken } = useAuth();
  const [sub, setSub] = useState<Subscription | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
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

  // Fetch the DB-managed plans available to parents
  useEffect(() => {
    fetch(`${API_BASE}/plans?audience=parent`)
      .then((res) => res.json())
      .then((result) => {
        if (result?.success && Array.isArray(result.data)) setPlans(result.data);
      })
      .catch(() => {
        // keep silent — UI shows empty state
      });
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
      // keep silent — UI shows default
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [accessToken, refreshAccessToken]);

  const handleSubscribe = async (slug: string) => {
    setCheckoutPlan(slug);
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
          body: JSON.stringify({ plan: slug }),
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
      setCheckoutPlan(null);
    }
  };

  const isActive = sub?.status === "active" && sub?.plan !== "free";
  const currentPlanLabel =
    PLAN_LABELS[sub?.plan || "free"] ||
    plans.find((p) => p.slug === sub?.plan)?.name ||
    sub?.plan ||
    "الخطة المجانية";
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
            الاشتراك الحالي: {currentPlanLabel}
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
      {plans.length === 0 ? (
        <p className="text-center text-sm font-bold text-gray-400 py-6">
          لا توجد خطط متاحة حالياً.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {plans.map((p) => (
            <div
              key={p._id}
              className={`bg-white p-6 rounded-[30px] border shadow-sm space-y-3 ${
                p.highlight ? "border-2 border-purple-400" : "border-gray-100"
              }`}
            >
              {p.badge && (
                <span className="inline-block text-[11px] font-black px-3 py-1 rounded-full bg-purple-50 text-purple-600">
                  {p.badge}
                </span>
              )}
              <h4 className="text-lg font-black text-gray-800">{p.name}</h4>
              <p className="text-2xl font-black text-purple-600">
                {p.price} {p.currency === "EGP" ? "ج.م" : p.currency} /{" "}
                {p.durationDays >= 365 ? "سنويًا" : "شهريًا"}
              </p>
              {p.description && <p className="text-xs font-bold text-gray-400">{p.description}</p>}
              {p.features && p.features.length > 0 && (
                <ul className="space-y-1.5 text-xs font-bold text-gray-600">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="text-emerald-500">✓</span> {f}
                    </li>
                  ))}
                </ul>
              )}
              <Button
                variant="primary"
                className="w-full !py-3 text-xs font-black"
                onClick={() => handleSubscribe(p.slug)}
                disabled={checkoutPlan !== null}
              >
                {checkoutPlan === p.slug
                  ? "جاري التحويل للدفع... ⏳"
                  : isActive && sub?.plan === p.slug
                  ? "تجديد الاشتراك 🔁"
                  : "اشترك الآن 💳"}
              </Button>
            </div>
          ))}
        </div>
      )}

      <p className="text-[11px] font-bold text-gray-400 text-center">
        الدفع آمن عبر Paymob 🔒 — بطاقات الائتمان والمحافظ الإلكترونية
      </p>
    </div>
  );
}
