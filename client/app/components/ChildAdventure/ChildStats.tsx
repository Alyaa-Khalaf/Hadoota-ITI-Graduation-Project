"use client";

import { motion } from "framer-motion";
import AdventureHeader from "./AdventureHeader";
import { useGamification } from "@/hooks/useGamification";

export default function ChildStats() {
  const { data, loading } = useGamification();

  if (loading) {
    return (
      <div className="text-center py-6">
        ⏳ Loading stats...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-6">
        لا توجد بيانات
      </div>
    );
  }

  const stars = data.stars;
  const level = data.level;

  const badge =
    stars >= 100
      ? "مستكشف محترف 🚀"
      : "مغامر صغير ✨";

  const items = [
    {
      id: 1,
      label: "نجمة",
      value: stars,
      icon: "⭐",
    },
    {
      id: 2,
      label: "مستوى",
      value: level,
      icon: "🏆",
    },
  ];

  return (
    <section>
      <AdventureHeader
        header="إنجازاتك"
        subHeader="شوف اللي حققته ⭐"
      />

      <motion.div
        dir="rtl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-2 gap-4 mt-8"
      >
        {items.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.05 }}
            className="
              rounded-3xl
              p-5
              text-center
              bg-cat-adventure
              border-[3px]
              border-primary
              shadow-lg
              font-bold
            "
          >
            <div className="text-4xl mb-3">
              {item.icon}
            </div>

            <div className="text-4xl text-secondary">
              {item.value}
            </div>

            <div className="mt-2 text-lg text-primary">
              {item.label}
            </div>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.02 }}
          className="
            col-span-2
            flex
            items-center
            gap-4
            rounded-3xl
            p-5
            bg-sunny
            border-[3px]
            border-white
            shadow-lg
          "
        >
          <span className="text-5xl">🏆</span>

          <div className="text-right text-ink">
            <h3 className="text-2xl font-bold">
              {badge}
            </h3>

            <p className="mt-1 font-medium">
              إنجاز رائع — استمر في التقدم ✨
            </p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}