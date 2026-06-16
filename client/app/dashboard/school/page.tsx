"use client";

import { useState, useEffect } from "react";
import BulkInvite from "@/components/dashboard/BulkInvite";

interface Student {
  _id: string;
  name: string;
  email: string;
  schoolCode: string;
}

interface Analytics {
  totalStudents: number;
  activeStoriesThisWeek: number;
  averageQuizScore: string;
  weeklyReportStatus: string;
}

export default function SchoolDashboard() {
  const [schoolId, setSchoolId] = useState<string>("");
  const [students, setStudents] = useState<Student[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const categories = ["اخلاقية", "علمية", "تاريخية", "ترفيهية"];

  useEffect(() => {
    // 1️⃣ قراءة الـ ID الحقيقي للمدرسة من الـ localStorage ديناميكيًا
    const savedId = localStorage.getItem("currentSchoolId");
    if (savedId) {
      setSchoolId(savedId);
    } else {
      console.warn("تنبيه: لم يتم العثور على مدرسة مسجلة في هذا المتصفح.");
    }
  }, []);

  const loadDashboardData = async () => {
    if (!schoolId) return;
    setIsLoading(true);
    try {
      // 2️⃣ جلب قائمة الطلاب الحقيقية المرتبطين بالمدرسة (GET /api/schools/:id/students)
      const resStudents = await fetch(`http://localhost:5000/api/schools/${schoolId}/students`);
      const dataStudents = await resStudents.json();
      if (resStudents.ok && dataStudents.success) {
        setStudents(dataStudents.data || []);
      }

      // 3️⃣ جلب الإحصائيات والتقارير الحية المحدثة من الداتابيز (GET /api/schools/:id/analytics)
      const resAnalytics = await fetch(`http://localhost:5000/api/schools/${schoolId}/analytics`);
      const dataAnalytics = await resAnalytics.json();
      if (resAnalytics.ok && dataAnalytics.success) {
        setAnalytics(dataAnalytics.data);
        
        // تحديث الفئات النشطة بالمنهج بناءً على البيانات المخزنة حركياً في الداتابيز
        if (dataAnalytics.data?.customCurriculum?.allowedCategories) {
          setSelectedCategories(dataAnalytics.data.customCurriculum.allowedCategories);
        }
      }
    } catch (err) {
      console.error("حدث خطأ أثناء جلب البيانات الحقيقية من السيرفر:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [schoolId]);

  // 4️⃣ تخصيص المنهج وحفظه فوراً في قاعدة البيانات (PUT /api/schools/:id/curriculum)
  const handleCategoryToggle = async (cat: string) => {
    const updated = selectedCategories.includes(cat)
      ? selectedCategories.filter(c => c !== cat)
      : [...selectedCategories, cat];

    setSelectedCategories(updated);

    try {
      const res = await fetch(`http://localhost:5000/api/schools/${schoolId}/curriculum`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ allowedCategories: updated, excludedStories: [] }) // مطابقة لـ req.body في الباك إيند
      });
      
      if (!res.ok) {
        console.error("فشل تحديث المنهج في قاعدة البيانات");
      }
    } catch (err) {
      console.error("حدث خطأ أثناء الاتصال بالسيرفر لتعديل المنهج");
    }
  };

  if (isLoading) return <div className="text-center py-10 font-bold text-gray-400">جاري جلب البيانات الخاصه بالمعلم... ⏳</div>;

  return (
    <div className="p-6 space-y-6 text-right" dir="rtl">
      <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
        <h2 className="text-xl font-black text-gray-800">داشبورد المعلم والمدرسة 🏫</h2>
        <p className="text-xs font-bold text-gray-400">مراقبة الطلاب، تخصيص فئات الحواديت، والتقارير الحية المسترجعة من الـ APIs.</p>
      </div>

      {/* 📊 عرض أرقام الإحصائيات الحقيقية بعد جلبها من السيرفر */}
      {analytics && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border text-center">
            <span className="text-xs font-black text-gray-400">إجمالي عدد الطلاب</span>
            <p className="text-xl font-black text-primary mt-1">{analytics.totalStudents || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border text-center">
            <span className="text-xs font-black text-gray-400">حواديت نشطة هذا الأسبوع</span>
            <p className="text-xl font-black text-indigo-600 mt-1">{analytics.activeStoriesThisWeek || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border text-center">
            <span className="text-xs font-black text-gray-400">متوسط درجات الاختبارات</span>
            <p className="text-xl font-black text-emerald-600 mt-1">{analytics.averageQuizScore || "0%"}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border text-center bg-gradient-to-br from-amber-50 to-orange-50">
            <span className="text-xs font-black text-gray-500">حالة اشتراك المؤسسة</span>
            <p className="text-sm font-black text-orange-700 mt-1">{analytics.weeklyReportStatus || "Active"}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* جدول الطلاب الفعليين القادم من قاعدة البيانات */}
        <div className="lg:col-span-2 bg-white p-6 rounded-[30px] border border-gray-100 shadow-sm space-y-4">
          <h3 className="text-base font-black text-gray-800">قائمة طلاب المدرسة المعتمدين بالفصل 👦👧</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right font-bold text-gray-600">
              <thead>
                <tr className="bg-gray-50 text-gray-400 text-xs border-b">
                  <th className="py-2 px-3">اسم الطالب (من قاعدة البيانات)</th>
                  <th className="py-2 px-3">البريد الإلكتروني</th>
                  <th className="py-2 px-3">كود المدرسة المشترك</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => (
                  <tr key={student._id} className="border-b hover:bg-gray-50/50 text-xs">
                    <td className="py-3 px-3 text-gray-800 font-black">{student.name}</td>
                    <td className="py-3 px-3 text-left" dir="ltr">{student.email}</td>
                    <td className="py-3 px-3">
                      <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md font-mono">{student.schoolCode}</span>
                    </td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr>
                    <td colSpan={3} className="text-center py-6 text-gray-400 text-xs">لا يوجد طلاب مسجلين في هذه المدرسة بعد. ابدأ بدعوة طلابك عبر أداة الدعوة الجماعية!</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* أدوات التحكم والـ Bulk Invite */}
        <div className="space-y-6">
          <BulkInvite schoolId={schoolId} onSuccess={loadDashboardData} />

          {/* فئات كود المنهج المخصص للتحكم الحقيقي */}
          <div className="bg-white p-6 rounded-[30px] border border-gray-100 shadow-sm space-y-3">
            <h4 className="text-base font-black text-gray-800">التحكم في فئات الحواديت المتاحة 🎯</h4>
            <p className="text-xs font-bold text-gray-400">اختر الفئات المصرح بعرضها لأطفال المدرسة حاليًا.</p>
            <div className="space-y-2 pt-2">
              {categories.map(cat => (
                <label key={cat} className="flex items-center gap-2 text-xs font-black text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => handleCategoryToggle(cat)}
                    className="rounded border-gray-300 text-primary w-4 h-4 focus:ring-primary"
                  />
                  <span>إتاحة الحواديت الـ {cat}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}