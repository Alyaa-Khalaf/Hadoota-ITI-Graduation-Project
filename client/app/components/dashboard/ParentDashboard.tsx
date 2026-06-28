"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// ─── Types ──────────────────────────────────────────────

interface ChildOverview {
  _id: string;
  name: string;
  age: number;
  avatar: string;
  screenTimeToday: number;
  screenTimeLimit: number;
  totalPoints: number;
  level: number;
  streak: number;
  storiesCompleted: number;
  lastActivity: string | null;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: any[];
}

interface StoryAnalytics {
  dailyCounts?: { date: string; count: number }[];
  totalStories: number;
  averageDuration: number;
  completionRate: number;
}

interface TopicAnalytics {
  topicDistribution?: { topic: string; count: number; percentage: number }[];
  topTopic: string;
  totalTopicsExplored: number;
}

interface TimeAnalytics {
  dailyMinutes?: { date: string; minutes: number }[];
  totalMinutes: number;
  averageDailyMinutes: number;
  peakDay: string;
}

interface ProgressAnalytics {
  level: number;
  totalPoints: number;
  xpForNextLevel: number;
  currentXp: number;
  streak: { current: number; best: number };
  badges: { title: string; icon: string; unlockedAt: string }[];
}

// ─── Config ─────────────────────────────────────────────

const API_BASE = "http://localhost:5000/api";

const TOPIC_COLORS: Record<string, string> = {
  adventures: "#FF7043",
  animals: "#66BB6A",
  science: "#42A5F5",
  space: "#FFA726",
  religion: "#AB47BC",
  history: "#EF5350",
  nature: "#26A69A",
  sports: "#29B6F6",
  morals: "#EC407A",
  mysteries: "#7E57C2",
};

const TOPIC_LABELS: Record<string, string> = {
  adventures: "مغامرات",
  animals: "حيوانات",
  science: "علوم",
  space: "فضاء",
  religion: "دين",
  history: "تاريخ",
  nature: "طبيعة",
  sports: "رياضة",
  morals: "أخلاق",
  mysteries: "غموض",
};

function getToken(): string | null {
  return localStorage.getItem("accessToken") || localStorage.getItem("token");
}

// ─── Component ──────────────────────────────────────────

