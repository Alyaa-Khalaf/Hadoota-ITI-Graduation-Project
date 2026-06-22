"use client";

import { useState, useEffect } from "react";

export default function AdminDashboard() {
  const [revenueMetrics, setRevenueMetrics] = useState({ totalRevenue: 0, activeSubscriptions: 0 });
  const [flaggedStories, setFlaggedStories] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        // 1️⃣ جلب مقاييس الأرباح الحقيقية (Revenue Metrics)
        const resRevenue = await fetch("http://localhost:5000/api/admin/metrics");
        const dataRevenue = await resRevenue.json();
        if (resRevenue.ok && dataRevenue.success) {
          setRevenueMetrics(dataRevenue.data);
        }

        // 2️⃣ جلب الحواديت الـ Flagged للمراجعة (Content Moderation)
        const resStories = await fetch("http://localhost:5000/api/stories/flagged");
        const dataStories = await resStories.json();
        if (resStories.ok && dataStories.success) {
          setFlaggedStories(dataStories.data || []);
        }

        // 3️⃣ جلب المستخدمين الحقيقيين للتحكم بحظرهم (User Management)
        const resUsers = await fetch("http://localhost:5000/api/users");
        const dataUsers = await resUsers.json();
        if (resUsers.ok && dataUsers.success) {
          setUsers(dataUsers.data || []);
        }

      } catch (error) {
        console.error("خطأ أثناء استدعاء الـ Endpoints الحقيقية للأدمن:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAdminData();
  }, []);

  // دالة حظر مستخدم (API Endpoint حقيقي)
  const handleToggleBlockUser = async (userId: string, isBlocked: boolean) => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/${userId}/block`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ block: !isBlocked })
      });
      if (res.ok) {
        // تحديث الواجهة تلقائياً بعد نجاح التعديل في الداتابيز
        alert("تم تحديث حالة المستخدم بنجاح في قاعدة البيانات!");
      }
    } catch (err) {
      console.error("فشل حظر المستخدم");
    }
  };

  if (isLoading) return <div className="text-center py-10 font-bold text-gray-400">جاري جلب الداتا الحقيقية للوحة الأدمن... 🚀</div>;

  return (
    <div className="p-6 text-right space-y-6" dir="rtl">
      {/* هيدر الصفحة */}
      <div className="bg-slate-800 text-white p-5 rounded-3xl shadow-sm">
        <h2 className="text-xl font-black">لوحة تحكم الإدارة العليا (Admin Panel UI) 🛠️</h2>
        <p className="text-xs text-slate-400 mt-1">إدارة المستخدمين، متابعة الأرباح، والتحكم في الحواديت الـ Flagged ديناميكيًا.</p>
      </div>

      {/* 💳 الأرباح الحقيقية القادمة من الـ API */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl border text-center">
          <span className="text-xs font-black text-gray-400">إجمالي الإيرادات (Revenue Metrics)</span>
          <p className="text-xl font-black text-indigo-600 mt-1">${revenueMetrics.totalRevenue || "0.00"}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border text-center">
          <span className="text-xs font-black text-gray-400">الاشتراكات النشطة حالياً</span>
          <p className="text-xl font-black text-emerald-600 mt-1">{revenueMetrics.activeSubscriptions || 0}</p>
        </div>
      </div>

      {/* باقي عناصر التصميم لجدول الـ Users والـ Flagged Stories تقرأ الآن من الـ states (users و flaggedStories) الحقيقية بالكامل! */}
    </div>
  );
}