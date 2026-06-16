"use client";

import { motion } from "framer-motion";
import AdventureHeader from "./AdventureHeader";

interface ChildStatsProps {
  stars?: number;
  stories?: number;
  badge?: string;
}

export default function ChildStats({stars = 25,stories = 8,badge = "مستكشف محترف",}: ChildStatsProps) {
  const items = [
    {id: 1,label: "نجمة",value: stars,icon: "⭐",},
    {id: 2,label: "حدوتة",value: stories,icon: "📚", },
  ];

  return (
    <section>
      <AdventureHeader
        header="إنجازاتك"
        subHeader="شوف اللي حققته ⭐"
      />

      <motion.div dir="rtl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 gap-4 mt-8"
      >
        {items.map((item, index) => (
          <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.15 }} whileHover={{ scale: 1.05 }} 
          className="rounded-3xl font-bold   p-5   text-center   bg-cat-adventure   border-[3px]   border-primary   shadow-lg " >
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="text-4xl mb-3"
            >
              {item.icon}
            </motion.div>

            <div className="text-4xl text-secondary">
              {item.value}
            </div>

            <div className="mt-2 text-lg text-primary">
              {item.label}
            </div>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
          className="col-span-2  flex items-center gap-4  rounded-3xl  p-5  bg-sunny  border-[3px]  border-white  shadow-lg"
        >
          <motion.span
            animate={{ rotate: [-6, 6, -6] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="text-5xl"
          >
            🏆
          </motion.span>

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