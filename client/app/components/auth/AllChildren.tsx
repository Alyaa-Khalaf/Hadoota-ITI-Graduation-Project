"use client";

import { useRouter } from "next/navigation";
import { useChildren } from "@/hooks/useChildren";
import { useSelectedChild } from "@/context/childContext";
import { Sparkles } from "lucide-react";

export default function TheChildren() {
  const router = useRouter();

  const { children, loading } = useChildren();

  const { setSelectedChild } = useSelectedChild();

  if (loading) {
    return (
      <div dir="rtl" className="min-h-screen flex flex-col items-center justify-center gap-4 bg-page-warm">
        <div className="flex gap-3 text-4xl">
          <span className="animate-bounce">📖</span>
          <span className="animate-bounce [animation-delay:150ms]">✨</span>
          <span className="animate-bounce [animation-delay:300ms]">🦸</span>
        </div>
        <p className="text-sm text-ink-muted animate-pulse">
          جارٍ تحميل الأطفال...
        </p>
      </div>
    );
  }

  if (!children.length) {
    return (
      <div dir="rtl" className="min-h-screen flex flex-col items-center justify-center gap-3 bg-page-warm px-6 text-center">
        <div className="text-5xl">👶</div>
        <h2 className="text-lg font-bold text-ink">لا يوجد أطفال مسجلين بعد</h2>
        <p className="text-sm text-ink-muted max-w-xs">
          قم بإضافة طفل من لوحة التحكم للبدء في رحلة المغامرات
        </p>
        <button
          onClick={() => router.push("/ParentDashboard")}
          className="mt-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors"
        >
          الذهاب للوحة التحكم
        </button>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-page-warm p-6 sm:p-10">
      <div className="max-w-5xl mx-auto">

        <div className="text-center mb-10 space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black text-ink">
            من البطل اليوم؟ 🚀
          </h1>
          <p className="text-sm text-ink-muted">
            اختر طفلاً للانطلاق في رحلة المغامرات
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {children.map((child) => (
            <button
              key={child._id}
              type="button"
              onClick={() => {
                setSelectedChild(child);
                router.push("/childAdventure");
              }}
              className="group relative bg-white rounded-3xl p-6 text-center
                         border border-border-warm shadow-card
                         hover:shadow-story hover:-translate-y-1.5 hover:border-primary-light
                         active:scale-[0.98]
                         transition-all duration-300
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light"
            >
              {/* شارة سحرية صغيرة تظهر عند الـ hover */}
              <Sparkles
                size={16}
                className="absolute top-4 left-4 text-primary-light opacity-0 group-hover:opacity-100 transition-opacity"
              />

              <div className="w-24 h-24 mx-auto rounded-3xl bg-cat-adventure flex items-center justify-center text-5xl
                              group-hover:bg-primary-wash transition-colors duration-300">
                {child.avatar}
              </div>

              <h2 className="text-xl font-bold mt-4 text-ink">
                {child.name}
              </h2>

              <p className="text-sm text-ink-muted mt-1">
                {child.age} سنوات
              </p>

              <div className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-primary
                              opacity-0 group-hover:opacity-100 transition-opacity">
                ابدأ المغامرة
                <span className="group-hover:translate-x-[-2px] transition-transform">←</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}