"use client";

import { motion } from "framer-motion";

export default function FloatingDecorations() {
  const items = [
    { id: 1, icon: "☁️", size: 40, top: "10%", left: "5%", duration: 6 },
    { id: 2, icon: "⭐", size: 30, top: "20%", left: "80%", duration: 5 },
    { id: 3, icon: "🌙", size: 45, top: "60%", left: "10%", duration: 7 },
    { id: 4, icon: "✨", size: 25, top: "75%", left: "85%", duration: 4 },
    { id: 5, icon: "☁️", size: 35, top: "40%", left: "50%", duration: 6.5 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {items.map((item) => (
        <motion.div
          key={item.id}
          className="absolute opacity-70"
          style={{
            top: item.top,
            left: item.left,
            fontSize: item.size,
          }}
          animate={{
            y: [0, -15, 0],
            x: [0, 10, -10, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {item.icon}
        </motion.div>
      ))}
    </div>
  );
}