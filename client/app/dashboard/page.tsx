"use client";

import React, { useState, useEffect } from "react";
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line,
  PieChart, Pie, Cell 
} from "recharts";
import { 
  Baby, Bell, BarChart3, BookOpen, Star, Clock, 
  Download, Brain, CheckCircle2, Sliders
} from "lucide-react";

// ==========================================
// 📐 تعريف الـ Interfaces المتوافقة مع السيرفر
// ==========================================

interface IParentData {
  _id: string;
  name: string;
  email: string;
}

interface IChild {
  _id: string; // الـ childId المطلوب
  name: string;
  avatar?: string;
  lastStory?: string;
  starsToday?: number;
  difficulty?: string;
  screenTime?: string;
}

interface IWeeklyActivity {
  name: string;     // اسم اليوم (السبت، الأحد...)
  stories: number;  // عدد الحواديت
}

interface ITopicDistribution {
  name: string;     // اسم الموضوع الدراسي (فضاء، علوم...)
  value: number;    // النسبة المئوية
  color?: string;
}

interface IProgressData {
  summary: string;
  recommendations: string[];
  completedStoriesCount?: number;
  totalQuizzesPlayed?: number;
}

interface IApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: any[];
}

const API_BASE_URL = "http://localhost:5000"; 

export default function ParentDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "reports" | "content" | "notifications">("overview");
  const [parent, setParent] = useState<IParentData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // إدارة قائمة الأطفال والطفل المختار
  const [children, setChildren] = useState<IChild[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string>("");

  // States الرسوم البيانية المتصلة بالـ APIs
  const [weeklyActivity, setWeeklyActivity] = useState<IWeeklyActivity[]>([]); 
  const [topicDistribution, setTopicDistribution] = useState<ITopicDistribution[]>([]); 
  const [screenTimeData, setScreenTimeData] = useState<any[]>([]);

  // State التقدم والتقرير الذكي (GET /api/analytics/:childId/progress)
  const [progressReport, setProgressReport] = useState<IProgressData>({
    summary: "",
    recommendations: [],
    completedStoriesCount: 0,
    totalQuizzesPlayed: 0
  });

  // ========================================================
  // 📥 1. Flow البداية: جلب التوكن وبيانات الأب من الـ Login
  // ========================================================
  useEffect(() => {
    // قراءة الـ accessToken النظيف المتوافق مع مسار الـ Login
    const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    
    if (storedUser) {
      const parsedUser: IParentData = JSON.parse(storedUser);
      setParent(parsedUser);
      
      if (parsedUser._id) {
        // الـ Flow الأول: GET /api/analytics/dashboard/:parentId
        fetchDashboardOverview(parsedUser._id, token);
      }
    } else {
      setLoading(false);
    }
  }, []);
  

  // دالة جلب الداشبورد الرئيسي للأب
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
        // السيرفر بيرجع الأطفال المربوطين بالأب ده
        const fetchedChildren = result.data?.children || result.data || [];
        setChildren(fetchedChildren);
        
        // تعيين الطفل الأول تلقائياً لبدء الـ Detail flow
        if (fetchedChildren.length > 0) {
          setSelectedChildId(fetchedChildren[0]._id);
        }
      }
    } catch (err) {
      console.error("🔴 Error fetching dashboard overview:", err);
    } finally {
      setLoading(false);
    }
  };

  // ========================================================
  // 📥 2. Flow التفاصيل: جلب تفاصيل الطفل (Detail Flow)
  // ========================================================
  useEffect(() => {
    if (!selectedChildId) return;
    
    const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
    
    const fetchChildDetails = async () => {
      try {
        // أ. جلب معدل قراءة الحواديت أسبوعياً لقراءة الـ Line Chart
        const storiesRes = await fetch(`${API_BASE_URL}/api/analytics/${selectedChildId}/stories?period=weekly&days=7`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (storiesRes.ok) {
          const resData: IApiResponse<IWeeklyActivity[]> = await storiesRes.json();
          setWeeklyActivity(resData.data || []);
        }

        // ب. جلب المواضيع المفضلة لتغذية الـ Pie Chart
        const topicsRes = await fetch(`${API_BASE_URL}/api/analytics/${selectedChildId}/topics`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (topicsRes.ok) {
          const resData: IApiResponse<ITopicDistribution[]> = await topicsRes.json();
          setTopicDistribution(resData.data || []);
        }

        // ج. جلب وقت الشاشة والـ Screen Time
        const timeRes = await fetch(`${API_BASE_URL}/api/analytics/${selectedChildId}/time?days=7`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (timeRes.ok) {
          const resData = await timeRes.json();
          setScreenTimeData(resData.data || []);
        }

        // د. الـ Detail Flow الأساسي: جلب تقرير التقدم الشامل والتوصيات للطفل
        const progressRes = await fetch(`${API_BASE_URL}/api/analytics/${selectedChildId}/progress`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (progressRes.ok) {
          const resData: IApiResponse<IProgressData> = await progressRes.json();
          setProgressReport({
            summary: resData.data?.summary || "الطفل يتفاعل بشكل ممتاز مع الحواديت التعليمية وجاري تحليل الأداء المستمر.",
            recommendations: resData.data?.recommendations || ["ينصح بزيادة حواديت الفضاء والعلوم", "تحفيز الطفل على حل الكويز اليومي"],
            completedStoriesCount: resData.data?.completedStoriesCount || 0,
            totalQuizzesPlayed: resData.data?.totalQuizzesPlayed || 0
          });
        }

      } catch (err) {
        console.error("🔴 Error pulling child details from APIs:", err);
      }
    };

    fetchChildDetails();
  }, [selectedChildId]);

  // ========================================================
  // 🎯 3. ميزة الـ Tracking (محاكاة إنهاء حدوتة لتغذية الـ Charts)
  // ========================================================
  const handleTrackSimulatedSession = async () => {
    if (!selectedChildId) {
      alert("الرجاء اختيار طفل أولاً لتنفيذ الـ Tracking!");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/analytics/session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          childId: selectedChildId,
          storyId: "story_" + Math.floor(Math.random() * 100),
          topic: "فضاء",
          durationSeconds: 300,
          completed: true
        }),
      });

      const result = await res.json();
      if (res.ok && result.success) {
        alert("✨ تم تسجيل الـ Tracking بنجاح! الـ Charts ستحدث بياناتها الآن.");
        // إعادة جلب الداتا لتحديث الـ Charts فوراً
        setSelectedChildId(""); 
        setTimeout(() => setSelectedChildId(selectedChildId), 10);
      } else {
        alert("فشل تسجيل الجلسة: " + result.message);
      }
    } catch (err) {
      console.error("خطأ في السيرفر أثناء إرسال الـ Tracking", err);
    }
  };

  const handleExportPDF = () => {
    alert("جاري سحب التحليلات الحالية وتوليد ملف PDF لتقرير ولي الأمر...");
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#FFFBF0]">
        <div className="text-xl font-bold text-[#FF7043] animate-pulse">جاري سحب بيانات الداشبورد والتحليلات الحية...</div>
      </div>
    );
  };

  const handleGenerateNewReport = async () => {
  if (!selectedChildId) return;
  
  setLoading(true); // تشغيل الـ Loading State أثناء التوليد
  try {
    const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
    // إرسال طلب POST لسيرفر هند لإجبار الـ AI على توليد تقرير جديد فوراً
    const res = await fetch(`http://localhost:5000/api/parent-agent/generate`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ childId: selectedChildId })
    });
    
    const result = await res.json();
    if (res.ok && result.success) {
      // بعد التوليد الناجح، نعيد جلب التقرير المحدث ليعرض في الـ UI
      fetchAIReport(selectedChildId); 
    } else {
      alert("فشل الـ AI في توليد التقرير حالياً.");
    }
  } catch (err) {
    console.error("خطأ أثناء توليد تقرير الـ AI:", err);
  } finally {
    setLoading(false); // إغلاق الـ Loading State
  }
};

  return (
    <div className="min-h-screen bg-[#FFFBF0] font-sans text-[#3D2C1E]" dir="rtl">
      {/* البار العلوي وهيدر الصفحة */}
      <div className="bg-white border-b border-[#E8DED4] shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-3">
              <span className="text-3xl">✨</span>
              <div>
                <h1 className="text-xl font-bold text-[#3D2C1E]">لوحة تحكم ولي الأمر</h1>
                <p className="text-xs text-[#7A6552]">مرحباً بك، {parent?.name || "مربي حدوتة المتميز"}</p>
              </div>
            </div>
            
            <nav className="flex gap-2">
              <button 
                onClick={() => setActiveTab("overview")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${activeTab === "overview" ? "bg-[#FF7043] text-white" : "text-[#7A6552] hover:bg-[#FFF5E6]"}`}
              >
                <Baby size={18} /> الداشبورد الرئيسي
              </button>
              <button 
                onClick={() => setActiveTab("reports")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${activeTab === "reports" ? "bg-[#FF7043] text-white" : "text-[#7A6552] hover:bg-[#FFF5E6]"}`}
              >
                <BarChart3 size={18} /> صفحة التقارير والـ AI
              </button>
              <button 
                onClick={() => setActiveTab("content")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${activeTab === "content" ? "bg-[#FF7043] text-white" : "text-[#7A6552] hover:bg-[#FFF5E6]"}`}
              >
                <Sliders size={18} /> إعدادات المحتوى
              </button>
              <button 
                onClick={() => setActiveTab("notifications")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${activeTab === "notifications" ? "bg-[#FF7043] text-white" : "text-[#7A6552] hover:bg-[#FFF5E6]"}`}
              >
                <Bell size={18} /> الإشعارات
              </button>
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* ================= TAB 1: OVERVIEW (الداشبورد الرئيسي) ================= */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold border-r-4 border-[#FF7043] pr-3">ملخص يومي لكل الأطفال</h3>
              <button 
                onClick={handleTrackSimulatedSession}
                className="bg-purple-600 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-purple-700 shadow-sm"
              >
                🚀 تجربة إرسال داتا الـ Tracking للطفل المختار
              </button>
            </div>
            
            {children.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center border border-[#E8DED4] text-[#7A6552] text-sm">
                لا يوجد أطفال مضافين حالياً في قاعدة البيانات. قم بإضافة طفل من صفحة إدارة الأطفال أولاً.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {children.map((child) => (
                  <div key={child._id} className="bg-white rounded-3xl p-6 border border-[#E8DED4] shadow-sm">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-3">
                        <div className="bg-[#FFF5E6] w-12 h-12 rounded-2xl flex items-center justify-center text-2xl">
                          {child.avatar || "👶"}
                        </div>
                        <div>
                          <h4 className="font-bold text-lg text-[#3D2C1E]">{child.name}</h4>
                          <p className="text-xs text-[#7A6552]">كود التتبع للطفل: <span className="text-[#FF7043] font-mono font-bold">{child._id}</span></p>
                        </div>
                      </div>
                      <span className="bg-[#FFF0EB] text-[#FF7043] text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                        <Clock size={12} /> {child.screenTime || "0 دقيقة اليوم"}
                      </span>
                    </div>

                    <div className="space-y-3 bg-[#FFFBF0] p-4 rounded-2xl border border-[#E8DED4]/60">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-[#7A6552] flex items-center gap-1"><BookOpen size={16} /> آخر حدوتة:</span>
                        <span className="font-bold text-[#3D2C1E]">{child.lastStory || "لا توجد حواديت مقروءة بعد"}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-[#7A6552] flex items-center gap-1"><Star size={16} className="text-[#FFD93D] fill-[#FFD93D]" /> عدد النجوم اليوم:</span>
                        <span className="font-bold text-[#FF7043]">{child.starsToday || 0} نجوم</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-2 border-t border-[#E8DED4]/40 flex justify-between items-center text-xs">
                      <span className="text-[#7A6552]">التحكم السريع في حساب {child.name}</span>
                      <button 
                        onClick={() => {
                          setSelectedChildId(child._id);
                          setActiveTab("reports");
                        }} 
                        className="text-[#FF7043] hover:underline font-bold"
                      >
                        عرض التقارير والـ Charts التفصيلية ➔
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 2: REPORTS (صفحة التقارير والـ AI) ================= */}
        {activeTab === "reports" && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h3 className="text-lg font-bold border-r-4 border-[#FF7043] pr-3">مخططات وتقارير تقدم الطفل بالذكاء الاصطناعي</h3>
                <div className="mt-2 flex items-center gap-2 text-xs text-[#7A6552]">
                  <span>اختر الطفل لعرض تقريره الفوري المباشر:</span>
                  <select 
                    value={selectedChildId} 
                    onChange={(e) => setSelectedChildId(e.target.value)}
                    className="p-1.5 bg-white border border-[#E8DED4] rounded-lg text-[#3D2C1E] focus:outline-none focus:border-[#FF7043]"
                  >
                    {children.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <button 
                onClick={handleExportPDF}
                className="flex items-center justify-center gap-2 bg-[#6BCB77] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm"
              >
                <Download size={16} /> Export كـ PDF
              </button>
            </div>

            {/* الرسوم البيانية المتصلة بالـ APIs الخاصة بك */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* 📈 Line Chart لعدد الحدوتات أسبوعياً */}
              <div className="bg-white p-6 rounded-3xl border border-[#E8DED4] shadow-sm">
                <h4 className="font-bold text-sm text-[#3D2C1E] mb-4 flex items-center gap-2">
                  <BarChart3 size={18} className="text-[#FF7043]" /> معدل قراءة الحواديت أسبوعياً
                </h4>
                <div className="h-64">
                  {weeklyActivity.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-xs text-[#7A6552]">لا توجد بيانات قراءة مسجلة لهذا الأسبوع (0 حواديت). نادِ دالة الـ Tracking لتغذية الـ Charts!</div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={weeklyActivity}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E8DED4" />
                        <XAxis dataKey="name" stroke="#7A6552" style={{ fontSize: 11 }} />
                        <YAxis stroke="#7A6552" style={{ fontSize: 11 }} />
                        <Tooltip />
                        <Line type="monotone" dataKey="stories" stroke="#FF7043" strokeWidth={3} dot={{ r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* 🍕 Pie chart للمواضيع المتعلمة (Topics) */}
              <div className="bg-white p-6 rounded-3xl border border-[#E8DED4] shadow-sm">
                <h4 className="font-bold text-sm text-[#3D2C1E] mb-4 flex items-center gap-2">
                  <BookOpen size={18} className="text-[#4D96FF]" /> توزيع الاهتمامات والمواضيع المتعلمة (Topics)
                </h4>
                <div className="h-64 flex flex-col sm:flex-row items-center justify-around">
                  {topicDistribution.length === 0 ? (
                    <div className="text-xs text-[#7A6552]">لم يتم تسجيل اهتمامات أو مواضيع مستهلكة بعد للطفل الحالي.</div>
                  ) : (
                    <>
                      <ResponsiveContainer width="55%" height="100%">
                        <PieChart>
                          <Pie
                            data={topicDistribution}
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={75}
                            paddingAngle={4}
                            dataKey="value"
                          >
                            {topicDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color || ["#4D96FF", "#FF7043", "#C77DFF", "#6BCB77"][index % 4]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="space-y-1.5 text-xs font-semibold">
                        {topicDistribution.map((topic, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: topic.color || "#FF7043" }} />
                            <span className="text-[#3D2C1E]">{topic.name} ({topic.value}%)</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

            </div>

            {/* 🤖 التقرير الأسبوعي من الـ Progress API المدمج بالذكاء الاصطناعي */}
            <div className="bg-[#F3F0FF] border border-[#C77DFF]/40 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-[#C77DFF]/10 p-2 rounded-xl text-[#C77DFF]"><Brain size={24} /></div>
                <div>
                  <h4 className="font-bold text-base text-[#3D2C1E]">تقرير التقدم المخصّص والـ AI Progress Report</h4>
                  <p className="text-xs text-[#7A6552]">تحليل ذكي فوري مبني على أداء كويزات وحواديت الطفل المسترجعة من الـ API</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4 text-center">
                <div className="bg-white p-3 rounded-xl border border-[#E8DED4]">
                  <span className="block text-xs text-[#7A6552]">الحواديت المكتملة</span>
                  <span className="text-xl font-black text-purple-600">{progressReport.completedStoriesCount}</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-[#E8DED4]">
                  <span className="block text-xs text-[#7A6552]">الكويزات التي تم لعبها</span>
                  <span className="text-xl font-black text-[#6BCB77]">{progressReport.totalQuizzesPlayed}</span>
                </div>
              </div>
              
              <p className="text-sm leading-relaxed text-[#3D2C1E] bg-white/70 p-4 rounded-2xl border border-[#E8DED4]">
                {progressReport.summary}
              </p>
              
              <div className="mt-4 space-y-2">
                <h5 className="text-xs font-bold text-[#C77DFF] uppercase tracking-wider">توجيهات وتوصيات المساعد الذكي لولي الأمر:</h5>
                {progressReport.recommendations.map((rec, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-[#3D2C1E]">
                    <CheckCircle2 size={16} className="text-[#6BCB77] flex-shrink-0" />
                    <span>{rec}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center border-b pb-3 mb-4">
                <h4 className="text-md font-black text-secondary flex items-center gap-2">
                  <span>🤖</span> تقرير الـ AI الأسبوعي المطور
                </h4>
                {/* زرار ولّد تقرير جديد بضغطة زر */}
                <button 
                  onClick={handleGenerateNewReport}
                  disabled={loading}
                  className="text-xs bg-primary text-white font-bold px-4 py-1.5 rounded-xl hover:bg-primary/90 transition disabled:opacity-50"
                >
                  {loading ? "جاري التوليد... ⏳" : "ولّد تقرير جديد 🔄"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* إعدادات مفرغة ومستعدة للمزامنة */}
        {activeTab === "content" && (
          <div className="bg-white rounded-3xl p-6 border border-[#E8DED4] shadow-sm space-y-4">
            <h3 className="text-lg font-bold border-r-4 border-[#FF7043] pr-3">إعدادات المحتوى وتفضيلات طفلك</h3>
            <p className="text-xs text-[#7A6552]">تحكم في التوبيكات المسموح بها، ومستويات الصعوبة وحظر الكلمات الممررة للـ LLM.</p>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="bg-white rounded-3xl p-6 border border-[#E8DED4] max-w-2xl mx-auto space-y-4">
            <h3 className="text-lg font-bold border-r-4 border-[#FF7043] pr-3">إعدادات الإشعارات والتنبيهات المستهدفة</h3>
            <p className="text-xs text-[#7A6552]">تفعيل ميزة الـ Email digest الأسبوعي الشامل لإرسال التقارير لإيميلك المعتمد.</p>
          </div>
        )}

      </div>
    </div>
  );
}

function fetchAIReport(selectedChildId: string) {
  throw new Error("Function not implemented.");
}
