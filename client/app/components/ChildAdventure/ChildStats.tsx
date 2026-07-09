"use client";

import { motion } from "framer-motion";
import AdventureHeader from "./AdventureHeader";
import { useGamification } from "@/hooks/useGamification";
import { useSelectedChild } from "@/context/childContext";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function ChildStats() {
  const { selectedChild } = useSelectedChild();
  const { gamification, loading } = useGamification(selectedChild?._id || "");

  if (loading) return <div className="text-center py-12 text-teal-600 font-bold">جاري تحميل إنجازاتك يا بطل... ⏳</div>;
  if (!gamification) return null;

  const { stars, level } = gamification;
  const isPro = stars >= 100;
  const badgeTitle = isPro ? "مستكشف محترف" : "مغامر صغير";

  const stats = [
    { label: "النجوم", value: stars, icon: "⭐", color: "from-teal-50 to-white border-teal-200" },
    { label: "المستوى", value: level, icon: "🏆", color: "from-coral-50 to-white border-coral-200" },
  ];

  return (
    <section className="space-y-8 max-w-4xl mx-auto px-4 py-10" dir="rtl">
      <AdventureHeader header="إنجازاتك" subHeader="شوف اللي حققته يا بطل ⭐" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {stats.map((stat, idx) => (
            <motion.div key={stat.label} whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
              <Card className={`bg-gradient-to-br ${stat.color} border-2 rounded-3xl shadow-lg shadow-black/5`}>
                <CardContent className="pt-8 pb-8 text-center">
                  <div className="text-5xl mb-4">{stat.icon}</div>
                  <div className="text-5xl font-black text-slate-900 mb-2">{stat.value}</div>
                  <p className="text-lg font-bold text-slate-500">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Achievement Badge */}
        <motion.div whileHover={{ scale: 1.01 }}>
          <Card className="bg-gradient-to-r from-teal-500 to-teal-600 border-none rounded-3xl p-1 shadow-xl">
            <CardContent className="bg-white/95 rounded-[1.3rem] p-6">
              <div className="flex items-center gap-6">
                <div className="text-6xl">🚀</div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-black text-slate-900">{badgeTitle}</h3>
                    <Badge className="bg-coral-500 hover:bg-coral-600 px-3 py-1 rounded-full text-white">
                      {isPro ? "محترف" : "مبتدئ"}
                    </Badge>
                  </div>
                  <p className="text-slate-600 font-medium">إنجاز رائع، استمر في جمع النجوم للوصول للمستوى التالي! ✨</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </section>
  );
}