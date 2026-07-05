"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Card from "../../components/ui/Card";
import RegisterForm from "../../components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-story-bg flex items-center justify-center p-6 font-sans" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-6">
          <Link href="/" className="inline-block text-2xl font-black text-primary tracking-tight hover:scale-105 transition-transform">
           <img src="https://i.postimg.cc/vBh3rg27/6dcc91a697e148f9b10475c183968468.png" alt="Hadoota Logo" />
          </Link>
        </div>

        <Card hoverEffect={false} className="p-8 md:p-10 border border-border-warm/40 shadow-xl">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-black text-ink">ابدأ المغامرة اليوم 🚀</h2>
            <p className="text-sm font-bold text-ink-muted mt-2">أنشئ حساب الأهل وابنِ عالم طفلك الفريد</p>
          </div>

          {/* الفورم الذكي للـ Register */}
          <RegisterForm />

          <div className="text-center mt-6 pt-5 border-t border-border-warm/40 text-sm font-bold text-ink-muted">
            لديك حساب بالفعل؟{" "}
            <Link href="/auth/login" className="text-primary font-black hover:underline">
              تسجيل الدخول
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}