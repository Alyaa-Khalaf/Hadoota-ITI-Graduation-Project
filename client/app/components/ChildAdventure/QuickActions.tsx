"use client";

import { motion } from "framer-motion";
import AdventureHeader from "./AdventureHeader";
import Link from "next/link";
export default function QuickActions() {

  const actions = [
  {
    id: 1,
    title: "ابدأ حكاية",
    icon: "📖",
    color: "bg-cat-adventure",
    href: "/characters",
  },

  {
    id: 2,
    title: "اختار شخصية",
    icon: "🧑‍🚀",
    color: "bg-cat-magic",
    href: "/characters",
  },
  {
    id: 3,
    title: "ألغاز",
    icon: "🧠",
    color: "bg-cat-animals",
    href: "/games/GamesHub#puzzles", // أو أي section
  },
];

  return (
    <>
      <AdventureHeader header="إلى أين" />
      <div className="grid grid-cols-2 gap-4 mt-6">
        {actions.map((action, index) => (
  <Link key={action.id} href={action.href}>
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.06, y: -3 }}
      whileTap={{ scale: 0.95 }}
      className={`
        relative overflow-hidden
        p-5 rounded-3xl
        shadow-lg
        ${action.color}
        flex flex-col items-center justify-center gap-2
        text-center
        transition-all
      `}
    >
      <span className="text-4xl">{action.icon}</span>
      <span className="text-md font-bold text-header drop-shadow">
        {action.title}
      </span>
    </motion.div>
  </Link>
))}
      </div>
    </>
  );
}