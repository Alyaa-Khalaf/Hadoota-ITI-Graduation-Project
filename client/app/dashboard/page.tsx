"use client";

import React, { useState, useEffect } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { 
  BookOpen, Clock, Brain, Shield, Sliders, Bell, 
  Download, LogOut, Sparkles 
} from "lucide-react";

// --- استدعاء الألوان الحقيقية من ملف الـ Tailwind Config الخاص بكِ ---
const COLOR_PRIMARY = "#FF7043"; // 'primary'
const COLOR_MAGIC = "#C77DFF";   // 'magic' (البنفسجي السحري)
const COLOR_SKY = "#4D96FF";     // 'sky'
const COLOR_MEADOW = "#6BCB77";  // 'meadow'

const STORY_CAT_COLORS = ["#E8D0FD", "#D0F0FD", "#FDE8D0", "#D0FDE8"]; // cat-magic, cat-adventure, cat-animals, cat-nature

interface ActivityData {
  name: string;
  minutes: number;
}

interface TopicData {
  name: string;
  value: number;
}

interface StoryHistoryItem {
  id: number;
  title: string;
  date: string;
  stars: number;
}

interface DashboardStats {
  totalStoriesRead: number;
  totalMinutesWatched: number;
}

interface NotificationItem {
  id: number;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function ParentDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview"); 
  const [safeMode, setSafeMode] = useState(true);
  const [screenTime, setScreenTime] = useState(60);
  const [selectedTopics, setSelectedTopics] = useState({
    morals: true,
    arabic: true,
    science: false,
    history: false
  });