export default function ParentDashboard(_props: { className?: string }) {
  const [children, setChildren] = useState<ChildOverview[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  // Analytics
  const [storiesData, setStoriesData] = useState<StoryAnalytics | null>(null);
  const [topicsData, setTopicsData] = useState<TopicAnalytics | null>(null);
  const [timeData, setTimeData] = useState<TimeAnalytics | null>(null);
  const [progressData, setProgressData] = useState<ProgressAnalytics | null>(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);

  // ─── Fetch All Children ───────────────────────────────
  const fetchChildren = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const token = getToken();
      if (!token) {
        setError("يرجى تسجيل الدخول أولاً");
        setIsLoading(false);
        return;
      }

      const res = await fetch(`${API_BASE}/parent-agent/overview`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result: ApiResponse<{
        totalChildren: number;
        children: ChildOverview[];
      }> = await res.json();

      if (res.ok && result.success) {
        setChildren(result.data.children);
      } else {
        setError(result.message || "فشل في جلب بيانات الأطفال");
      }
    } catch {
      setError("حدث خطأ في الاتصال بالسيرفر");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ─── Fetch Analytics For Selected Child ───────────────
  const fetchAnalytics = useCallback(async (childId: string) => {
    if (childId === "all") {
      setStoriesData(null);
      setTopicsData(null);
      setTimeData(null);
      setProgressData(null);
      return;
    }

    setIsLoadingAnalytics(true);

    try {
      const token = getToken();
      if (!token) return;

      const headers = { Authorization: `Bearer ${token}` };

      const [storiesRes, topicsRes, timeRes, progressRes] = await Promise.all([
        fetch(`${API_BASE}/analytics/${childId}/stories?days=7`, { headers }),
        fetch(`${API_BASE}/analytics/${childId}/topics`, { headers }),
        fetch(`${API_BASE}/analytics/${childId}/time?days=7`, { headers }),
        fetch(`${API_BASE}/analytics/${childId}/progress`, { headers }),
      ]);

      const [s, t, tm, p] = await Promise.all([
        storiesRes.json(),
        topicsRes.json(),
        timeRes.json(),
        progressRes.json(),
      ]);

      if (storiesRes.ok && s.success) setStoriesData(s.data);
      if (topicsRes.ok && t.success) setTopicsData(t.data);
      if (timeRes.ok && tm.success) setTimeData(tm.data);
      if (progressRes.ok && p.success) setProgressData(p.data);
    } catch {
      // silent — charts will show empty state
    } finally {
      setIsLoadingAnalytics(false);
    }
  }, []);

  useEffect(() => {
    fetchChildren();
  }, [fetchChildren]);

  useEffect(() => {
    fetchAnalytics(selectedChildId);
  }, [selectedChildId, fetchAnalytics]);

  // ─── Derived ──────────────────────────────────────────
  const selectedChild = children.find((c) => c._id === selectedChildId);
  const totalStoriesAll = children.reduce((a, c) => a + c.storiesCompleted, 0);
  const avgLevel =
    children.length > 0
      ? (children.reduce((a, c) => a + c.level, 0) / children.length).toFixed(1)
      : "0";

  // ═══════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* ─── Header ─────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 text-lg">
              👨‍👩‍👧‍👦
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 sm:text-xl">
                لوحة تحكم الوالدين
              </h1>
              <p className="text-[11px] text-gray-500">تابع تقدم أطفالك وأنشطتهم</p>
            </div>
          </div>

          {/* Filter Dropdown */}
          <div className="flex items-center gap-2">
            <span className="hidden text-sm font-medium text-gray-600 sm:inline">
              اختر طفل:
            </span>
            <select
              value={selectedChildId}
              onChange={(e) => setSelectedChildId(e.target.value)}
              className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-bold shadow-sm focus:border-orange-400 focus:outline-none"
            >
              <option value="all">جميع الأطفال</option>
              {children.map((child) => (
                <option key={child._id} value={child._id}>
                  {child.name} ({child.age} سنة)
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl bg-red-50 p-4 text-center text-sm font-bold text-red-600">
            {error}
          </div>
        )}

        {/* Loading */}
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-2xl bg-gray-200" />
            ))}
          </div>
        ) : selectedChildId === "all" ? (
          /* ─── All Children Summary ───────────────── */
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            <StatCard label="إجمالي الأطفال" value={String(children.length)} icon="👶" bg="bg-orange-50" color="text-orange-600" />
            <StatCard label="إجمالي القصص" value={String(totalStoriesAll)} icon="📖" bg="bg-emerald-50" color="text-emerald-600" />
            <StatCard label="متوسط المستوى" value={avgLevel} icon="🏆" bg="bg-violet-50" color="text-violet-600" />
            <StatCard label="أطول سلسلة" value={`${Math.max(0, ...children.map((c) => c.streak))} يوم`} icon="🔥" bg="bg-rose-50" color="text-rose-600" />
          </div>
        ) : selectedChild ? (
          /* ─── Single Child Stats ─────────────────── */
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            <StatCard label="النقاط" value={String(selectedChild.totalPoints)} icon="⭐" bg="bg-amber-50" color="text-amber-600" />
            <StatCard label="المستوى" value={String(selectedChild.level)} icon="🏆" bg="bg-violet-50" color="text-violet-600" />
            <StatCard label="القصص المكتملة" value={String(selectedChild.storiesCompleted)} icon="📖" bg="bg-emerald-50" color="text-emerald-600" />
            <StatCard label="سلسلة الأيام" value={`${selectedChild.streak} يوم`} icon="🔥" bg="bg-rose-50" color="text-rose-600" />
          </div>
        ) : null}

        {/* ─── Content ─────────────────────────────── */}
        <div className="mt-6">
          {selectedChildId === "all" ? (
            /* ─── Children Cards Grid ──────────────── */
            <div>
              <h2 className="mb-4 text-base font-bold text-gray-800 sm:text-lg">جميع الأطفال</h2>
              {children.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white py-16 text-center">
                  <div className="text-5xl mb-3">👶</div>
                  <p className="text-sm font-medium text-gray-400">
                    لا يوجد أطفال مسجلين بعد. أضف طفلك الأول من صفحة إدارة الأطفال!
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {children.map((child) => (
                    <div
                      key={child._id}
                      onClick={() => setSelectedChildId(child._id)}
                      className="cursor-pointer rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                    >
                      {/* Avatar + Name */}
                      <div className="flex items-start gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-3xl">
                          {child.avatar}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-base font-bold text-gray-900">{child.name}</h3>
                          <p className="text-xs text-gray-500">{child.age} سنة</p>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-600">مستوى {child.level}</span>
                            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600">{child.storiesCompleted} قصة</span>
                            <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-600">{child.streak} يوم</span>
                          </div>
                        </div>
                      </div>

                      {/* Screen Time */}
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-[11px] font-medium text-gray-500">
                          <span>وقت الشاشة اليوم</span>
                          <span>{child.screenTimeToday} / {child.screenTimeLimit} دقيقة</span>
                        </div>
                        <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                          <div
                            className={`h-full rounded-full transition-all ${child.screenTimeToday >= child.screenTimeLimit * 0.8 ? "bg-rose-500" : "bg-emerald-500"}`}
                            style={{ width: `${Math.min(100, (child.screenTimeToday / child.screenTimeLimit) * 100)}%` }}
                          />
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <p className="text-[10px] text-gray-400">
                          {child.lastActivity
                            ? `آخر نشاط: ${new Date(child.lastActivity).toLocaleDateString("ar-EG")}`
                            : "لا يوجد نشاط بعد"}
                        </p>
                        <span className="text-[11px] font-semibold text-orange-500">عرض التفاصيل ←</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* ─── Single Child: Tabs + Charts ───────── */
            <div>
              {/* Tabs */}
              <div className="mb-4 flex flex-wrap gap-2 rounded-xl bg-gray-100 p-1.5">
                {[
                  { key: "overview", label: "نظرة عامة" },
                  { key: "stories", label: "القصص" },
                  { key: "topics", label: "المواضيع" },
                  { key: "time", label: "الوقت" },
                  { key: "progress", label: "التقدم" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`rounded-lg px-4 py-2 text-sm font-bold transition-all ${
                      activeTab === tab.key
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {isLoadingAnalytics ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-sm font-bold text-gray-400 animate-pulse">جاري تحميل البيانات...</div>
                </div>
              ) : (
                <>
                  {activeTab === "overview" && selectedChild && (
                    <OverviewTab child={selectedChild} storiesData={storiesData} progressData={progressData} />
                  )}
                  {activeTab === "stories" && (
                    <StoriesTab data={storiesData} />
                  )}
                  {activeTab === "topics" && (
                    <TopicsTab data={topicsData} />
                  )}
                  {activeTab === "time" && (
                    <TimeTab data={timeData} />
                  )}
                  {activeTab === "progress" && (
                    <ProgressTab data={progressData} />
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════

function StatCard({ label, value, icon, bg, color }: { label: string; value: string; icon: string; bg: string; color: string }) {
  return (
    <div className={`rounded-2xl border-0 ${bg} p-4 shadow-sm`}>
      <div className="flex items-center gap-3">
        <div className={`text-2xl ${color}`}>{icon}</div>
        <div>
          <p className="text-[11px] font-medium text-gray-500">{label}</p>
          <p className="text-xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <p className="text-4xl mb-3">📊</p>
      <p className="text-sm font-medium text-gray-400">{message}</p>
    </div>
  );
}

function ChartCard({ title, subtitle, children: content, className }: { title: string; subtitle?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-gray-100 bg-white p-5 shadow-sm ${className ?? ""}`}>
      <div className="mb-4">
        <h3 className="text-sm font-bold text-gray-800">{title}</h3>
        {subtitle && <p className="text-[11px] text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      {content}
    </div>
  );
}

// ─── Overview Tab ────────────────────────────────────────

function OverviewTab({ child, storiesData, progressData }: { child: ChildOverview; storiesData: StoryAnalytics | null; progressData: ProgressAnalytics | null }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* Child Info */}
      <ChartCard title={`${child.name} — المعلومات الأساسية`}>
        <div className="grid grid-cols-2 gap-3">
          <InfoBox label="العمر" value={`${child.age} سنة`} />
          <InfoBox label="المستوى" value={`المستوى ${child.level}`} />
          <InfoBox label="النقاط" value={String(child.totalPoints)} />
          <InfoBox label="سلسلة الأيام" value={`${child.streak} يوم`} />
          <InfoBox label="القصص المكتملة" value={String(child.storiesCompleted)} />
          <InfoBox label="وقت الشاشة" value={`${child.screenTimeToday}/${child.screenTimeLimit} دقيقة`} />
        </div>
      </ChartCard>

      {/* Quick Stats */}
      <ChartCard title="إحصائيات سريعة">
        <div className="space-y-3">
          <StatRow label="معدل إكمال القصص" value={`${storiesData?.completionRate ?? 0}%`} bg="bg-emerald-50" color="text-emerald-600" />
          <StatRow label="متوسط مدة القراءة" value={`${storiesData?.averageDuration ?? 0} دقيقة`} bg="bg-amber-50" color="text-amber-600" />
          <StatRow label="أفضل سلسلة (أيام)" value={String(progressData?.streak?.best ?? 0)} bg="bg-violet-50" color="text-violet-600" />
        </div>
      </ChartCard>

      {/* Weekly Stories Chart */}
      <ChartCard title="القصص المقروءة هذا الأسبوع" className="lg:col-span-2">
        {storiesData?.dailyCounts && storiesData.dailyCounts.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={storiesData.dailyCounts} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" allowDecimals={false} />
              <YAxis dataKey="date" type="category" width={50} tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: "12px" }}
              />
              <Bar dataKey="count" fill="#FF7043" radius={[0, 6, 6, 0]} name="عدد القصص" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState message="لا توجد بيانات قصص كافية لعرض المخطط" />
        )}
      </ChartCard>
    </div>
  );
}

// ─── Stories Tab ─────────────────────────────────────────

function StoriesTab({ data }: { data: StoryAnalytics | null }) {
  if (!data) return <EmptyState message="لا توجد بيانات قصص متاحة" />;

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <ChartCard
        title="عدد القصص يومياً"
        subtitle={`إجمالي: ${data.totalStories} قصة | معدل الإكمال: ${data.completionRate}%`}
        className="lg:col-span-2"
      >
        {data.dailyCounts && data.dailyCounts.length > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.dailyCounts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: "12px" }} />
              <Bar dataKey="count" fill="#66BB6A" radius={[6, 6, 0, 0]} name="عدد القصص" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState message="لا توجد بيانات كافية" />
        )}
      </ChartCard>

      <ChartCard title="ملخص القصص">
        <div className="space-y-3">
          <div className="rounded-xl bg-emerald-50 p-4 text-center">
            <p className="text-3xl font-bold text-emerald-600">{data.totalStories}</p>
            <p className="text-xs font-medium text-emerald-700 mt-1">إجمالي القصص</p>
          </div>
          <div className="rounded-xl bg-amber-50 p-4 text-center">
            <p className="text-3xl font-bold text-amber-600">{data.averageDuration}</p>
            <p className="text-xs font-medium text-amber-700 mt-1">متوسط المدة (دقيقة)</p>
          </div>
          <div className="rounded-xl bg-violet-50 p-4 text-center">
            <p className="text-3xl font-bold text-violet-600">{data.completionRate}%</p>
            <p className="text-xs font-medium text-violet-700 mt-1">معدل الإكمال</p>
          </div>
        </div>
      </ChartCard>
    </div>
  );
}

