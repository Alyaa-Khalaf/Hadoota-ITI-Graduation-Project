"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import AdventureHeader from "./AdventureHeader";

export default function QuickActions() {
  const router = useRouter();

  const actions = [
    {
      id: 1,
      title: "ابدأ حكاية",
      icon: "📖",
      color: "bg-cat-adventure",
      route: "/childTopics",
    },
    {
      id: 2,
      title: "حواديتك",
      icon: "📚",
      color: "bg-cat-nature",
      route: "/stories",
    },
    {
      id: 3,
      title: "اختار شخصية",
      icon: "🧑‍🚀",
      color: "bg-cat-magic",
      route: "/characters",
    },
    {
      id: 4,
      title: "ألغاز",
      icon: "🧠",
      color: "bg-cat-animals",
      route: "/games/GamesHub",
    },
  ];

  return (
    <>
    <AdventureHeader header="إلى أين" />
    <div className="grid grid-cols-2 gap-4 mt-6">
      {actions.map((action, index) => (
        <motion.button
          key={action.id}
          onClick={() => router.push(action.route)}
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
        </motion.button>
      ))}
    </div>
    </>
  );
}