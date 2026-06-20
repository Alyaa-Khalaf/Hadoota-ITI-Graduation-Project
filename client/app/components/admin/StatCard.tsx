"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  accent?: string;
  delay?: number;
}

export default function StatCard({
  icon: Icon,
  label,
  value,
  accent = "text-[#FF7043]",
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="bg-white rounded-3xl border border-[#E8DED4] shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition"
    >
      <div className={`shrink-0 w-12 h-12 rounded-2xl bg-[#FFF5E6] flex items-center justify-center ${accent}`}>
        <Icon size={24} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-bold text-[#7A6552] truncate">{label}</p>
        <p className={`text-2xl font-black mt-0.5 ${accent}`}>{value}</p>
      </div>
    </motion.div>
  );
}
