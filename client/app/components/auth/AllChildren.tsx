"use client";

import { useRouter } from "next/navigation";
import { useChildren } from "@/hooks/useChildren";
import { useSelectedChild } from "@/context/childContext";
import { Sparkles, Plus } from "lucide-react";
import { motion } from "framer-motion";

export default function TheChildren() {
  const router = useRouter();
  const { children, loading } = useChildren();
  const { setSelectedChild } = useSelectedChild();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-background">
        <div className="flex gap-4 text-6xl">
          {['📖', '✨', '🦸'].map((e, i) => (
            <motion.span key={i} animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, delay: i * 0.2 }}>{e}</motion.span>
          ))}
        </div>
        <p className="text-muted-foreground font-medium animate-pulse">جاري تحضير الأبطال...</p>
      </div>
    );
  }

  if (!children.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-6 text-center">
        <div className="text-7xl">👶</div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-foreground">لا يوجد أبطال بعد!</h2>
          <p className="text-muted-foreground max-w-sm">قم بإضافة طفل من لوحة التحكم لتبدأ المغامرة.</p>
        </div>
        <button
          onClick={() => router.push("/ParentDashboard")}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-bold hover:scale-105 transition-transform"
        >
          <Plus size={20} /> لوحة التحكم
        </button>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-background p-6 sm:p-12">
      <div className="max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-center mb-12 space-y-3"
        >
          <h1 className="text-4xl sm:text-5xl font-black text-foreground">من البطل اليوم؟ 🚀</h1>
          <p className="text-muted-foreground font-medium">اختر شخصيتك لتبدأ رحلة التعلم والمغامرة</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {children.map((child) => (
            <motion.button
              key={child._id}
              whileHover={{ y: -8 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSelectedChild(child);
                router.push("/childAdventure");
              }}
              className="group relative bg-card p-8 rounded-[32px] text-center shadow-lg border border-border/50 hover:border-primary/50 transition-all"
            >
              <Sparkles size={24} className="absolute top-4 left-4 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="w-28 h-28 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-6xl shadow-inner group-hover:bg-primary/20 transition-colors">
                {child.avatar}
              </div>

              <div className="mt-6">
                <h2 className="text-2xl font-black text-foreground">{child.name}</h2>
                <p className="text-sm font-bold text-muted-foreground bg-muted inline-block px-3 py-1 rounded-full mt-2">
                  {child.age} سنوات
                </p>
              </div>

              <div className="mt-6 py-3 w-full bg-primary text-primary-foreground rounded-xl font-bold opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
                هيا بنا! 🎮
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}