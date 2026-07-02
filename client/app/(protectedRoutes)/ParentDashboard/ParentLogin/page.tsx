"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Card from "@/components/ui/Card";
import LoginForm from "@/components/ParentDashboard/login";
import PreviousButton from "@/components/ui/PreviousButton";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-story-bg flex items-center justify-center p-6 font-sans" dir="rtl">
      <PreviousButton/>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* العودة للرئيسية بروح مبهجة */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-block text-2xl font-black text-primary tracking-tight hover:scale-105 transition-transform">
            ✨ حدوتة
          </Link>
        </div>

        <Card hoverEffect={false} className="p-8 md:p-10 border border-border-warm/40 shadow-xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-ink">    أهلا بك  👋</h2>
            <p className="text-sm font-bold text-ink-muted mt-2">تابع مغامرات طفلك التعليمية الممتعة</p>
          </div>

          {/* الفورم الذكي للـ Login */}
          <LoginForm />

        </Card>
      </motion.div>
    </div>
  );
}