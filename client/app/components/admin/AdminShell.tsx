"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

export interface AdminSection {
  key: string;
  label: string;
  icon: LucideIcon;
}

interface AdminShellProps {
  sections: AdminSection[];
  active: string;
  onSelect: (key: string) => void;
  adminName?: string;
  onLogout?: () => void;
  children: React.ReactNode;
}

export default function AdminShell({
  sections,
  active,
  onSelect,
  adminName,
  onLogout,
  children,
}: AdminShellProps) {
  return (
    <div dir="rtl" className="min-h-screen bg-[#FFFBF0] font-sans text-[#3D2C1E] flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="lg:w-64 shrink-0 bg-white border-l border-[#E8DED4] lg:min-h-screen">
        <div className="p-5 border-b border-[#E8DED4] flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FF7043] to-[#C77DFF] flex items-center justify-center text-white text-xl shadow-sm">
            🛠️
          </div>
          <div>
            <h1 className="text-base font-black text-[#3D2C1E]">لوحة الإدارة</h1>
            <p className="text-[11px] text-[#7A6552]">{adminName || "مدير النظام"}</p>
          </div>
        </div>

        <nav className="p-3 flex lg:flex-col gap-1 overflow-x-auto">
          {sections.map((s) => {
            const Icon = s.icon;
            const isActive = active === s.key;
            return (
              <button
                key={s.key}
                onClick={() => onSelect(s.key)}
                className={`relative flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-bold whitespace-nowrap transition ${
                  isActive ? "text-white" : "text-[#7A6552] hover:bg-[#FFF5E6]"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="admin-active-pill"
                    className="absolute inset-0 bg-[#FF7043] rounded-2xl -z-0"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-3">
                  <Icon size={18} /> {s.label}
                </span>
              </button>
            );
          })}
        </nav>

        {onLogout && (
          <div className="p-3 mt-auto hidden lg:block">
            <button
              onClick={onLogout}
              className="w-full px-4 py-2.5 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 transition text-right"
            >
              تسجيل الخروج
            </button>
          </div>
        )}
      </aside>

      {/* Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}

