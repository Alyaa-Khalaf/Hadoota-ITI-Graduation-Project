"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      // الـ Endpoint المتوقع لاستعادة كلمة المرور
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "حدث خطأ ما، يرجى التحقق من الإيميل المكتوب");
      }

      setMessage("تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني بنجاح 💌");
    } catch (err: any) {
      setError(err.message || "حدث مشكلة أثناء إرسال الرابط، حاول مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

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
            ✨ حدوتة
          </Link>
        </div>

        <Card hoverEffect={false} className="p-8 md:p-10 border border-border-warm/40 shadow-xl">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-black text-ink">استعادة كلمة المرور 🔐</h2>
            <p className="text-sm font-bold text-ink-muted mt-2">أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة التعيين</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 text-right">
            {error && <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-sm font-bold text-primary text-center">⚠️ {error}</div>}
            {message && <div className="p-3 rounded-xl bg-success/10 border border-success/20 text-sm font-bold text-emerald-600 text-center">✅ {message}</div>}

            <div>
              <label className="block text-sm font-black text-ink mb-2">البريد الإلكتروني المسجل</label>
              <Input
                              type="email"
                              placeholder="example@mail.com"
                              required
                              disabled={isLoading || !!message}
                              value={email}
                              onChange={(e) => setEmail(e.target.value)} label={""}              />
            </div>

            <div className="pt-2">
              <Button type="submit" variant="primary" fullWidth={true} disabled={isLoading || !!message} className="!py-3.5 font-black">
                {isLoading ? "جاري الإرسال..." : "إرسال رابط التعيين"}
              </Button>
            </div>
          </form>

          <div className="text-center mt-8 pt-5 border-t border-border-warm/40 text-sm font-bold text-ink-muted">
            <Link href="/auth/login" className="text-magic font-black hover:underline">
              العودة لتسجيل الدخول
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}