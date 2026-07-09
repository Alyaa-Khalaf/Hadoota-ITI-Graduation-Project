"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSelectedChild } from "@/context/childContext";
import Link from "next/link";
import { Home, Compass, Gamepad2, Settings, Shield, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "الرئيسية", icon: Home, href: "/childAdventure" },
  { label: "المغامرات", icon: Compass, href: "/childAdventure" },
  { label: "الألعاب", icon: Gamepad2, href: "/games/GamesHub" },
  { label: "الإعدادات", icon: Settings, href: "/ParentDashboard/ParentLogin" },
];

export default function ChildNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { selectedChild } = useSelectedChild();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-slate-900/90 backdrop-blur-md shadow-lg" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/landing" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-teal-500/20 backdrop-blur-sm flex items-center justify-center border border-teal-300/20">
            <Shield size={20} className="text-teal-300" />
          </div>
          <span className="font-heading text-xl font-extrabold text-white">بطل<span className="text-teal-300"> الأبطال</span></span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 bg-white/5 rounded-full p-1 border border-white/5">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="px-5 py-2 rounded-full text-sm font-bold text-white/80 hover:text-white hover:bg-white/10 transition-all">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <p className="font-bold text-white/90 text-sm hidden xl:block">{selectedChild?.name || "بطلنا"}</p>
          <Button asChild className="bg-coral-500 hover:bg-coral-600 text-white rounded-full font-bold px-6">
            <Link href="/ParentDashboard/ParentLogin">لوحة الأهل</Link>
          </Button>
        </div>

        <button className="lg:hidden p-2 text-white" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}