  // STATES مخصصة للتحكم الحركي في التنبيهات البريدية
  const [emailDigest, setEmailDigest] = useState(true);
  const [bedtimeReminder, setBedtimeReminder] = useState(true);
  const [screenTimeAlert, setScreenTimeAlert] = useState(true);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // STATES لتخزين البيانات الحقيقية القادمة من الـ APIs
  const [loading, setLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalStoriesRead: 0,
    totalMinutesWatched: 0
  });

  const [weeklyActivityData, setWeeklyActivityData] = useState<ActivityData[]>([]);
  const [topicsData, setTopicsData] = useState<TopicData[]>([]);
  const [storiesHistory, setStoriesHistory] = useState<StoryHistoryItem[]>([]);
  const [aiSummary, setAiSummary] = useState<string>("جاري تحميل التقرير الذكي...");

  // الإشعارات والتنبيهات
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  // 🏃‍♀️ EFFECT لجلب البيانات فور تحميل الصفحة بناءً على توكن الأب والـ parentId الحقيقي
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          console.error("لا يوجد توكن! يرجى تسجيل الدخول أولاً.");
          setLoading(false);
          return;
        }

        // 1️⃣ خطوة إلزامية أولى: جلب ملف بروفايل الأب لاستخراج الـ parentId الحقيقي ديناميكياً
        const profileRes = await fetch("http://localhost:5000/api/users/profile", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const profileResult = await profileRes.json();
        
        // استخراج الـ ID بناءً على صياغة الـ Response المعتادة
        const parentId = profileResult.data?._id || profileResult._id;

        if (!parentId) {
          console.error("لم يتم العثور على parentId في حسابك");
          setLoading(false);
          return;
        }

        // 2️⃣ [ربط نورهان - Analytics]: جلب بيانات الـ Dashboard العامة باستخدام الـ parentId الحقيقي
        const dashboardRes = await fetch(`http://localhost:5000/api/analytics/dashboard/${parentId}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const dashboardResult = await dashboardRes.json();

        if (dashboardRes.ok && dashboardResult.success) { 
          // تحديث الـ Stats بناءً على الهيكلة والمخرجات الحقيقية لنورهان
          setStats({
            totalStoriesRead: dashboardResult.data?.totalStoriesRead || 0,
            totalMinutesWatched: dashboardResult.data?.totalMinutesWatched || 0
          });
        }

        // 3️⃣ [ربط هند - التقرير الذكي بالذكاء الاصطناعي]
        // بمجرد أن تنهي هند الـ API، قومي بإزالة علامات الـ // من الأسطر الأربعة التالية وحذف السطر الافتراضي بالأسفل:
        // const aiRes = await fetch("http://localhost:5000/api/parent-agent/summary", {
        //   headers: { "Authorization": `Bearer ${token}` }
        // });
        // const aiData = await aiRes.json();
        // if (aiRes.ok) { setAiSummary(aiData.summary); }

        // --- الاحتفاظ ببيانات الرسوم البيانية المؤقتة لحين تحديد طفل معين (childId) لطلب مساراته الفرعية ---
        setWeeklyActivityData([
          { name: "الأحد", minutes: 0 }, { name: "الإثنين", minutes: 0 }, { name: "الثلاثاء", minutes: 0 },
          { name: "الأربعاء", minutes: 0 }, { name: "الخميس", minutes: 0 }, { name: "الجمعة", minutes: 0 }, { name: "السبت", minutes: 0 },
        ]);
        setTopicsData([
          { name: "مغامرات وعجائب", value: 40 }, { name: "عالم الحيوان", value: 30 }, { name: "قصص سحرية", value: 15 }, { name: "الطبيعة والبيئة", value: 15 },
        ]);
        setStoriesHistory([
          { id: 1, title: "الشجرة الكريمة", date: "2026-06-03", stars: 5 },
          { id: 2, title: "مغامرة في الفضاء", date: "2026-06-01", stars: 4 },
        ]);
        
        // القيمة التجميلية المؤقتة للـ AI Summary
        setAiSummary("أداء ممتاز لأطفالكِ هذا الأسبوع! لقد تفاعلوا بقوة مع محور (عالم الحيوان والأخلاق) عبر قراءة الحواديت...");
        setUnreadCount(1);
        
        setLoading(false);
      } catch (err) {
        console.error("خطأ في جلب بيانات لوحة التحكم الحية:", err);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-story-bg flex items-center justify-center font-sans text-ink">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-bold">جاري تحميل لوحة تحكم الآباء الحية...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-story-bg flex flex-row-reverse font-sans text-ink select-none" dir="rtl">
      
      {/* 1️⃣ القائمة الجانبية (Sidebar) */}
      <aside className="w-64 bg-white border-l border-border-warm p-6 flex flex-col justify-between shadow-story">
        <div>
          <div className="flex items-center justify-end gap-2 mb-8 text-primary font-bold text-xl">
            <span>منطقة الآباء</span>
            <Shield className="w-6 h-6 text-primary" />
          </div>

          <nav className="space-y-2">
            <button 
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-sm transition font-bold ${activeTab === "overview" ? "bg-primary-wash text-primary shadow-sm" : "text-ink-muted hover:bg-story-bg"}`}
            >
              <span className="flex items-center gap-2"><Brain className="w-4 h-4" /> نظرة عامة</span>
            </button>
            
            <button 
              onClick={() => setActiveTab("reports")}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-sm transition font-bold ${activeTab === "reports" ? "bg-primary-wash text-primary shadow-sm" : "text-ink-muted hover:bg-story-bg"}`}
            >
              <span className="flex items-center gap-2"><BookOpen className="w-4 h-4" /> سجل القصص والتقارير</span>
            </button>

            <button 
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-sm transition font-bold ${activeTab === "settings" ? "bg-primary-wash text-primary shadow-sm" : "text-ink-muted hover:bg-story-bg"}`}
            >
              <span className="flex items-center gap-2"><Sliders className="w-4 h-4" /> الإعدادات والتحكم</span>
            </button>
          </nav>
        </div>

        <button className="flex items-center justify-center gap-2 p-3 text-ink-muted hover:text-primary rounded-xl text-sm transition font-bold">
          <LogOut className="w-4 h-4" />
          <span>خروج لمنطقة الأطفال</span>
        </button>
      </aside>

      {/* 2️⃣ المحتوى الرئيسي للوحة التحكم */}
      <main className="flex-1 p-8 overflow-y-auto">
        
        <header className="flex justify-between items-center mb-8">
          <button className="p-2 bg-white rounded-full border border-border-warm shadow-story relative text-ink-muted hover:text-primary transition">
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-sunny rounded-full animate-pulse"></span>
            )}
          </button>
          <div>
            <h1 className="text-2xl font-bold text-ink">مرحباً بكِ في واجهة المتابعة</h1>
            <p className="text-sm text-ink-muted">إليكِ ملخص نشاط أطفالكِ التعليمي والتربوي</p>
          </div>
        </header>

        {/* --- شاشة النظرة العامة --- */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            
            {/* الكروت العلوية بعد تعديلها لتصبح ثنائية متناسقة */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* كارد القصص المقروءة */}
              <div className="bg-white p-6 rounded-2xl border border-border-warm flex items-center justify-between shadow-card">
                <div className="p-4 bg-green-100 rounded-xl text-meadow"><BookOpen className="w-6 h-6" /></div>
                <div>
                  <p className="text-xs text-ink-muted mb-1">القصص المقروءة</p>
                  <h3 className="text-xl font-bold text-ink">{stats.totalStoriesRead} حواديت</h3>
                </div>
              </div>

              {/* كارد وقت التعلم */}
              <div className="bg-white p-6 rounded-2xl border border-border-warm flex items-center justify-between shadow-card">
                <div className="p-4 bg-blue-100 rounded-xl text-sky"><Clock className="w-6 h-6" /></div>
                <div>
                  <p className="text-xs text-ink-muted mb-1">وقت التعلم الكلي</p>
                  <h3 className="text-xl font-bold text-ink">{stats.totalMinutesWatched} دقيقة</h3>
                </div>
              </div>

            </div>

            {/* الرسم البياني والتحكم السريع */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div className="bg-white p-6 rounded-2xl border border-border-warm shadow-story lg:col-span-2">
                <h3 className="text-sm font-bold text-ink mb-4">وقت الشاشة والتعلم اليومي (بالدقائق)</h3>
                <div className="w-full h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyActivityData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8DED4" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="#7A6552" fontSize={12} />
                      <YAxis axisLine={false} tickLine={false} stroke="#7A6552" fontSize={12} orientation="right" />
                      <Tooltip cursor={{ fill: '#FFFBF0' }} />
                      <Bar dataKey="minutes" fill={COLOR_PRIMARY} radius={[8, 8, 0, 0]} barSize={24} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>


            {/* التقرير المولّد بالذكاء الاصطناعي ديناميكياً */}
            <div className="bg-page-dreamy p-6 rounded-3xl border border-magic/20 shadow-story flex flex-col gap-4">
              <div className="flex items-center justify-end gap-2 text-magic font-bold text-sm">
                <span>التقرير الأسبوعي الذكي (Parent Agent)</span>
                <Sparkles className="w-5 h-5 animate-pulse text-magic" />
              </div>
              <p className="text-xs text-ink bg-white p-4 rounded-2xl border border-border-warm shadow-inner leading-relaxed">
                {aiSummary}
              </p>
            </div>

          </div>
          </div>
        )}

        {/* --- شاشة التقارير والسجل --- */}
        {activeTab === "reports" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-xs font-bold shadow-button hover:bg-primary-light transition">
                <Download className="w-4 h-4" /> حفظ التقرير الشامل بصيغة PDF
              </button>
              <h2 className="text-lg font-bold text-ink">تقارير التقدم المفصلة للطفل</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-border-warm shadow-story flex flex-col items-center">
                <h3 className="text-sm font-bold text-ink w-full mb-4">تصنيفات الحواديت المستمع إليها</h3>
                <div className="w-full h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={topicsData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {topicsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={STORY_CAT_COLORS[index % STORY_CAT_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-border-warm shadow-story space-y-4">
                <h3 className="text-sm font-bold text-ink">تاريخ الاستماع والنجوم اليومية</h3>
                <div className="space-y-3">
                  {storiesHistory.map((story) => (
                    <div key={story.id} className="flex justify-between items-center p-3 bg-story-bg rounded-xl border border-border-warm">
                      <span className="text-xs text-sunny font-bold">⭐ {story.stars} نجوم اليوم</span>
                      <div className="text-right">
                        <h4 className="text-xs font-bold text-ink">{story.title}</h4>
                        <p className="text-[10px] text-ink-muted">{story.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- شاشة الإعدادات التفاعلية والبريد --- */}
        {activeTab === "settings" && (
          <div className="bg-white p-6 rounded-2xl border border-border-warm shadow-story space-y-6">
            <h2 className="text-lg font-bold text-ink mb-4">التنبيهات البريدية وتخصيص تجربة المحتوى</h2>
            
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-primary border-b border-border-warm pb-2">إعدادات الإشعارات والـ Digest</h3>
              
              <label className="flex items-center justify-end gap-3 text-xs text-ink-muted cursor-pointer">
                تفعيل الإشعار الأسبوعي الملخص (Email digest) 
                <input 
                  type="checkbox" 
                  checked={emailDigest} 
                  onChange={(e) => setEmailDigest(e.target.checked)} 
                  className="accent-primary" 
                />
              </label>
              
              <label className="flex items-center justify-end gap-3 text-xs text-ink-muted cursor-pointer">
                تذكير بموعد وقت الحدوتة اليومي قبل النوم 
                <input 
                  type="checkbox" 
                  checked={bedtimeReminder} 
                  onChange={(e) => setBedtimeReminder(e.target.checked)} 
                  className="accent-primary" 
                />
              </label>
              
              <label className="flex items-center justify-end gap-3 text-xs text-ink-muted cursor-pointer">
                إرسال تنبيه فوري للأب عند انتهاء وقت الشاشة اليومي للطفل 
                <input 
                  type="checkbox" 
                  checked={screenTimeAlert} 
                  onChange={(e) => setScreenTimeAlert(e.target.checked)} 
                  className="accent-primary" 
                />
              </label>
            </div>

            {/* زر حفظ التفضيلات البريدية التفاعلي */}
            <div className="flex justify-end pt-4">
              <button
                onClick={async () => {
                  try {
                    setIsSavingSettings(true);
                    const token = localStorage.getItem("accessToken");
                    
                    const res = await fetch("http://localhost:5000/api/parent/email-settings", {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                      },
                      body: JSON.stringify({
                        emailDigest,
                        bedtimeReminder,
                        screenTimeAlert
                      })
                    });

                    const result = await res.json();

                    if (res.ok && result.success) {
                      alert("تم حفظ تفضيلات التنبيهات البريدية للأب بنجاح! ✉️✨");
                    } else {
                      alert(result.message || "حدث خطأ أثناء محاولة حفظ الإعدادات البريدية.");
                    }
                  } catch (err) {
                    console.error("خطأ أثناء حفظ التفضيلات البريدية:", err);
                    alert("فشل الاتصال بالسيرفر لحفظ الإعدادات.");
                  } finally {
                    setIsSavingSettings(false);
                  }
                }}
                disabled={isSavingSettings}
                className="bg-primary text-white text-xs font-bold px-6 py-2 rounded-xl shadow-button hover:bg-primary-light transition disabled:opacity-50"
              >
                {isSavingSettings ? "جاري الحفظ..." : "حفظ التفضيلات البريدية"}
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}