// ─── Topics Tab ──────────────────────────────────────────

function TopicsTab({ data }: { data: TopicAnalytics | null }) {
  if (!data) return <EmptyState message="لا توجد بيانات مواضيع متاحة" />;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ChartCard
        title="توزيع المواضيع"
        subtitle={`${data.totalTopicsExplored} مواضيع تم استكشافها`}
      >
        {data.topicDistribution && data.topicDistribution.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.topicDistribution}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={100}
                dataKey="count"
                nameKey="topic"
                paddingAngle={2}
              >
                {data.topicDistribution.map((entry, index) => (
                  <Cell key={index} fill={TOPIC_COLORS[entry.topic] || "#999"} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any, name: any) => [`${value} قصة`, TOPIC_LABELS[String(name)] || String(name)]}
                contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: "12px" }}
              />
              <Legend
                formatter={(value) => TOPIC_LABELS[String(value)] || String(value)}
                wrapperStyle={{ fontSize: "11px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState message="لا توجد بيانات كافية" />
        )}
      </ChartCard>

      <ChartCard title="تفاصيل المواضيع">
        <div className="max-h-80 space-y-2 overflow-y-auto">
          {(data.topicDistribution || [])
            .sort((a, b) => b.count - a.count)
            .map((topic) => (
              <div key={topic.topic} className="flex items-center justify-between rounded-xl bg-gray-50 p-3">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: TOPIC_COLORS[topic.topic] || "#999" }} />
                  <span className="text-sm font-medium text-gray-700">
                    {TOPIC_LABELS[topic.topic] || topic.topic}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-900">{topic.count} قصة</span>
                  <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-gray-500 border">
                    {topic.percentage}%
                  </span>
                </div>
              </div>
            ))}
        </div>
        {data.topTopic && (
          <div className="mt-4 rounded-xl bg-amber-50 p-3 text-center">
            <p className="text-xs text-amber-600">الموضوع المفضل</p>
            <p className="text-lg font-bold text-amber-700">{TOPIC_LABELS[data.topTopic] || data.topTopic}</p>
          </div>
        )}
      </ChartCard>
    </div>
  );
}

