"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Button from "../ui/Button";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  const { accessToken } = useAuth();


  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 w-full px-6 py-4 transition-all duration-300 ${
        isScrolled
          ? "bg-white/60 backdrop-blur-lg border-b border-border-warm/20 shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
      dir="rtl"
    >
      <div className="container mx-auto flex items-center justify-between">
        
        {/* logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl font-black text-sky tracking-wide font-sans"
        >
          <span>حدوتة</span>
          <svg
            className="w-6 h-6 text-sky"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M11.5 2a.5.5 0 0 1 1 0l1.32 4.315a.5.5 0 0 0 .365.365L18.5 8a.5.5 0 0 1 0 1l-4.315 1.32a.5.5 0 0 0-.365-.365L12.5 15a.5.5 0 0 1-1 0l-1.32-4.315a.5.5 0 0 0-.365-.365L5.5 9a.5.5 0 0 1 0-1l4.315-1.32a.5.5 0 0 0 .365-.365L11.5 2zm5 14a.5.5 0 0 1 .5-.5l1.5-.32a.5.5 0 0 0 .365-.365l.32-1.5a.5.5 0 0 1 1 0l.32 1.5a.5.5 0 0 0 .365.365l1.5.32a.5.5 0 0 1 0 1l-1.5.32a.5.5 0 0 0-.365.365l-.32 1.5a.5.5 0 0 1-1 0l-.32-1.5a.5.5 0 0 0-.365-.365l-1.5-.32a.5.5 0 0 1-.5-.5z" />
          </svg>
        </Link>

        {/* nav */}
        <nav className="hidden items-center gap-10 text-base font-bold text-ink-muted md:flex font-sans">
          <Link href="#features" className="hover:text-ink transition">
            المميزات
          </Link>
          <Link href="#how-it-works" className="hover:text-ink transition">
            كيف تعمل
          </Link>
          <Link href="#testimonials" className="hover:text-ink transition">
            الآراء
          </Link>
          <Link href="#pricing" className="hover:text-ink transition">
            الأسعار
          </Link>
        </nav>

        {/* right side */}
       <div className="flex items-center gap-5 font-sans">
  {accessToken ? (
    <Link href="/childAdventure">
      <Button
        variant="primary"
        className="!py-2.5 !px-6 flex items-center gap-2"
      >
        🚀 مغامراتي
      </Button>
    </Link>
  ) : (
    <>
      <Link href="/auth/login/">
        <Button variant="outline" className="!py-2.5 !px-6">
          تسجيل الدخول
        </Button>
      </Link>

      <Link href="/auth/register/">
        <Button variant="primary" className="!py-2.5 !px-6">
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