"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import RegisterForm from "../../components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#f3efe9] flex items-center justify-center p-6 font-sans" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-[32px] shadow-xl px-8 py-10"
      >
        {/* الفورم الذكي للـ Register */}
        <RegisterForm />

        <div className="text-center mt-8 text-sm text-gray-500">
          لديك حساب بالفعل؟{" "}
          <Link href="/auth/login" className="font-semibold text-gray-800 hover:underline">
            تسجيل الدخول
          </Link>
        </div>
      </motion.div>
    </div>
  );
}