// ─── Time Tab ────────────────────────────────────────────

function TimeTab({ data }: { data: TimeAnalytics | null }) {
  if (!data) return <EmptyState message="لا توجد بيانات وقت متاحة" />;

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <ChartCard
        title="وقت القراءة اليومي (دقائق)"
        subtitle={`المتوسط: ${data.averageDailyMinutes} دقيقة/يوم`}
        className="lg:col-span-2"
      >
        {data.dailyMinutes && data.dailyMinutes.length > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data.dailyMinutes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: "12px" }} />
              <Line type="monotone" dataKey="minutes" stroke="#66BB6A" strokeWidth={2.5} dot={{ r: 4, fill: "#66BB6A" }} activeDot={{ r: 6 }} name="دقائق القراءة" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState message="لا توجد بيانات كافية" />
        )}
      </ChartCard>

      <ChartCard title="ملخص الوقت">
        <div className="space-y-3">
          <div className="rounded-xl bg-emerald-50 p-4 text-center">
            <p className="text-3xl font-bold text-emerald-600">{data.totalMinutes}</p>
            <p className="text-xs font-medium text-emerald-700 mt-1">إجمالي الدقائق (7 أيام)</p>
          </div>
          <div className="rounded-xl bg-blue-50 p-4 text-center">
            <p className="text-3xl font-bold text-blue-600">{data.averageDailyMinutes}</p>
            <p className="text-xs font-medium text-blue-700 mt-1">المتوسط اليومي (دقيقة)</p>
          </div>
          <div className="rounded-xl bg-rose-50 p-4 text-center">
            <p className="text-sm font-bold text-rose-600">{data.peakDay}</p>
            <p className="text-xs font-medium text-rose-700 mt-1">أكثر يوم نشاطاً</p>
          </div>
        </div>
      </ChartCard>
    </div>
  );
}

