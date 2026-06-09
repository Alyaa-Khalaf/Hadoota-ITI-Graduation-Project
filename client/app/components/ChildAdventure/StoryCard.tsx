"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface StoryCardProps {
  id: number | string;
  title: string;
  emoji: string;
  date?: string;
  progress?: number;
  onClickType?: "open" | "continue";
}

export default function StoryCard({
  id,
  title,
  emoji,
  date,
  progress = 0,
  onClickType = "open",
}: StoryCardProps) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="
        flex items-center justify-between
        bg-white rounded-3xl p-4
        shadow-sm border border-gray-100
      "
    >
      {/* Left Side */}
      <div className="flex items-center gap-3">
        <span className="text-3xl">{emoji}</span>

        <div className="text-right">
          <h3 className="font-black text-sm text-gray-800">
            {title}
          </h3>

          {date && (
            <p className="text-xs text-gray-400">{date}</p>
          )}

          {/* Progress bar */}
          <div className="w-32 h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-orange-400 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Action Button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() =>
          router.push(`/stories/${id}`)
        }
        className="
          text-xs font-black
          bg-orange-100 text-orange-600
          px-3 py-2 rounded-xl
        "
      >
        {onClickType === "continue" ? "تكملة" : "فتح"}
      </motion.button>
    </motion.div>
  );
}