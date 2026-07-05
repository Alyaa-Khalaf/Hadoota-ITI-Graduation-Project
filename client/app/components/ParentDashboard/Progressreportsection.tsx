"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

type TodayProgress = {
  date: string;
  points: number;
  totalPoints: number;
  level: number;
};

type DayEntry = {
  date: string;
  points: number;
};

type WeeklyProgress = {
  weekStart: string;
  weekTotal: number;
  days: DayEntry[];
};

type Props = {
  childId: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const DAY_NAMES_AR = ["أحد", "اتنين", "تلات", "أربع", "خميس", "جمعة", "سبت"];

type Mode = "today" | "week";

export default function ProgressReportSection({ childId }: Props) {
  const { accessToken } = useAuth();

  const [mode, setMode] = useState<Mode>("today");
  const [today, setToday] = useState<TodayProgress | null>(null);
  const [week, setWeek] = useState<WeeklyProgress | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchToday = async () => {
    if (!childId || !accessToken) return;
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE}/api/progress/${childId}/today`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      if (data?.success) {
        setToday(data.data);
      } else {
        setToday(null);
        setError(data?.message || "حصل خطأ في جلب البيانات");
      }
    } catch (err) {
      console.error("Today progress error:", err);
      setToday(null);
      setError("حصل خطأ في الاتصال بالسيرفر");
    } finally {
      setLoading(false);
    }
  };

  // الراوت الحقيقي: /api/progress/:childId/weekly
  const fetchWeek = async () => {
    if (!childId || !accessToken) return;
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE}/api/progress/${childId}/weekly`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      if (data?.success) {
        setWeek(data.data);
      } else {
        setWeek(null);
        setError(data?.message || "حصل خطأ في جلب التقرير");
      }
    } catch (err) {
      console.error("Weekly progress error:", err);
      setWeek(null);
      setError("حصل خطأ في الاتصال بالسيرفر");
    } finally {
      setLoading(false);
    }
  };

  const fetchData = () => {
    if (mode === "today") fetchToday();
    else fetchWeek();
  };

  useEffect(() => {
    if (childId) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [childId, accessToken, mode]);

  if (!childId) {
    return (
      <div dir="rtl" className="text-sm text-gray-400 p-4">
        اختر طفلاً لعرض تقرير النقاط
      </div>
    );
  }

  const maxPoints = week ? Math.max(1, ...week.days.map((d) => d.points || 0)) : 1;

  return (
    <div className="bg-white rounded-xl border p-5 space-y-4">
      {/* Header + Toggle */}
      <div dir="rtl" className="flex justify-between items-center">
        <h2 className="font-bold text-sm">تقرير النقاط</h2>

        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 rounded-md p-0.5 text-xs">
            <button
              onClick={() => setMode("today")}
              className={`px-3 py-1 rounded-md transition-colors ${
                mode === "today" ? "bg-primary text-white" : "text-gray-500"
              }`}
            >
              اليوم
            </button>
            <button
              onClick={() => setMode("week")}
              className={`px-3 py-1 rounded-md transition-colors ${
                mode === "week" ? "bg-primary text-white" : "text-gray-500"
              }`}
            >
              الأسبوع
            </button>
          </div>

          <button
            onClick={fetchData}
            disabled={loading}
            className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-md"
          >
            {loading ? "..." : "تحديث"}
          </button>
        </div>
      </div>

      {error && (
        <div dir="rtl" className="text-sm text-red-500">
          {error}
        </div>
      )}

      {/* Today view */}
      {mode === "today" && (
        loading && !today ? (
          <div dir="rtl" className="text-sm text-gray-500 animate-pulse">
            جارٍ تحميل البيانات...
          </div>
        ) : !today ? (
          !error && (
            <div dir="rtl" className="text-sm text-gray-400">
              لا يوجد بيانات متاحة.
            </div>
          )
        ) : (
          <div dir="rtl" className="grid grid-cols-2 gap-3">
            <div className="border rounded-lg p-3">
              <h3 className="text-xs font-bold text-gray-500">نقاط النهاردة</h3>
              <p className="text-lg font-bold text-primary">{today.points}</p>
            </div>
            <div className="border rounded-lg p-3">
              <h3 className="text-xs font-bold text-gray-500">المستوى الحالي</h3>
              <p className="text-lg font-bold text-primary">{today.level}</p>
            </div>
            <div className="border rounded-lg p-3 col-span-2">
              <h3 className="text-xs font-bold text-gray-500">إجمالي النقاط الكلي</h3>
              <p className="text-lg font-bold text-gray-700">{today.totalPoints}</p>
            </div>
          </div>
        )
      )}

      {/* Weekly view */}
      {mode === "week" && (
        loading && !week ? (
          <div dir="rtl" className="text-sm text-gray-500 animate-pulse">
            جارٍ تحميل التقرير...
          </div>
        ) : !week ? (
          !error && (
            <div dir="rtl" className="text-sm text-gray-400">
              لا يوجد بيانات متاحة لهذا الأسبوع.
            </div>
          )
        ) : (
          <div className="space-y-4">
            <div dir="rtl" className="border-b pb-3">
              <h3 className="text-xs font-bold text-gray-500">إجمالي نقاط الأسبوع</h3>
              <p className="text-lg font-bold text-primary">{week.weekTotal} نقطة</p>
            </div>

            <div dir="rtl" className="flex items-end justify-between gap-2 h-40 pt-2">
              {week.days.map((d, i) => {
                const heightPercent = maxPoints > 0
                  ? Math.max(4, Math.round((d.points / maxPoints) * 100))
                  : 4;
                const dayName = DAY_NAMES_AR[new Date(d.date).getDay()];

                return (
                  <div key={i} className="flex flex-col items-center flex-1 h-full justify-end">
                    <span className="text-[10px] text-gray-500 mb-1">{d.points}</span>
                    <div className="w-full flex items-end justify-center h-full">
                      <div
                        className="w-3/4 rounded-t-md bg-primary transition-all"
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-gray-600 mt-1">{dayName}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )
      )}
    </div>
  );
}