"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

type DayEntry = {
  date: string;
  minutes: number;
};

type WeeklyScreenTime = {
  weekStart: string;
  weekTotal: number;
  dailyLimit: number;
  days: DayEntry[];
};

type Props = {
  childId: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const DAY_NAMES_AR = ["أحد", "اتنين", "تلات", "أربع", "خميس", "جمعة", "سبت"];

export default function WeeklyScreenTimeSection({ childId }: Props) {
  const { accessToken } = useAuth();

  const [report, setReport] = useState<WeeklyScreenTime | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 📥 fetch weekly report
  const fetchWeeklyReport = async () => {
    if (!childId || !accessToken) return;

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `${API_BASE}/api/screentime/${childId}/week`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = await res.json();

      if (data?.success) {
        setReport(data.data);
      } else {
        setReport(null);
        setError(data?.message || "حصل خطأ في جلب التقرير");
      }
    } catch (err) {
      console.error("Weekly screen time error:", err);
      setReport(null);
      setError("حصل خطأ في الاتصال بالسيرفر");
    } finally {
      setLoading(false);
    }
  };

  // 📌 reload when child changes
  useEffect(() => {
    if (childId) {
      fetchWeeklyReport();
    }
  }, [childId, accessToken]);

  if (!childId) {
    return (
      <div dir="rtl" className="text-sm text-gray-400 p-4">
        اختر طفلاً لعرض تقرير وقت الشاشة الأسبوعي
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border p-5 space-y-4">

      {/* Header */}
      <div dir="rtl" className="flex justify-between items-center">
        <h2 className="font-bold text-sm">تقرير وقت الشاشة الأسبوعي</h2>

        <button
          onClick={fetchWeeklyReport}
          disabled={loading}
          className="px-3 py-1 text-xs bg-primary text-white rounded-md"
        >
          {loading ? "جاري التحديث..." : "تحديث"}
        </button>
      </div>

      {/* Loading */}
      {loading && !report ? (
        <div dir="rtl" className="text-sm text-gray-500 animate-pulse">
          جارٍ تحميل التقرير...
        </div>
      ) : error ? (
        <div dir="rtl" className="text-sm text-red-500">
          {error}
        </div>
      ) : !report ? (
        <div dir="rtl" className="text-sm text-gray-400">
          لا يوجد بيانات متاحة لهذا الأسبوع.
        </div>
      ) : (
        <div className="space-y-4">

          {/* Total summary */}
          <div dir="rtl" className="flex justify-between items-center border-b pb-3">
            <div>
              <h3 className="text-xs font-bold text-gray-500">إجمالي الأسبوع</h3>
              <p className="text-lg font-bold text-primary">
                {report.weekTotal} دقيقة
              </p>
            </div>
            <div className="text-left">
              <h3 className="text-xs font-bold text-gray-500">الحد اليومي</h3>
              <p className="text-sm text-gray-600">{report.dailyLimit} دقيقة</p>
            </div>
          </div>

          {/* Daily breakdown */}
          <div dir="rtl" className="space-y-2">
            {report.days.map((day, i) => {
              const percent = report.dailyLimit > 0
                ? Math.min(100, Math.round((day.minutes / report.dailyLimit) * 100))
                : 0;
              const dayName = DAY_NAMES_AR[new Date(day.date).getDay()];
              const isOverLimit = day.minutes >= report.dailyLimit;

              return (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>{dayName}</span>
                    <span className={isOverLimit ? "text-red-500 font-bold" : ""}>
                      {day.minutes} / {report.dailyLimit} دقيقة
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        isOverLimit ? "bg-red-500" : "bg-orange-500"
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}