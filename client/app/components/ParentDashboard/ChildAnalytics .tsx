"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useAuth } from "@/context/AuthContext";

type WeeklyActivity = {
  name: string;
  stories: number;
};

type TopicDistribution = {
  name: string;
  value: number;
  color?: string;
};

type Props = {
  childId: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E2"];

export default function ChildAnalytics({ childId }: Props) {
  const { accessToken } = useAuth();

  const [weeklyActivity, setWeeklyActivity] = useState<WeeklyActivity[]>([]);
  const [topics, setTopics] = useState<TopicDistribution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ⚠️ flag محلي لكل نداء على الـ effect، عشان نعرف لو الطفل تغيّر
    // قبل ما الطلب القديم يخلص، نتجاهل رد الطلب القديم بدل ما نكتب فوق
    // البيانات الصحيحة للطفل الجديد.
    let isStale = false;

    // نصفّر البيانات القديمة فورًا عشان منعرضش بيانات طفل غلط
    // أثناء تحميل بيانات الطفل الجديد.
    setWeeklyActivity([]);
    setTopics([]);

    if (!childId || !accessToken) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        // 📊 Weekly Activity
        const weeklyRes = await fetch(
          `${API_BASE}/api/analytics/${childId}/stories?period=weekly&days=7`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const weeklyData = await weeklyRes.json();

        // لو الطفل المختار تغيّر وإحنا لسه مستنيين الرد ده، اتجاهله بالكامل
        if (isStale) return;

        const weeklyChart = (weeklyData?.data?.chart || []).map((item: any) => ({
          name: item.week || item.date || "N/A",
          stories: item.count || 0,
        }));
        setWeeklyActivity(weeklyChart);

        // 🧠 Topics
        const topicsRes = await fetch(
          `${API_BASE}/api/analytics/${childId}/topics`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const topicsData = await topicsRes.json();

        if (isStale) return;

        const topicsArray = (topicsData?.data?.topics || []).map((item: any, index: number) => ({
          name: item.topic || "general",
          value: item.count || 0,
          color: COLORS[index % COLORS.length],
        }));
        setTopics(topicsArray);
      } catch (err) {
        if (!isStale) {
          console.error("Analytics error:", err);
        }
      } finally {
        if (!isStale) {
          setLoading(false);
        }
      }
    };

    fetchData();

    // 🧹 cleanup: لو الكومبوننت اعمل re-render بسبب تغيير childId
    // قبل ما الطلب يخلص، نعلّم الطلب القديم إنه "stale" عشان رده يتجاهل.
    return () => {
      isStale = true;
    };
  }, [childId, accessToken]);

  if (!childId) {
    return (
      <div dir="rtl" className="p-4 text-sm text-gray-400">
        اختر طفلاً لعرض التحليلات
      </div>
    );
  }

  if (loading) {
    return (
      <div dir="rtl" className="p-4 text-sm text-gray-500 animate-pulse">
        جارٍ تحميل البيانات...
      </div>
    );
  }

  return (
    <div dir="rtl" className="grid grid-cols-1 md:grid-cols-2 gap-6">

      {/* 📈 Weekly Chart */}
      <div className="h-80 bg-white rounded-xl p-4 border">
        <h3 className="text-sm font-bold mb-3">
          نشاط القراءة الأسبوعي
        </h3>

        {weeklyActivity.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-gray-400">
            لا توجد بيانات كافية لعرض الرسم البياني
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyActivity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="stories"
                stroke="#FF7043"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* 🥧 Topics Chart */}
      <div className="h-80 bg-white rounded-xl p-4 border">
        <h3 className="text-sm font-bold mb-3">
          توزيع المواضيع
        </h3>

        {topics.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-gray-400">
            لا توجد بيانات كافية لعرض الرسم البياني
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={topics}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
                label
              >
                {topics.map((t, i) => (
                  <Cell key={i} fill={t.color || "#8884d8"} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

    </div>
  );
}