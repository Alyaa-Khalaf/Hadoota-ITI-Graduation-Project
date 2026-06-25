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
import { Star, Trophy, Award, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useGamification } from "@/hooks/useGamification";

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

// 🏷️ ترجمة أسباب المكافآت الشائعة للعربية (مع fallback للنص الإنجليزي لو السبب مش متوقع)
const REASON_LABELS: Record<string, string> = {
  "Quiz Game Reward": "مكافأة اختبار",
  "Speed Reaction Game": "لعبة سرعة البديهة",
  "Memory Game": "لعبة الذاكرة",
};

export default function ChildAnalytics({ childId }: Props) {
  const { accessToken } = useAuth();

  const [weeklyActivity, setWeeklyActivity] = useState<WeeklyActivity[]>([]);
  const [topics, setTopics] = useState<TopicDistribution[]>([]);
  const [loading, setLoading] = useState(true);

  const { gamification, loading: gamificationLoading } = useGamification(childId);

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
      <div dir="rtl" className="p-4 text-sm text-ink-muted">
        اختر طفلاً لعرض التحليلات
      </div>
    );
  }

  if (loading) {
    return (
      <div dir="rtl" className="p-4 text-sm text-ink-muted animate-pulse">
        جارٍ تحميل البيانات...
      </div>
    );
  }

  // آخر 5 مكافآت، الأحدث أولًا
  const recentRewards = gamification?.rewardHistory
    ? [...gamification.rewardHistory]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 5)
    : [];

  return (
    <div dir="rtl" className="space-y-6">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* 📈 Weekly Chart */}
        <div className="h-80 bg-white rounded-2xl p-4 border border-border-warm shadow-sm">
          <h3 className="text-sm font-bold mb-3 text-ink">
            نشاط القراءة الأسبوعي
          </h3>

          {weeklyActivity.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center gap-2 text-center">
              <div className="w-12 h-12 rounded-2xl bg-cat-adventure flex items-center justify-center text-2xl">
                📖
              </div>
              <p className="text-xs font-bold text-ink">
                لا توجد قصص مقروءة هذا الأسبوع
              </p>
              <p className="text-[11px] text-ink-muted max-w-[200px]">
                شجّع طفلك على قراءة أول قصة ليبدأ ظهور نشاطه هنا
              </p>
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
        <div className="h-80 bg-white rounded-2xl p-4 border border-border-warm shadow-sm">
          <h3 className="text-sm font-bold mb-3 text-ink">
            توزيع المواضيع
          </h3>

          {topics.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center gap-2 text-center">
              <div className="w-12 h-12 rounded-2xl bg-cat-magic flex items-center justify-center text-2xl">
                🧩
              </div>
              <p className="text-xs font-bold text-ink">
                لا توجد مواضيع مسجّلة بعد
              </p>
              <p className="text-[11px] text-ink-muted max-w-[200px]">
                توزيع المواضيع سيظهر هنا بعد قراءة بعض القصص
              </p>
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

      {/* 🏆 Gamification Section */}
      {gamificationLoading ? (
        <div className="h-40 bg-white rounded-2xl border border-border-warm animate-pulse" />
      ) : !gamification ? (
        <div className="p-4 text-sm text-ink-muted bg-white rounded-2xl border border-border-warm text-center">
          لا توجد بيانات إنجازات لهذا الطفل بعد
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-border-warm shadow-sm p-5 space-y-5">

          <h3 className="text-sm font-bold text-ink">الإنجازات والمكافآت</h3>

          {/* Stat cards: stars / level / badges */}
          <div className="grid grid-cols-3 gap-3">

            <div className="rounded-2xl bg-cat-magic p-4 text-center space-y-1">
              <div className="w-9 h-9 mx-auto rounded-xl bg-sunny/70 flex items-center justify-center">
                <Star size={18} className="text-ink" fill="currentColor" />
              </div>
              <p className="text-lg font-bold text-ink">{gamification.stars}</p>
              <p className="text-[11px] text-ink-muted">نجمة</p>
            </div>

            <div className="rounded-2xl bg-cat-adventure p-4 text-center space-y-1">
              <div className="w-9 h-9 mx-auto rounded-xl bg-sky/70 flex items-center justify-center">
                <Trophy size={18} className="text-ink" />
              </div>
              <p className="text-lg font-bold text-ink">{gamification.level}</p>
              <p className="text-[11px] text-ink-muted">المستوى</p>
            </div>

            <div className="rounded-2xl bg-cat-family p-4 text-center space-y-1">
              <div className="w-9 h-9 mx-auto rounded-xl bg-blossom/70 flex items-center justify-center">
                <Award size={18} className="text-ink" />
              </div>
              <p className="text-lg font-bold text-ink">
                {gamification.badges?.length || 0}
              </p>
              <p className="text-[11px] text-ink-muted">شارة</p>
            </div>
          </div>

          {/* Recent rewards */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-ink-muted">آخر المكافآت</h4>

            {recentRewards.length === 0 ? (
              <p className="text-xs text-ink-muted">لا يوجد سجل مكافآت بعد</p>
            ) : (
              <ul className="space-y-2">
                {recentRewards.map((reward) => (
                  <li
                    key={reward._id}
                    className="flex items-center justify-between gap-3 bg-page-warm rounded-xl px-3 py-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Sparkles size={14} className="text-primary shrink-0" />
                      <span className="text-xs text-ink truncate">
                        {REASON_LABELS[reward.reason] || reward.reason}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-bold text-primary flex items-center gap-1">
                        <Star size={11} fill="currentColor" />
                        +{reward.amount}
                      </span>
                      <span className="text-[10px] text-ink-muted">
                        {new Date(reward.createdAt).toLocaleDateString("ar-EG")}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}