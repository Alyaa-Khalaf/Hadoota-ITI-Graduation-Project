"use client";

import { useState } from "react";
import { useSelectedChild } from "@/context/childContext";
import Link from "next/link";
import { Menu, X, Shield } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import profileImage from "../../../public/assets/childAdventure.jpg"; // استبدل هذا بالمسار الصحيح لصورة الطفل

const navLinks = [
  { label: "الرئيسية", href: "/childAdventure" },
  { label: "المغامرات", href: "/childAdventure" },
  { label: "الألعاب", href: "/games/GamesHub" },
  { label: "الإعدادات", href: "/ParentDashboard/ParentLogin" },
];

export default function ChildNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { selectedChild } = useSelectedChild();

  return (
    <header className="sticky top-0 z-50 py-2 sm:py-4">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 pill-nav px-4 sm:px-6">
          {/* Logo */}
          <div className="flex items-center min-w-0">
            <Link href="/landing" className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="text-primary-foreground h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <span className="text-base sm:text-xl font-bold font-heading truncate text-foreground">
                بطل الأبطال
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-md font-bold text-foreground hover:bg-primary rounded-full px-4 py-2 transition-all"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            <span className="hidden md:block text-md font-bold text-muted-foreground truncate max-w-[120px]">
              {selectedChild?.name || "بطلنا"}
            </span>

             <div className="flex items-center gap-2">
  <input
    type="file"
    id="child-avatar-upload"
    className="hidden"
    accept="image/*"
    onChange={(e) => {
      // هنا تضعين منطق رفع الصورة لاحقاً
      console.log(e.target.files?.[0]);
    }}
  />
  <label htmlFor="child-avatar-upload" className="cursor-pointer">
    <div className="h-12 w-12 rounded-full border-2 border-primary overflow-hidden hover:scale-105 transition-all">
      <Image
        src={profileImage} // ضعي مسار صورة افتراضية أو اتركيها فارغة
        alt="صورة الطفل"
        className="h-full w-full object-cover"
      />
    </div>
  </label>
</div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-1.5 sm:p-2 text-foreground"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-sm font-medium text-foreground hover:text-accent transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <span className="text-sm font-medium text-muted-foreground">
                {selectedChild?.name || "بطلنا"}
              </span>
             <div className="flex items-center gap-2">
  <input
    type="file"
    id="child-avatar-upload"
    className="hidden"
    accept="image/*"
    onChange={(e) => {
      // هنا تضعين منطق رفع الصورة لاحقاً
      console.log(e.target.files?.[0]);
    }}
  />
  <label htmlFor="child-avatar-upload" className="cursor-pointer">
    <div className="h-12 w-12 rounded-full border-2 border-primary overflow-hidden hover:scale-105 transition-all">
      <Image
        src={profileImage} // ضعي مسار صورة افتراضية أو اتركيها فارغة
        alt="صورة الطفل"
        className="h-full w-full object-cover"
      />
    </div>
  </label>
</div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}