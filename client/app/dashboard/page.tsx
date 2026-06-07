"use client";

import React, { useState, useEffect } from "react";
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line,
  PieChart, Pie, Cell 
} from "recharts";
import { 
  Baby, Bell, BarChart3, BookOpen, Star, Clock, 
  Download, Brain, CheckCircle2, Sliders, Mail, Calendar
} from "lucide-react";

// ==========================================
// 📐 تعريف الـ Interfaces (TypeScript Types)
// ==========================================

interface IParentData {
  _id: string;
  name: string;
  email: string;
}

interface IChild {
  _id: string;
  name: string;
  lastStory?: string;
  starsToday?: number;
  difficulty?: string;
  screenTime?: string;
}

interface IWeeklyActivity {
  name: string;     // اسم اليوم القادم من السيرفر (السبت، الأحد...)
  stories: number;  // عدد الحواديت المستهلكة في هذا اليوم
}

interface ITopicDistribution {
  name: string;     // اسم الموضوع الدراسي (فضاء، قيم وأخلاق...)
  value: number;    // النسبة المئوية لاهتمام الطفل
  color?: string;
}

interface IAIAgentReport {
  summary: string;
  recommendations: string[];
}

interface IApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: any[];
}

// 🌐 الروابط الأساسية للسيرفر والـ APIs المعتمدة
const API_BASE_URL = "http://localhost:5000"; 
const AI_AGENT_API_BASE = "http://localhost:5000/api/parent-agent"; 

