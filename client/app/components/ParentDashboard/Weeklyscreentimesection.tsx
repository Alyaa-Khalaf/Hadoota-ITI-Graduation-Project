"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

type TodayScreenTime = {
  allowed: boolean;
  remaining: number;
  today: number;
  limit: number;
  sessionActive: boolean;
};

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

type Mode = "today" | "week";

export default function WeeklyScreenTimeSection({ childId }: Props) {
  const { accessToken } = useAuth();

  const [mode, setMode] = useState<Mode>("today");
  const [today, setToday] = useState<TodayScreenTime | null>(null);
  const [week, setWeek] = useState<WeeklyScreenTime | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchToday = async () => {
    if (!childId || !accessToken) return;
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE}/api/screentime/${childId}/today`, {
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
      console.error("Today screen time error:", err);
      setToday(null);
      setError("حصل خطأ في الاتصال بالسيرفر");
    } finally {
      setLoading(false);
    }
  };

  const fetchWeek = async () => {
    if (!childId || !accessToken) return;
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE}/api/screentime/${childId}/week`, {
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
      console.error("Weekly screen time error:", err);
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

  // 📌 reload when child or mode changes
  useEffect(() => {
    if (childId) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [childId, accessToken, mode]);

  if (!childId) {
    return (
      <div dir="rtl" className="text-sm text-gray-400 p-4">
        اختر طفلاً لعرض تقرير وقت الشاشة
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border p-5 space-y-4">

      {/* Header + Toggle */}
      <div dir="rtl" className="flex justify-between items-center">
        <h2 className="font-bold text-sm">تقرير وقت الشاشة</h2>

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

      {/* Error */}
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
          <div dir="rtl" className="space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xs font-bold text-gray-500">الاستخدام النهاردة</h3>
                <p className="text-lg font-bold text-primary">
                  {today.today} / {today.limit} دقيقة
                </p>
              </div>
              {today.sessionActive && (
                <span className="text-xs px-2 py-1 bg-green-50 text-green-600 rounded-md">
                  جلسة شغالة الآن
                </span>
              )}
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  today.allowed ? "bg-primary" : "bg-red-500"
                }`}
                style={{
                  width: `${Math.min(100, Math.round((today.today / (today.limit || 1)) * 100))}%`,
                }}
              />
            </div>
            {!today.allowed && (
              <p className="text-xs text-red-500">خلص وقت الشاشة المسموح النهارده</p>
            )}
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
            <div dir="rtl" className="flex justify-between items-center border-b pb-3">
              <div>
                <h3 className="text-xs font-bold text-gray-500">إجمالي الأسبوع</h3>
                <p className="text-lg font-bold text-primary">{week.weekTotal} دقيقة</p>
              </div>
              <div className="text-left">
                <h3 className="text-xs font-bold text-gray-500">الحد اليومي</h3>
                <p className="text-sm text-gray-600">{week.dailyLimit} دقيقة</p>
              </div>
            </div>

            <div dir="rtl" className="space-y-2">
              {week.days.map((day, i) => {
                const percent = week.dailyLimit > 0
                  ? Math.min(100, Math.round((day.minutes / week.dailyLimit) * 100))
                  : 0;
                const dayName = DAY_NAMES_AR[new Date(day.date).getDay()];
                const isOverLimit = day.minutes >= week.dailyLimit;

                return (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>{dayName}</span>
                      <span className={isOverLimit ? "text-red-500 font-bold" : ""}>
                        {day.minutes} / {week.dailyLimit} دقيقة
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${isOverLimit ? "bg-red-500" : "bg-primary"}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
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