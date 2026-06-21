"use client";

import React, { useState, useEffect } from "react";
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line,
  PieChart, Pie, Cell 
} from "recharts";
import { 
  Baby, Bell, BarChart3, BookOpen, Clock, 
  Brain, CheckCircle2, Sliders, Sparkles, Lightbulb, Heart,
  Check, Trash2, ShieldAlert, Trophy, Mail, Globe
} from "lucide-react";
import { io } from "socket.io-client";
import Link from "next/link";
// ==========================================
// Interfaces 
// ==========================================

/* تعليق: هذا الـ Interface يمثل هيكل بيانات حساب الأب القادم من السيرفر */
interface IParentData {
  _id: string;
  name: string;
  email: string;
}

/* تعليق: هذا الـ Interface يمثل هيكل بيانات الطفل الشخصية المسجلة في قاعدة البيانات */
interface IChild {
  _id: string; 
  name: string;
  avatar?: string;
  lastStory?: string;
  starsToday?: number;
  difficulty?: string;
  screenTime?: string;
}

/* تعليق: يمثل نقاط النشاط الأسبوعي للطفل لرسم المنحنى البياني */
interface IWeeklyActivity {
  name: string;     
  stories: number;  
}

/* تعليق: يمثل توزيع اهتمامات الطفل والمواضيع التي قرأها لرسم البياني الدائري */
interface ITopicDistribution {
  name: string;     
  value: number;    
  color?: string;
}

/* تعليق: يمثل هيكل بيانات التقرير الأسبوعي الذكي المسترجع بالكامل من الـ API الخاصة بهند */
interface IProgressData {
  summary: string;
  recommendations: string[];
  completedStoriesCount?: number;
  totalQuizzesPlayed?: number;
  aiInsights?: string;              
  nextWeekTopics?: string[];         
  encouragementMessage?: string;    
}

/* تعليق: يمثل هيكل الإشعار الواحد القادم ديناميكياً من السيرفر */
interface INotification {
  id: string;
  title: string;
  body: string;
  type: "weekly_report" | "screen_time" | "achievement" | "daily_reminder";
  isRead: boolean;
  createdAt: string;
}

/* تعليق: يمثل هيكل إعدادات وتفضيلات قنوات الإشعارات الخاصة */
interface INotificationSettings {
  weeklyReport: { email: boolean; webPush: boolean };
  screenTime: { email: boolean; webPush: boolean };
  achievement: { email: boolean; webPush: boolean };
  dailyReminder: { email: boolean; webPush: boolean };
}

/* تعليق: الهيكل القياسي الموحد لاستقبال ردود كل الـ APIs من السيرفر */
interface IApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: any[];
}

// الرابط الأساسي لـ السيرفر المحلي (الباك إيند)
const API_BASE_URL = "http://localhost:5000"; 