// ─── Progress Tab ────────────────────────────────────────

function ProgressTab({ data }: { data: ProgressAnalytics | null }) {
  if (!data) return <EmptyState message="لا توجد بيانات تقدم متاحة" />;

  const xpPercent = data.xpForNextLevel > 0 ? Math.round((data.currentXp / data.xpForNextLevel) * 100) : 0;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* Level & XP */}
      <ChartCard title="المستوى والنقاط">
        <div className="space-y-6">
          <div className="text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-purple-600 text-4xl font-bold text-white shadow-lg">
              {data.level}
            </div>
            <p className="mt-2 text-sm font-medium text-gray-600">المستوى الحالي</p>
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="font-medium text-gray-700">التقدم للمستوى التالي</span>
              <span className="font-bold text-violet-600">{data.currentXp} / {data.xpForNextLevel} XP</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
              <div className="h-full rounded-full bg-gradient-to-l from-violet-500 to-purple-500 transition-all" style={{ width: `${xpPercent}%` }} />
            </div>
            <p className="mt-1 text-center text-xs text-gray-400">{xpPercent}%</p>
          </div>

          <div className="rounded-xl bg-amber-50 p-4 text-center">
            <p className="text-3xl font-bold text-amber-600">{data.totalPoints}</p>
            <p className="text-xs font-medium text-amber-700 mt-1">إجمالي النقاط</p>
          </div>
        </div>
      </ChartCard>

      {/* Streak & Badges */}
      <ChartCard title="السلسلة والأوسمة">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-rose-50 p-4 text-center">
              <p className="text-2xl">🔥</p>
              <p className="mt-1 text-2xl font-bold text-rose-600">{data.streak.current}</p>
              <p className="text-[11px] font-medium text-rose-700">سلسلة حالية (أيام)</p>
            </div>
            <div className="rounded-xl bg-orange-50 p-4 text-center">
              <p className="text-2xl">🔥</p>
              <p className="mt-1 text-2xl font-bold text-orange-600">{data.streak.best}</p>
              <p className="text-[11px] font-medium text-orange-700">أفضل سلسلة (أيام)</p>
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-bold text-gray-700">الأوسمة المحصلة</p>
            {data.badges && data.badges.length > 0 ? (
              <div className="max-h-48 space-y-2 overflow-y-auto">
                {data.badges.map((badge, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
                    <span className="text-2xl">{badge.icon}</span>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{badge.title}</p>
                      <p className="text-[10px] text-gray-400">
                        {new Date(badge.unlockedAt).toLocaleDateString("ar-EG")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">لم يتم الحصول على أوسمة بعد</p>
            )}
          </div>
        </div>
      </ChartCard>
    </div>
  );
}

// ─── Tiny Helpers ────────────────────────────────────────

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-gray-50 p-3 text-center">
      <p className="text-[11px] font-medium text-gray-500">{label}</p>
      <p className="text-sm font-bold text-gray-900">{value}</p>
    </div>
  );
}

function StatRow({ label, value, bg, color }: { label: string; value: string; bg: string; color: string }) {
  return (
    <div className={`flex items-center justify-between rounded-xl ${bg} p-3`}>
      <span className={`text-sm font-medium ${color}`}>{label}</span>
      <span className={`text-lg font-bold ${color}`}>{value}</span>
    </div>
  );
}