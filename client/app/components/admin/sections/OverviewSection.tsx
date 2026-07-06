"use client";

import { useEffect, useState } from "react";
import {
  Users, Baby, BookOpen, School, FileQuestion, BrainCircuit, Wallet, Flag,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import StatCard from "../StatCard";
import { getApiErrorMessage } from "@/utils/api";
import * as admin from "@/services/adminService";
import type { AdminStats, RecentActivity } from "@/services/adminService";

const PIE_COLORS = ["#6BCB77", "#FF7043", "#C77DFF", "#4D96FF"];

export default function OverviewSection() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [activity, setActivity] = useState<RecentActivity | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([admin.getStats(), admin.getRecentActivity()])
      .then(([s, a]) => {
        setStats(s);
        setActivity(a);
      })
      .catch((err) => setError(getApiErrorMessage(err, "تعذر تحميل الإحصائيات")));
  }, []);

  if (error) {
    return <p className="text-red-500 font-bold text-center py-10">{error}</p>;
  }
  if (!stats) {
    return <p className="text-[#FF7043] font-bold text-center py-10 animate-pulse">جاري تحميل الإحصائيات...</p>;
  }

  const c = stats.cards;
  const pieData = activity?.storyStatus ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-[#3D2C1E] mb-1">نظرة عامة على النظام</h2>
        <p className="text-sm text-[#7A6552]">كل أرقام المنصة الحية في مكان واحد</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="المستخدمين" value={c.totalUsers} delay={0} />
        <StatCard icon={Baby} label="الأطفال" value={c.totalChildren} accent="text-[#4D96FF]" delay={0.05} />
        <StatCard icon={BookOpen} label="الحواديت" value={c.totalStories} accent="text-[#C77DFF]" delay={0.1} />
        {/* <StatCard icon={School} label="المدارس" value={c.totalSchools} accent="text-[#6BCB77]" delay={0.15} /> */}
        <StatCard icon={FileQuestion} label="الاختبارات" value={c.totalQuizzes} accent="text-[#4D96FF]" delay={0.2} />
        <StatCard icon={BrainCircuit} label="بنك المعرفة" value={c.totalKnowledge} accent="text-[#C77DFF]" delay={0.25} />
        <StatCard icon={Flag} label="حواديت مبلّغ عنها" value={c.flaggedStories} accent="text-red-500" delay={0.3} />
        <StatCard icon={Wallet} label="الإيرادات (ج.م)" value={c.totalRevenue} accent="text-[#FF7043]" delay={0.35} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-[#E8DED4] shadow-sm p-5">
          <h3 className="font-black text-sm text-[#3D2C1E] mb-4">توزيع حالات الحواديت</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-[#E8DED4] shadow-sm p-5">
          <h3 className="font-black text-sm text-[#3D2C1E] mb-4">تفصيل أنواع المستخدمين</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: "أهالي", value: c.totalParents },
                { name: "طلاب", value: c.totalStudents },
                // { name: "معلمين", value: c.totalTeachers },
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#FF7043" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