export default function ParentDashboard() {
  /* تعليق: الـ State المسؤولة عن تبديل الصفحات الداخلية (التبويبات) في لوحة التحكم */
  const [activeTab, setActiveTab] = useState<"overview" | "reports" | "content" | "notifications" | "settings">("overview");
  
  /* تعليق: الـ States الخاصة ببيانات الأب، حالة التحميل العامة، وحالة تحميل توليد الـ AI */
  const [parent, setParent] = useState<IParentData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingAI, setLoadingAI] = useState<boolean>(false); 

  /* تعليق: الـ States الخاصة بإدارة الأطفال والطفل النشط المحدد حالياً */
  const [children, setChildren] = useState<IChild[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string>("");

  /* تعليق: الـ States الخاصة ببيانات الرسوم البيانية للطفل المسترجعة من الـ API */
  const [weeklyActivity, setWeeklyActivity] = useState<IWeeklyActivity[]>([]); 
  const [topicDistribution, setTopicDistribution] = useState<ITopicDistribution[]>([]); 

  /* تعليق: الـ State المسؤولة عن حفظ داتا التقرير الأسبوعي الحقيقي المستلم من الـ API بدون داتا فيك */
  const [progressReport, setProgressReport] = useState<IProgressData | null>(null);

  /* تعليق: الـ States الخاصة بقائمة الإشعارات، وإظهار القائمة المنسدلة للجرس، وفلترة الإشعارات */
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [showBellDropdown, setShowBellDropdown] = useState<boolean>(false);
  const [notificationFilter, setNotificationFilter] = useState<"all" | "unread" | "read">("all");

  /* تعليق: الـ State المسؤولة عن حفظ تفضيلات وتوجيهات الإشعارات (تاسك نورهان) */
  const [notificationSettings, setNotificationSettings] = useState<INotificationSettings | null>(null);

  // ========================================================
  // 📥 1. خطاف البداية (useEffect) لجلب بيانات المستخدم والتهيئات
  // ========================================================
  useEffect(() => {
    /* تعليق: هذا الكود يعمل فور فتح الصفحة لجلب التوكن الحقيقي وبيانات الأب المسجل من الـ LocalStorage وثم استدعاء الـ APIs */
    const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    
    if (storedUser) {
      const parsedUser: IParentData = JSON.parse(storedUser);
      setParent(parsedUser);
      
      if (parsedUser._id) {
        fetchDashboardOverview(parsedUser._id, token);
        fetchInitialNotifications(token);
        fetchNotificationSettings(token);
      }
    } else {
      setLoading(false);
    }

    // Socket 
    const socket = io(API_BASE_URL, { auth: { token } });
    socket.on("newNotification", (newNotif: INotification) => {
       setNotifications(prev => [newNotif, ...prev]);
    });
    return () => { socket.disconnect(); };
    
  }, []);
  
  const fetchDashboardOverview = async (parentId: string, token: string | null) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/analytics/dashboard/${parentId}`, {
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      

      if (res.ok) {
        const result: IApiResponse<any> = await res.json();
        console.log("Response:", result.data);
        
        const fetchedChildren = Array.isArray(result.data) 
          ? result.data 
          : (result.data?.children || result.data || []);

        setChildren(fetchedChildren);

        if (fetchedChildren.length > 0 && fetchedChildren[0]._id) {
          setSelectedChildId(fetchedChildren[0]._id);
        }
      } else {
        console.error("🔴 السيرفر رفض الاستجابة بلوحة التحكم الحية، كود الحالة:", res.status);
      }
    } catch (err) {
      console.error("🔴 Error fetching dashboard overview:", err);
    } finally {
      setLoading(false);
    }
  };

  /* تعليق: دالة حقيقية لجلب التقرير الأسبوعي ومقترحات الـ AI للطفل المحدد من الـ Endpoint الخاصة بهند */
  const fetchAIReport = async (childId: string) => {
    try {
      const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
      const progressRes = await fetch(`${API_BASE_URL}/api/analytics/${childId}/progress`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (progressRes.ok) {
        const resData: IApiResponse<IProgressData> = await progressRes.json();
        if (resData.success && resData.data) {
          setProgressReport(resData.data);
        } else {
          setProgressReport(null);
        }
      } else {
        setProgressReport(null);
      }
    } catch (err) {
      console.error("خطأ جلب تقرير الـ AI من السيرفر:", err);
      setProgressReport(null);
    }
  };

  const fetchInitialNotifications = async (token: string | null) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/notifications`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const result = await res.json();
        if (result.success && result.data) setNotifications(result.data);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  const fetchNotificationSettings = async (token: string | null) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/notifications/settings`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const result = await res.json();
        if (result.success && result.data) setNotificationSettings(result.data);
      }
    } catch (err) {
      console.error("Error fetching notification settings:", err);
    }
  };

  // ========================================================
  // 📥 2. خطاف مراقبة تغيير الطفل (useEffect) لتحديث الداتا تفاعلياً
  // ========================================================
  useEffect(() => {
    if (!selectedChildId) return;
    const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
    
    const fetchChildDetails = async () => {
      try {
        const storiesRes = await fetch(`${API_BASE_URL}/api/analytics/${selectedChildId}/stories?period=weekly&days=7`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (storiesRes.ok) {
          const resData: IApiResponse<IWeeklyActivity[]> = await storiesRes.json();
          setWeeklyActivity(resData.data || []);
        }

        const topicsRes = await fetch(`${API_BASE_URL}/api/analytics/${selectedChildId}/topics`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (topicsRes.ok) {
          const resData: IApiResponse<ITopicDistribution[]> = await topicsRes.json();
          setTopicDistribution(resData.data || []);
        }

        fetchAIReport(selectedChildId);
      } catch (err) {
        console.error("🔴 Error pulling child details:", err);
      }
    };
    fetchChildDetails();
  }, [selectedChildId]);

  // ========================================================
  // ⚙️ 3. الأوامر والعمليات المرسلة إلى الـ APIs (POST, PATCH, DELETE)
  // ========================================================

  /* تعليق: دالة زر "ولّد تقرير جديد" تقوم بعمل طلب سرفر لإجبار الـ Agent الخاص بهند على تشغيل الـ Prompt والتوليد الفوري للملف */
  const handleGenerateNewReport = async () => {
    if (!selectedChildId) return;
    setLoadingAI(true); 
    try {
      const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/parent-agent/generate`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ childId: selectedChildId })
      });
      const result = await res.json();
      if (res.ok && result.success) {
        await fetchAIReport(selectedChildId); 
        alert("✨ تم توليد تحديثات التقرير الأسبوعي بنجاح بالذكاء الاصطناعي!");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAI(false); 
    }
  };

  /* تعليق: دالة تحديث حالة الإشعار الفردي إلى "مقروء" وتحديثها بالسيرفر */
  const handleMarkAsRead = async (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    try {
      const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
      await fetch(`${API_BASE_URL}/api/notifications/${id}/read`, {
        method: "PATCH",
        headers: { "Authorization": `Bearer ${token}` }
      });
    } catch (err) {
      console.error(err);
    }
  };

  /* تعليق: دالة لتحديث كامل الإشعارات دفعة واحدة لتصبح مقروءة */
  const handleMarkAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    try {
      const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
      await fetch(`${API_BASE_URL}/api/notifications/read-all`, {
        method: "PATCH",
        headers: { "Authorization": `Bearer ${token}` }
      });
    } catch (err) {
      console.error(err);
    }
  };

  /* تعليق: دالة مسؤولة عن حذف إشعار محدد نهائياً من قائمة الأب وقاعدة البيانات */
  const handleDeleteNotification = async (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    try {
      const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
      await fetch(`${API_BASE_URL}/api/notifications/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
    } catch (err) {
      console.error(err);
    }
  };

  /* تعليق: دالة لحفظ وتحديث قيمة تفضيلات الإشعارات (Toggles) وإرسال البنية المحدثة إلى الـ API الخاص بنورهان */
  const handleToggleSetting = async (type: keyof INotificationSettings, channel: "email" | "webPush") => {
    if (!notificationSettings) return;

    const updatedSettings = {
      ...notificationSettings,
      [type]: {
        ...notificationSettings[type],
        [channel]: !notificationSettings[type][channel]
      }
    };
    setNotificationSettings(updatedSettings);

    try {
      const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
      await fetch(`${API_BASE_URL}/api/notifications/settings`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedSettings)
      });
    } catch (err) {
      console.error("خطأ أثناء حفظ الإعدادات:", err);
    }
  };

  /* تعليق: عمليات فلترة الإشعارات وحساب العدادات الديناميكية لـ جرس التنبيهات */
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const filteredNotifications = notifications.filter(n => {
    if (notificationFilter === "unread") return !n.isRead;
    if (notificationFilter === "read") return n.isRead;
    return true;
  });

  /* تعليق: واجهة الانتظار وحالة التحميل أثناء إرسال واستقبال الطلبات الرئيسية من الخادم */
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#FFFBF0]">
        <div className="text-xl font-bold text-[#FF7043] animate-pulse">جاري سحب بيانات الداشبورد والتحليلات الحية...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFBF0] font-sans text-[#3D2C1E]" dir="rtl">
      
      {/* ========================================================
          🔔 البار العلوي (Navbar) وقائمة الجرس المنسدلة
          ======================================================== */}
      <div className="bg-white border-b border-[#E8DED4] shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-3">
              <span className="text-3xl">✨</span>
              <div>
                <h1 className="text-xl font-bold text-[#3D2C1E]">لوحة تحكم ولي الأمر</h1>
                <p className="text-xs text-[#7A6552]">مرحباً بك، {parent?.name || "مربي حدوتة"}</p>
              </div>
            </div>
            
            <nav className="flex gap-2 items-center">
              <button 
                onClick={() => setActiveTab("overview")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${activeTab === "overview" ? "bg-[#FF7043] text-white" : "text-[#7A6552] hover:bg-[#FFF5E6]"}`}
              >
                <Baby size={18} /> الداشبورد
              </button>
              <button 
                onClick={() => setActiveTab("reports")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${activeTab === "reports" ? "bg-[#FF7043] text-white" : "text-[#7A6552] hover:bg-[#FFF5E6]"}`}
              >
                <BarChart3 size={18} /> صفحة الـ AI
              </button>
              
              {/* أيقونة جرس الإشعارات مع تعداد التنبيهات الحية غير المقروءة */}
              <div className="relative">
                <button 
                  onClick={() => setShowBellDropdown(!showBellDropdown)}
                  className="p-2 text-[#7A6552] hover:bg-[#FFF5E6] rounded-xl relative transition"
                >
                  <Bell size={22} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 bg-red-500 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* القائمة المنسدلة لعرض آخر 5 إشعارات مستلمة من التنبيهات */}
                {showBellDropdown && (
                  <div className="absolute left-0 mt-3 w-80 bg-white rounded-2xl border border-[#E8DED4] shadow-xl z-50 overflow-hidden text-right">
                    <div className="p-4 border-b border-[#E8DED4] flex justify-between items-center bg-gray-50">
                      <span className="font-black text-sm text-[#3D2C1E]">آخر الإشعارات</span>
                      {unreadCount > 0 && (
                        <button onClick={handleMarkAllAsRead} className="text-xs text-[#FF7043] font-bold hover:underline">
                          تحديد الكل كمقروء
                        </button>
                      )}
                    </div>
                    <div className="max-h-64 overflow-y-auto divide-y divide-gray-100">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-xs text-gray-400">لا توجد إشعارات غير مقروءة حالياً</div>
                      ) : (
                        notifications.slice(0, 5).map((notif) => (
                          <div 
                            key={notif.id} 
                            onClick={() => { handleMarkAsRead(notif.id); }}
                            className={`p-3 transition cursor-pointer text-right hover:bg-orange-50/40 ${!notif.isRead ? "bg-amber-50/50 border-r-4 border-[#FF7043]" : ""}`}
                          >
                            <h6 className="font-bold text-xs text-gray-800">{notif.title}</h6>
                            <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">{notif.body}</p>
                            <span className="text-[9px] text-gray-400 block mt-1">{notif.createdAt}</span>
                          </div>
                        ))
                      )}
                    </div>
                    <button 
                      onClick={() => { setShowBellDropdown(false); setActiveTab("notifications"); }}
                      className="w-full text-center py-2.5 bg-[#FFF5E6] text-[#FF7043] font-bold text-xs hover:bg-[#FFEBD6] transition"
                    >
                      عرض الكل الإشعارات الكاملة
                    </button>
                  </div>
                )}
              </div>

              <button 
                onClick={() => setActiveTab("settings")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${activeTab === "settings" ? "bg-[#FF7043] text-white" : "text-[#7A6552] hover:bg-[#FFF5E6]"}`}
              >
                ⚙️ إعدادات التنبيهات
              </button>
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/*  */}
        
        {/* ================= TAB 1: OVERVIEW ================= */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <h3 className="text-lg font-bold border-r-4 border-[#FF7043] pr-3">قائمة الأطفال المسجلين</h3>
            {children.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center border border-[#E8DED4] text-[#7A6552] text-sm">لا يوجد أطفال مضافين في قاعدة البيانات حالياً.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {children.map((child) => (
                  <div key={child._id} className="bg-white rounded-3xl p-6 border border-[#E8DED4] shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#FFF5E6] w-12 h-12 rounded-2xl flex items-center justify-center text-2xl">{child.avatar || "👶"}</div>
                      <div>
                        <h4 className="font-bold text-lg text-[#3D2C1E]">{child.name}</h4>
                        <p className="text-xs text-[#7A6552]">كود تتبع الطفل: <span className="text-[#FF7043] font-mono font-bold">{child._id}</span></p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 2: REPORTS (التقرير الأسبوعي) ================= */}
        {activeTab === "reports" && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold border-r-4 border-[#FF7043] pr-3">تحليلات الـ AI للأسبوع الجاري</h3>
              <select 
                value={selectedChildId} 
                onChange={(e) => setSelectedChildId(e.target.value)}
                className="p-2 bg-white border border-[#E8DED4] rounded-xl text-xs font-bold"
              >
                {children.map((c) => (<option key={c._id} value={c._id}>{c.name}</option>))}
              </select>
            </div>

            {/* كارد تصميم وعرض الـ AI Weekly Report الحقيقي كاملاً */}
            <div className="bg-gradient-to-br from-[#F6F2FF] to-[#FAF8FF] border-2 border-[#C77DFF]/30 rounded-[35px] p-8 shadow-md">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#C77DFF]/20 pb-6 mb-6">
                <div className="flex items-center gap-3.5">
                  <div className="bg-[#C77DFF] text-white p-3 rounded-2xl shadow-sm"><Sparkles size={24} /></div>
                  <div>
                    <h4 className="font-black text-xl text-[#2A1B4E]">التقرير الأسبوعي المولّد بالـ AI</h4>
                    <p className="text-xs text-[#7A6552] font-semibold mt-0.5">تحليل نشاط الطفل وتحديد اهتماماته وسلوكه البرمي</p>
                  </div>
                </div>
                <button 
                  onClick={handleGenerateNewReport}
                  disabled={loadingAI}
                  className="bg-[#FF7043] text-white font-black text-xs px-6 py-3 rounded-2xl hover:bg-[#E65F33] transition disabled:opacity-60"
                >
                  {loadingAI ? "جاري التوليد عبر الـ Agent... ⏳" : "ولّد تقرير جديد 🔄"}
                </button>
              </div>

              {/* إذا كانت الداتا لم تصل بعد من السيرفر، تعرض حالة فارغة حقيقية بدون تزييف */}
              {!progressReport ? (
                <div className="text-center py-12 bg-white/60 rounded-2xl border border-dashed text-sm font-bold text-[#7A6552]">
                  لا توجد داتا تقارير متوفرة حالياً لهذا الطفل في السيرفر. اضغطي على زر التوليد بالأعلى لتشغيل الـ Agent 🚀
                </div>
              ) : (
                <div className="space-y-6">
                  {/* ملخص الأسبوع */}
                  <div className="bg-white/95 p-5 rounded-2xl border border-[#E8DED4] shadow-sm">
                    <h5 className="font-black text-sm text-[#3D2C1E] mb-2 flex items-center gap-2 border-r-4 border-purple-500 pr-2">📝 ملخص الأسبوع:</h5>
                    <p className="text-sm leading-relaxed text-[#4A3B32] font-medium">{progressReport.summary}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* الـ Insights الذكية لشغف الطفل */}
                    {progressReport.aiInsights && (
                      <div className="bg-white/95 p-5 rounded-2xl border border-[#E8DED4] shadow-sm">
                        <h5 className="font-black text-sm text-[#3D2C1E] mb-3 flex items-center gap-2 text-amber-600"><Lightbulb size={18} /> المواضيع المفضلة (Insights):</h5>
                        <p className="text-xs font-semibold leading-relaxed text-[#5C4D42]">{progressReport.aiInsights}</p>
                      </div>
                    )}

                    {/* اقتراحات مواضيع للأسبوع الجاي */}
                    {progressReport.nextWeekTopics && progressReport.nextWeekTopics.length > 0 && (
                      <div className="bg-white/95 p-5 rounded-2xl border border-[#E8DED4] shadow-sm">
                        <h5 className="font-black text-sm text-[#3D2C1E] mb-3 flex items-center gap-2 text-blue-600"><Sliders size={18} /> اقتراحات للأسبوع القادم:</h5>
                        <div className="flex flex-wrap gap-2">
                          {progressReport.nextWeekTopics.map((topic, i) => (
                            <span key={i} className="bg-blue-50 text-blue-700 font-bold text-[11px] px-3 py-1.5 rounded-xl border border-blue-100">✨ {topic}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* التوصيات المسترجعة */}
                  {progressReport.recommendations && progressReport.recommendations.length > 0 && (
                    <div className="bg-white/95 p-5 rounded-2xl border border-[#E8DED4] shadow-sm">
                      <h5 className="font-black text-xs text-purple-600 uppercase mb-3">التوصيات الموجهة من المساعد الذكي:</h5>
                      <div className="space-y-2">
                        {progressReport.recommendations.map((rec, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs font-bold text-[#3D2C1E]">
                            <CheckCircle2 size={16} className="text-[#6BCB77] mt-0.5" />
                            <span>{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* الرسالة التشجيعية الموجهة للأهل من الـ AI */}
                  {progressReport.encouragementMessage && (
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-2xl border border-orange-200/60 flex items-start gap-3">
                      <div className="text-orange-500 mt-0.5"><Heart size={20} className="fill-orange-500" /></div>
                      <div>
                        <h6 className="font-black text-xs text-orange-700">رسالة تشجيعية للأهل من الـ AI:</h6>
                        <p className="text-xs text-orange-950 font-bold mt-1 leading-relaxed italic">{progressReport.encouragementMessage}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            📬 TAB 3: صفحة صندوق الإشعارات الكاملة
            ======================================================== */}
        {activeTab === "notifications" && (
          <div className="bg-white rounded-3xl p-6 border border-[#E8DED4] shadow-sm max-w-4xl mx-auto">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
              <div>
                <h3 className="text-lg font-black text-gray-800">صندوق الإشعارات الشامل 📬</h3>
                <p className="text-xs text-gray-400 font-bold">كل الإشعارات والتنبيهات المزامنة من قاعدة البيانات</p>
              </div>
              <button onClick={handleMarkAllAsRead} className="text-xs text-[#FF7043] bg-orange-50 font-bold px-3 py-2 rounded-xl">
                تحديد الكل كمقروء
              </button>
            </div>

            {/* الفلاتر (كل / غير مقروء / مقروء) */}
            <div className="flex gap-2 mb-4 bg-gray-50 p-1.5 rounded-xl border border-gray-100 w-fit">
              {["all", "unread", "read"].map((f) => (
                <button 
                  key={f}
                  onClick={() => setNotificationFilter(f as any)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-black capitalize ${notificationFilter === f ? "bg-[#FF7043] text-white shadow-sm" : "text-gray-500"}`}
                >
                  {f === "all" ? "الكل" : f === "unread" ? `غير مقروء (${unreadCount})` : "مقروء"}
                </button>
              ))}
            </div>

            {/* عرض الإشعارات أو إظهار رسالة فارغة حقيقية */}
            <div className="space-y-3">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-12 text-sm text-gray-400 font-bold bg-gray-50/50 rounded-2xl border border-dashed">
                  صندوق الإشعارات فارغ تماماً حالياً.
                </div>
              ) : (
                filteredNotifications.map((notif) => (
                  <div key={notif.id} className={`p-4 rounded-2xl border border-gray-100 flex items-start justify-between gap-4 ${!notif.isRead ? "bg-orange-50/20 border-r-4 border-[#FF7043]" : "bg-white"}`}>
                    <div className="flex items-start gap-3" onClick={() => handleMarkAsRead(notif.id)}>
                      <div className="p-2 bg-gray-100 rounded-xl text-gray-600"><Bell size={16} /></div>
                      <div>
                        <h5 className="text-sm font-black text-gray-900">{notif.title}</h5>
                        <p className="text-xs text-gray-500 mt-1">{notif.body}</p>
                        <span className="text-[10px] text-gray-400 block mt-2">{notif.createdAt}</span>
                      </div>
                    </div>
                    <button onClick={() => handleDeleteNotification(notif.id)} className="text-gray-400 hover:text-red-500 transition">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            ⚙️ TAB 4: إعدادات وتفضيلات قنوات الإشعارات 
            ======================================================== */}
        {activeTab === "settings" && (
          <div className="bg-white rounded-3xl p-6 border border-[#E8DED4] shadow-sm max-w-xl mx-auto">
            <div className="border-b border-gray-100 pb-3 mb-6">
              <h4 className="text-base font-black text-gray-800">تفضيلات وقنوات الإشعارات ⚙️</h4>
            </div>

            {!notificationSettings ? (
              <div className="text-center py-8 text-xs font-bold text-gray-400 animate-pulse">
                جاري سحب إعدادات قنوات التنبيه الحية من خوادم السيرفر...
              </div>
            ) : (
              <div className="space-y-6">
                {/* مفتاح: التقرير الأسبوعي */}
                <div className="space-y-2">
                  <span className="text-xs font-black text-gray-700 block">✅ التقرير الأسبوعي الذكي</span>
                  <div className="flex gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100 justify-around">
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-600 cursor-pointer">
                      <input type="checkbox" checked={notificationSettings.weeklyReport.email} onChange={() => handleToggleSetting("weeklyReport", "email")} className="rounded text-[#FF7043] focus:ring-[#FF7043]" />
                      <Mail size={14} /> Email
                    </label>
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-600 cursor-pointer">
                      <input type="checkbox" checked={notificationSettings.weeklyReport.webPush} onChange={() => handleToggleSetting("weeklyReport", "webPush")} className="rounded text-[#FF7043] focus:ring-[#FF7043]" />
                      <Globe size={14} /> Web Push
                    </label>
                  </div>
                </div>

                {/* مفتاح: انتهاء وقت الشاشة */}
                <div className="space-y-2">
                  <span className="text-xs font-black text-gray-700 block">✅ انتهاء وقت الشاشة للطفل</span>
                  <div className="flex gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100 justify-around">
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-600 cursor-pointer">
                      <input type="checkbox" checked={notificationSettings.screenTime.email} onChange={() => handleToggleSetting("screenTime", "email")} className="rounded text-[#FF7043] focus:ring-[#FF7043]" />
                      <Mail size={14} /> Email
                    </label>
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-600 cursor-pointer">
                      <input type="checkbox" checked={notificationSettings.screenTime.webPush} onChange={() => handleToggleSetting("screenTime", "webPush")} className="rounded text-[#FF7043] focus:ring-[#FF7043]" />
                      <Globe size={14} /> Web Push
                    </label>
                  </div>
                </div>

                {/* مفتاح: إنجازات الطفل */}
                <div className="space-y-2">
                  <span className="text-xs font-black text-gray-700 block">✅ إنجازات الطفل وجوائزه</span>
                  <div className="flex gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100 justify-around">
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-600 cursor-pointer">
                      <input type="checkbox" checked={notificationSettings.achievement.email} onChange={() => handleToggleSetting("achievement", "email")} className="rounded text-[#FF7043] focus:ring-[#FF7043]" />
                      <Mail size={14} /> Email
                    </label>
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-600 cursor-pointer">
                      <input type="checkbox" checked={notificationSettings.achievement.webPush} onChange={() => handleToggleSetting("achievement", "webPush")} className="rounded text-[#FF7043] focus:ring-[#FF7043]" />
                      <Globe size={14} /> Web Push
                    </label>
                  </div>
                </div>

                {/* مفتاح: تذكير القراءة اليومية */}
                <div className="space-y-2">
                  <span className="text-xs font-black text-gray-700 block">✅ تذكير الحدوتة اليومية</span>
                  <div className="flex gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100 justify-around">
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-600 cursor-pointer">
                      <input type="checkbox" checked={notificationSettings.dailyReminder.email} onChange={() => handleToggleSetting("dailyReminder", "email")} className="rounded text-[#FF7043] focus:ring-[#FF7043]" />
                      <Mail size={14} /> Email
                    </label>
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-600 cursor-pointer">
                      <input type="checkbox" checked={notificationSettings.dailyReminder.webPush} onChange={() => handleToggleSetting("dailyReminder", "webPush")} className="rounded text-[#FF7043] focus:ring-[#FF7043]" />
                      <Globe size={14} /> Web Push
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}