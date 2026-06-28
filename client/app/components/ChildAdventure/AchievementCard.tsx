"use client";

import { motion } from "framer-motion";

interface AchievementCardProps {
  title: string;
  icon: string;
  description: string;
  unlocked?: boolean;
  index?: number;
}

export default function AchievementCard({
  title,
  icon,
  description,
  unlocked = false,
  index = 0,
}: AchievementCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.05 }}
      className={`
        rounded-3xl
        p-4
        text-center
        shadow-lg
        border-[3px]
        transition-all
        ${
          unlocked
            ? "bg-sunny border-white"
            : "bg-blossom border-white opacity-70"
        }
      `}
    >
      <div className="text-4xl mb-3">{icon}</div>

      <h3 className="text-lg font-bold text-ink">{title}</h3>

      <p className="mt-1 text-sm text-ink-mute">{description}</p>

      <div className="mt-3 text-sm font-bold">
        {unlocked ? (
          <span className="text-primary">مفتوح ✨</span>
        ) : (
          <span className="text-ink-mute">مغلق 🔒</span>
        )}
      </div>
    </motion.div>
  );
}