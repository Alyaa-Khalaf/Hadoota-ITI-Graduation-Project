"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

// ألوان مستوحاة من سبايدر مان
const SPIDEY_COLORS = [
  { name: "أحمر سبايدر", value: "#E63946" },
  { name: "أزرق البطل", value: "#457B9D" },
  { name: "أسود العنكبوت", value: "#1D3557" },
  { name: "أبيض الشبكة", value: "#F1FAEE" }
];

export default function ColorsGame() {
  const [target, setTarget] = useState(SPIDEY_COLORS[0]);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("ساعد سبايدر مان في اختيار اللون!");

  const startNewRound = () => {
    const randomColor = SPIDEY_COLORS[Math.floor(Math.random() * SPIDEY_COLORS.length)];
    setTarget(randomColor);
    setMessage("وين اللون الـ " + randomColor.name + "؟");
  };

  const handleColorClick = (colorValue: string) => {
    if (colorValue === target.value) {
      setScore(score + 1);
      setMessage("كفو! سبايدر مان بطل! 🕸️");
      setTimeout(startNewRound, 1200);
    } else {
      setMessage("أوبس! حاول مرة ثانية يا بطل 🕷️");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 bg-slate-50 rounded-3xl border-4 border-primary">
      <h1 className="text-3xl font-black text-ink mb-2">مهمة سبايدر مان 🕷️</h1>
      <p className="text-lg text-ink-mute mb-6">{message}</p>
      
      {/* منطقة الهدف */}
      <div 
        className="w-40 h-40 rounded-full border-[6px] border-white shadow-2xl flex items-center justify-center mb-8 transition-colors duration-500"
        style={{ backgroundColor: target.value }}
      >
        <span className="text-5xl">🕸️</span>
      </div>
      
      {/* خيارات الألوان */}
      <div className="grid grid-cols-2 gap-4">
        {SPIDEY_COLORS.map((color) => (
          <motion.button
            key={color.value}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleColorClick(color.value)}
            className="w-32 h-32 rounded-2xl shadow-lg border-4 border-white transition-all"
            style={{ backgroundColor: color.value }}
          />
        ))}
      </div>

      <div className="mt-8 text-2xl font-bold text-primary">
        النقاط: {score}
      </div>
    </div>
  );
}