export default function ParentDashboard() {
  // 1. State Management الأساسية
  const [activeTab, setActiveTab] = useState<"overview" | "reports" | "content" | "notifications">("overview");
  const [parent, setParent] = useState<IParentData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // 2. إدارة قائمة الأطفال والطفل المختار (تبدأ فارغة تماماً ومصفرة)
  const [children, setChildren] = useState<IChild[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string>("");

  // 3. States الرسوم البيانية الخاصة بـ (شغل نورهان - الإحصائيات) -> مصفّرة تماماً
  const [weeklyActivity, setWeeklyActivity] = useState<IWeeklyActivity[]>([]); 
  const [topicDistribution, setTopicDistribution] = useState<ITopicDistribution[]>([]); 

  // 4. State تقرير المساعد الذكي الخاص بـ (شغل هند - الـ AI Agent) -> مصفّرة تماماً
  const [aiReport, setAiReport] = useState<IAIAgentReport>({
    summary: "",
    recommendations: []
  });

  // ========================================================
  // 📥 الخطوة الأولى: جلب البيانات الأساسية للداشبورد الرئيسي (Overview)
  // ========================================================
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    
    if (storedUser) {
      const parsedUser: IParentData = JSON.parse(storedUser);
      setParent(parsedUser);
      
      if (parsedUser._id) {
        fetchOverviewData(parsedUser._id, token);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const fetchOverviewData = async (parentId: string, token: string | null) => {
    try {
      // 📊 [كود الإحصائيات - شغل نورهان] -> جلب الداشبورد الرئيسي لولي الأمر والأطفال
      const res = await fetch(`${API_BASE_URL}/api/analytics/dashboard/${parentId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      if (res.ok) {
        const result: IApiResponse<{ children: IChild[] }> = await res.json();
        const fetchedChildren = result.data?.children || [];
        setChildren(fetchedChildren);
        
        // تعيين الطفل الأول تلقائياً لبدء تتبع الـ APIs الأخرى
        if (fetchedChildren.length > 0) {
          setSelectedChildId(fetchedChildren[0]._id);
        }
      }
    } catch (err) {
      console.error("🔴 Error fetching dashboard summary:", err);
    } finally {
      setLoading(false);
    }
  };

  // ========================================================
  // 📥 الخطوة الثانية: جلب تفاصيل تقارير الطفل المحدد (شغل الإحصائيات والـ AI)
  // ========================================================
  useEffect(() => {
    if (!selectedChildId) return;
    
    const token = localStorage.getItem("token");
    
    const fetchChildDetailsAndAI = async () => {
      try {
        // ── 📊 [كود الإحصائيات - شغل نورهان] ──
        
        // 1. جلب معدل قراءة الحواديت أسبوعياً لتغذية الـ Line Chart
        const storiesRes = await fetch(`${API_BASE_URL}/api/analytics/${selectedChildId}/stories?period=weekly&days=7`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (storiesRes.ok) {
          const resData: IApiResponse<IWeeklyActivity[]> = await storiesRes.json();
          setWeeklyActivity(resData.data || []);
        }

        // 2. جلب المواضيع المفضلة والمتعلمة لتغذية الـ Pie Chart
        const topicsRes = await fetch(`${API_BASE_URL}/api/analytics/${selectedChildId}/topics`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (topicsRes.ok) {
          const resData: IApiResponse<ITopicDistribution[]> = await topicsRes.json();
          setTopicDistribution(resData.data || []);
        }

        // ── 🤖 [كود الـ AI Agent - شغل هند] ──
        // جلب التقرير الذكي والتوصيات المبنية على أداء الطفل الحالي من الـ LLM Agent
        const aiRes = await fetch(`${AI_AGENT_API_BASE}/report?childId=${selectedChildId}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (aiRes.ok) {
          const aiData: IApiResponse<IAIAgentReport> = await aiRes.json();
          setAiReport({
            summary: aiData.data?.summary || "",
            recommendations: aiData.data?.recommendations || []
          });
        }

      } catch (err) {
        console.error("🔴 Error pulling child details from APIs:", err);
      }
    };

    fetchChildDetailsAndAI();
  }, [selectedChildId]);

  const handleExportPDF = () => {
    alert("جاري سحب التحليلات الحالية وتوليد ملف PDF لتقرير ولي الأمر...");
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#FFFBF0]">
        <div className="text-xl font-bold text-[#FF7043] animate-pulse">جاري سحب بيانات الداشبورد والتحليلات الحية...</div>
      </div>
    );
  }

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
            
            {/* أزرار التنقل بين أقسام الداشبورد */}
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
            <h3 className="text-lg font-bold border-r-4 border-[#FF7043] pr-3">ملخص يومي لكل الأطفال</h3>
            
            {children.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center border border-[#E8DED4] text-[#7A6552] text-sm">
                لا يوجد أطفال مضافين حالياً في قاعدة البيانات. قم بإضافة طفل من حسابك أولاً.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {children.map((child) => (
                  <div key={child._id} className="bg-white rounded-3xl p-6 border border-[#E8DED4] shadow-sm">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-3">
                        <div className="bg-[#FFF5E6] w-12 h-12 rounded-2xl flex items-center justify-center text-2xl">👶</div>
                        <div>
                          <h4 className="font-bold text-lg text-[#3D2C1E]">{child.name}</h4>
                          <p className="text-xs text-[#7A6552]">كود التتبع الفريد: <span className="text-[#FF7043] font-mono font-bold">{child._id}</span></p>
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
                          setActiveTab("content");
                        }} 
                        className="text-[#FF7043] hover:underline font-bold"
                      >
                        تعديل التفضيلات والوقت ➔
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
                  <span>اختر الطفل لعرض تقريره الفوري من قاعدة البيانات:</span>
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

            {/* الرسوم البيانية المتصلة بالـ APIs الخاصة بـ (شغل نورهان) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* 📈 Line Chart لعدد الحدوتات أسبوعياً */}
              <div className="bg-white p-6 rounded-3xl border border-[#E8DED4] shadow-sm">
                <h4 className="font-bold text-sm text-[#3D2C1E] mb-4 flex items-center gap-2">
                  <BarChart3 size={18} className="text-[#FF7043]" /> Line chart لعدد الحدوتات أسبوعياً
                </h4>
                <div className="h-64">
                  {weeklyActivity.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-xs text-[#7A6552]">لا توجد بيانات قراءة مسجلة لهذا الأسبوع (0 حواديت).</div>
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
                  <BookOpen size={18} className="text-[#4D96FF]" /> Pie chart للمواضيع المتعلمة (Topics)
                </h4>
                <div className="h-64 flex flex-col sm:flex-row items-center justify-around">
                  {topicDistribution.length === 0 ? (
                    <div className="text-xs text-[#7A6552]">لم يتم تحديد اهتمامات أو مواضيع مستهلكة بعد.</div>
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

            {/* 🤖 التقرير الأسبوعي من الـ AI Agent الخاص بـ (شغل هند) */}
            <div className="bg-[#F3F0FF] border border-[#C77DFF]/40 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-[#C77DFF]/10 p-2 rounded-xl text-[#C77DFF]"><Brain size={24} /></div>
                <div>
                  <h4 className="font-bold text-base text-[#3D2C1E]">التقرير الأسبوعي المولّد بالـ AI (Parent Agent)</h4>
                  <p className="text-xs text-[#7A6552]">تحليل ذكي مخصص ومولّد آلياً بواسطة نظام الـ LLM المدمج خلف الكواليس</p>
                </div>
              </div>
              
              {!aiReport.summary ? (
                <div className="text-xs text-[#7A6552] text-center bg-white/50 p-4 rounded-xl border border-[#E8DED4]">
                  في انتظار انتهاء الطفل من حواديت الأسبوع لتوليد تقرير الذكاء الاصطناعي...
                </div>
              ) : (
                <>
                  <p className="text-sm leading-relaxed text-[#3D2C1E] bg-white/70 p-4 rounded-2xl border border-[#E8DED4]">
                    {aiReport.summary}
                  </p>
                  <div className="mt-4 space-y-2">
                    <h5 className="text-xs font-bold text-[#C77DFF] uppercase tracking-wider">توجيهات وتوصيات المساعد الذكي لولي الأمر:</h5>
                    {aiReport.recommendations.map((rec, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-[#3D2C1E]">
                        <CheckCircle2 size={16} className="text-[#6BCB77] flex-shrink-0" />
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* ================= TABS 3 & 4 (إعدادات مفرغة ومستعدة للمزامنة) ================= */}
        {activeTab === "content" && (
          <div className="bg-white rounded-3xl p-6 border border-[#E8DED4] shadow-sm space-y-4">
            <h3 className="text-lg font-bold border-r-4 border-[#FF7043] pr-3">إعدادات المحتوى وتفضيلات طفلك</h3>
            <p className="text-xs text-[#7A6552]">تحكم في التوبيكات المسموح بها، ومستويات الصعوبة وحظر الكلمات الممررة للـ LLM.</p>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="bg-white rounded-3xl p-6 border border-[#E8DED4] max-w-2xl mx-auto space-y-4">
            <h3 className="text-lg font-bold border-r-4 border-[#FF7043] pr-3">إعدادات الإشعارات والتنبيهات المستهدفة</h3>
            <p className="text-xs text-[#7A6552]">تفعيل ميزة الـ Email digest الأسبوعي الشامل لإرسال تقارير نورهان وهند لإيميلك المعتمد.</p>
          </div>
        )}

      </div>
    </div>
  );
}