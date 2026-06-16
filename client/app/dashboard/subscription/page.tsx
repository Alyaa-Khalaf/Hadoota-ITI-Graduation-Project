"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";

interface Invoice {
  id: string;
  amount: number;
  date: string;
  status: string;
  pdfUrl: string;
}

export default function SubscriptionPage() {
  const [currentPlan, setCurrentPlan] = useState("الخطة الأساسية للمدارس 🏫");
  const [status, setStatus] = useState("نشط");
  const [nextBillingDate, setNextBillingDate] = useState("2026-07-01");
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // تعبئة بيانات تجريبية لمحاكاة الفواتير القادمة من Stripe API الخاص بـ علياء
    setInvoices([
      { id: "inv_1", amount: 49.00, date: "2026-06-01", status: "مدفوعة", pdfUrl: "#" },
      { id: "inv_2", amount: 49.00, date: "2026-05-01", status: "مدفوعة", pdfUrl: "#" }
    ]);
  }, []);

  // دمج Stripe Customer Portal ذكياً
  const handleManageBilling = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch("http://localhost:5000/api/subscriptions/customer-portal", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      const result = await res.json();
      if (res.ok && result.url) {
        // توجيه الأب أو المدرسة مباشرة إلى بوابة سترايب لإدارة الدفع والإلغاء وتخفيض الخطة
        window.location.href = result.url;
      } else {
        alert("فشل في إنشاء جلسة بوابة الدفع.");
      }
    } catch (err) {
      console.error("خطأ أثناء الانتقال لبوابة الدفع:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 text-right" dir="rtl">
      <div className="bg-white p-6 rounded-[30px] border border-gray-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="bg-emerald-50 text-emerald-600 text-xs font-black px-3 py-1 rounded-full">حالة الحساب: {status} ✅</span>
          <h3 className="text-xl font-black text-gray-800 mt-2">الاشتراك الحالي: {currentPlan}</h3>
          <p className="text-xs font-bold text-gray-400 mt-1">تاريخ التجديد القادم التلقائي: {nextBillingDate}</p>
        </div>
        <Button variant="primary" className="!py-2.5 !px-6 text-xs font-black" onClick={handleManageBilling} disabled={isLoading}>
          {isLoading ? "جاري التوجيه بأمان... ⏳" : "إدارة الاشتراك والفواتير عبر Stripe 💳"}
        </Button>
      </div>

      {/* تاريخ الفواتير السابق قادم من الـ Webhooks */}
      <div className="bg-white p-6 rounded-[30px] border border-gray-100 shadow-sm space-y-4">
        <h4 className="text-base font-black text-gray-800">تاريخ وسجل الفواتير 📄</h4>
        <div className="space-y-2">
          {invoices.map(invoice => (
            <div key={invoice.id} className="p-3 bg-gray-50 rounded-xl flex items-center justify-between border text-xs font-bold">
              <div>
                <p className="text-gray-800">رقم الفاتورة: {invoice.id}</p>
                <p className="text-gray-400 text-[10px] mt-0.5">التاريخ: {invoice.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-emerald-600">${invoice.amount.toFixed(2)}</span>
                <a href={invoice.pdfUrl} className="text-blue-500 hover:underline">تحميل PDF ⬇️</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}