
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "../ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Palette } from "lucide-react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { accessToken, user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);


  const edit = () => {
    setOpen(false);
    router.push("/profile");
  };

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
      className={`fixed top-0 left-0 right-0 z-50 w-full px-6 transition-all duration-300 z-50 px-4 sm:px-6 lg:px-8 ${isScrolled
          ? "bg-white/70 backdrop-blur-xl border-b border-border-warm/20 shadow-sm py-3"
          : "bg-transparent py-5"
        }`}
    >
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl font-black tracking-wide font-sans group sm:text-2xl"
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
        {/* theme and Humburger */}
        <div className="flex items-center gap-2 ">

  <button
    onClick={toggleTheme}
    className="w-10 h-10 rounded-full border bg-white flex items-center justify-center"
  >
    <Palette size={18}/>
  </button>

  <button
    onClick={() => setMobileOpen(!mobileOpen)}
    className="w-10 h-10 rounded-full border bg-white flex items-center justify-center lg:hidden"
  >
    {mobileOpen ? <X size={20}/> : <Menu size={20}/>}
  </button>

</div>

        {/* Navigation */}
       <nav className="hidden lg:flex items-center gap-8 text-base font-bold text-ink-muted">
          <Link href="#features" className={navLinkClasses}>
            المميزات
          </Link>

          <Link href="#how-it-works" className={navLinkClasses}>
            كيف تعمل
          </Link>

          <Link href="#cta" className={navLinkClasses}>
            داشبورد الاب
          </Link>

          <Link href="#pricing" className={navLinkClasses}>
            الأسعار
          </Link>
        </nav>

        {/* Actions */}
        <div className="hidden lg:flex items-center gap-4 font-sans">
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

              <div className="relative">
                <Button
                  variant="outline"
                  className="!py-2.5 !px-6"
                  onClick={() => setOpen(!open)}
                >
                  حسابي
                </Button>

                {open && (
                  <div
                    className="  absolute left-0 mt-3 w-72  bg-white rounded-2xl  shadow-xl border border-gray-100  p-5 z-50"  >
                    {/* Header */}
                    <div className="pb-4 border-b">
                      <h3 className="font-bold text-gray-900">
                        {user?.name || "Parent"}
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        {user?.email}
                      </p>
                    </div>

                    {/* Body */}
                    <div className="py-4 space-y-3">
                      <div>
                        <p className="text-xs text-gray-400">الاسم</p>
                        <p className="font-medium">{user?.name}</p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">البريد الإلكتروني</p>
                        <p className="font-medium">{user?.email}</p>
                      </div>
                    </div>
                    {/* edit button */}
                    <button
                      onClick={edit}
                      className="w-full py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                    >
                      تعديل الحساب
                    </button>
                    {/* Footer */}
                    <button
                      onClick={logout}
                      className=" w-full mt-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition"
                    >
                      تسجيل الخروج
                    </button>
                  </div>
                )}
              </div>

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
      {/* mobile menue */}
      {mobileOpen && (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    className="
      lg:hidden
      mt-4
      rounded-2xl
      bg-white
      shadow-xl
      p-5
      space-y-4
    "
  >
    <Link
      href="#features"
      onClick={() => setMobileOpen(false)}
      className="block"
    >
      المميزات
    </Link>

    <Link
      href="#how-it-works"
      onClick={() => setMobileOpen(false)}
      className="block"
    >
      كيف تعمل
    </Link>

    <Link
      href="#cta"
      onClick={() => setMobileOpen(false)}
      className="block"
    >
      داشبورد الأب
    </Link>

    <Link
      href="#pricing"
      onClick={() => setMobileOpen(false)}
      className="block"
    >
      الأسعار
    </Link>

    <hr />

    {accessToken ? (
      <>
        <Link href="/childAdventure">
          <Button className="w-full">
            🚀 مغامراتي
          </Button>
        </Link>

        <Button
          variant="outline"
          onClick={edit}
          className="w-full"
        >
          تعديل الحساب
        </Button>

        <Button
          variant="outline"
          onClick={logout}
          className="w-full"
        >
          تسجيل الخروج
        </Button>
      </>
    ) : (
      <>
        <Link href="/auth/login">
          <Button
            variant="outline"
            className="w-full"
          >
            تسجيل الدخول
          </Button>
        </Link>

        <Link href="/auth/register">
          <Button className="w-full">
            جرّب مجاناً
          </Button>
        </Link>
      </>
    )}
  </motion.div>
)}
    </motion.header>
  );
}

