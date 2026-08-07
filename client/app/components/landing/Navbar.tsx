"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, Palette, Sparkles, LogIn } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/Button";

const navigation = [
  { name: "المميزات", href: "#features" },
  { name: "كيف تعمل", href: "#how-it-works" },
  { name: "داشبورد الأب", href: "#cta" },
  { name: "الأسعار", href: "#pricing" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { accessToken } = useAuth();
  const { toggleTheme } = useTheme();
  const router = useRouter();

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50 shadow-sm"
      dir="rtl"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-2xl font-black text-foreground">
            <Sparkles className="h-6 w-6 text-primary animate-pulse" />
            حدوتة
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => (
              <Link

                key={item.name}
                href={item.href}
                className="px-4 py-2 rounded-full text-xl font-semibold text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* CTA - Desktop */}
          <div className="hidden lg:flex items-center gap-3 font-semibold ">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all"
            >
              <Palette className="h-5 w-5" />
            </button>

            {accessToken ? (
              <Button
                onClick={() => router.push("/childAdventure")}
                size="lg"
                variant="default"
                className="px-5 py-5 text-lg sm:text-md h-12"
              >
                🚀 مغامراتي
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="lg"
                  className="rounded-full font-medium h-12 px-6 text-base gap-2"
                  onClick={() => router.push("/auth/login")}
                >
                  تسجيل الدخول
                  <LogIn className="size-4" />
                </Button>

                <Button
                  onClick={() => router.push("/auth/register")}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full h-12 px-6 text-base font-semibold shadow-lg hover:shadow-primary/20 transition-all"
                >
                  جرّب مجانًا
                </Button>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-foreground rounded-lg hover:bg-muted transition-colors"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu - بستايل أكثر أناقة */}
      {isOpen && (
        <div className="lg:hidden bg-background border-t border-border animate-in slide-in-from-top-5 duration-200">
          <div className="container mx-auto px-4 py-6 space-y-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block py-3 px-4 rounded-xl text-xl font-bold text-muted-foreground hover:bg-primary/5 hover:text-primary transition-all"
              >
                {item.name}
              </Link>
            ))}

            <div className="flex flex-col gap-3 pt-4 border-t border-border font-semibold">
              {accessToken ? (
                <Button size="lg" className="h-12 text-base w-full" onClick={() => { setIsOpen(false); router.push("/childAdventure"); }}>
                  🚀 مغامراتي
                </Button>
              ) : (
                <>
                  <Button variant="outline" size="lg" className="h-12 text-base w-full " onClick={() => { setIsOpen(false); router.push("/auth/login"); }}>
                    تسجيل الدخول
                  </Button>
                  <Button size="lg" className="h-12 text-base w-full" onClick={() => { setIsOpen(false); router.push("/auth/register"); }}>
                    جرّب مجانًا
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}