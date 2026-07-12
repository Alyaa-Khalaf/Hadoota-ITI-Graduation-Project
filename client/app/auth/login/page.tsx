"use client";
import { Suspense } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import LoginForm from "../../components/auth/LoginForm";
import PreviousButton from "@/components/ui/PreviousButton";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#f3efe9] flex items-center justify-center p-6 font-sans" dir="rtl">
      <PreviousButton/>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-[32px] shadow-xl px-8 py-10"
      >
        {/* الفورم الذكي للـ Login */}
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>

        <div className="text-center mt-8 text-sm text-gray-500">
          ليس لديك حساب؟{" "}
          <Link href="/auth/register" className="font-semibold text-gray-800 hover:underline">
            أنشئ حساباً الآن
          </Link>
        </div>
      </motion.div>
    </div>
  );
}