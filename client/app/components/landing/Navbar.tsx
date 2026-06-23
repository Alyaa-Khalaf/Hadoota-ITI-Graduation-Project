
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Button from "../ui/Button";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { accessToken, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinkClasses = "hover:text-ink transition-colors duration-200";

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      dir="rtl"
      className={`fixed top-0 left-0 right-0 z-50 w-full px-6 transition-all duration-300 ${
        isScrolled
          ? "bg-white/70 backdrop-blur-xl border-b border-border-warm/20 shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl font-black tracking-wide font-sans group"
        >
          <span className="text-primary group-hover:scale-105 transition-transform">
            حدوتة
          </span>

          <svg
            className="w-6 h-6 text-primary group-hover:rotate-12 transition-transform"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M11.5 2a.5.5 0 0 1 1 0l1.32 4.315a.5.5 0 0 0 .365.365L18.5 8a.5.5 0 0 1 0 1l-4.315 1.32a.5.5 0 0 0-.365-.365L12.5 15a.5.5 0 0 1-1 0l-1.32-4.315a.5.5 0 0 0-.365-.365L5.5 9a.5.5 0 0 1 0-1l4.315-1.32a.5.5 0 0 0 .365-.365L11.5 2zm5 14a.5.5 0 0 1 .5-.5l1.5-.32a.5.5 0 0 0 .365-.365l.32-1.5a.5.5 0 0 1 1 0l.32 1.5a.5.5 0 0 0 .365.365l1.5.32a.5.5 0 0 1 0 1l-1.5.32a.5.5 0 0 0-.365.365l-.32 1.5a.5.5 0 0 1-1 0l-.32-1.5a.5.5 0 0 0-.365-.365l-1.5-.32a.5.5 0 0 1-.5-.5z" />
          </svg>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-10 text-base font-bold text-ink-muted font-sans">
          <Link href="#features" className={navLinkClasses}>
            المميزات
          </Link>

          <Link href="#how-it-works" className={navLinkClasses}>
            كيف تعمل
          </Link>

          <Link href="#testimonials" className={navLinkClasses}>
            الآراء
          </Link>

          <Link href="#pricing" className={navLinkClasses}>
            الأسعار
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4 font-sans">
          {accessToken ? (
            <>
              <Link href="/childAdventure">
                <Button
                  variant="primary"
                  className='!py-2.5 !px-6 flex items-center gap-2'
                >
                  🚀 مغامراتي
                </Button>
              </Link>

              <Button
                variant="outline"
                className='!py-2.5 !px-6 flex items-center gap-2'
                onClick={logout}
              >
                تسجيل الخروج
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="outline"
                 className='!py-2.5 !px-6 flex items-center gap-2 border border-primary  hover:bg-primary-wash '>
                  تسجيل الدخول
                </Button>
              </Link>

              <Link href="/auth/register">
                <Button variant="primary" className='!py-2.5 !px-6 flex items-center gap-2'>
                  جرّب مجاناً
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.header>
  );
}

