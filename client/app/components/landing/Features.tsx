"use client";

import { motion } from "framer-motion";
import Card from "../ui/Card";

const topics = [
  { icon: "🦕", label: "الديناصورات", color: "bg-meadow/15", text: "text-meadow" },
  { icon: "🚀", label: "الفضاء", color: "bg-sky/15", text: "text-sky" },
  { icon: "🦁", label: "الحيوانات", color: "bg-sunny/20", text: "text-amber-600" },
  { icon: "🌊", label: "البحر", color: "bg-sky/10", text: "text-sky" },
  { icon: "⭐", label: "الأنبياء", color: "bg-magic/15", text: "text-magic" },
  { icon: "🌱", label: "النباتات", color: "bg-meadow/15", text: "text-meadow" },
  { icon: "🏛️", label: "مصر الجميلة", color: "bg-primary/10", text: "text-primary" },
  { icon: "🎨", label: "الألوان", color: "bg-blossom/15", text: "text-blossom" },
  { icon: "🔢", label: "الأرقام", color: "bg-sunny/20", text: "text-amber-600" },
  { icon: "👨‍👩‍👧", label: "العائلة", color: "bg-rose/15", text: "text-rose" },
];

export default function Features() {
  return (
    <section
      id="features"
      className="bg-gradient-to-b from-page-dreamy/40 to-page-warm/40 py-24"
      dir="rtl"
    >
      <div className="container mx-auto max-w-7xl px-6">
        
        <div className="mx-auto mb-16 max-w-3xl text-center font-sans">
          <h2 className="text-4xl font-black tracking-tight text-header md:text-5xl">
            آلاف المواضيع لاكتشافها
          </h2>

          <p className="mt-4 text-base font-bold text-ink-muted md:text-lg">
            دع طفلك يختار موضوعه المفضل لبناء قصته الفريدة
          </p>
        </div>

        <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-4 font-sans">
          {topics.map((topic, index) => (
            <motion.div
              key={topic.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.45,
                delay: index * 0.04,
              }}
              className="flex min-w-[140px] w-[calc(50%-8px)] sm:w-[calc(33.33%-12px)] md:w-[calc(25%-12px)] lg:w-[calc(16.66%-14px)]"
            >
              <Card
                hoverEffect
                className="
                  w-full
                  cursor-pointer
                  select-none
                  border
                  border-primary/10
                  bg-white/80
                  backdrop-blur-sm
                  p-6
                  flex
                  flex-col
                  items-center
                  justify-center
                  text-center
                "
              >
                <div
                  className={`
                    mb-4
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    text-3xl
                    ${topic.color}
                  `}
                >
                  {topic.icon}
                </div>

                <h3
                  className={`
                    text-sm
                    font-black
                    tracking-tight
                    ${topic.text}
                  `}
                >
                  {topic.label}
                </h3>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}