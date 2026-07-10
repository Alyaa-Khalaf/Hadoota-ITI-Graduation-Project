"use client";

import { motion } from "framer-motion";
import AdventureHeader from "./AdventureHeader";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

export default function QuickActions() {
  const actions = [
    { id: "01", title: "ابدأ حكاية", category: "مغامرات", image: "/assets/start story.jpg", href: "/characters" },
    { id: "02", title: "اختار شخصية", category: "استكشاف", image: "/assets/chooseChar.jpg", href: "/characters" },
    { id: "03", title: "تحديات وألغاز", category: "ذكاء", image: "/assets/adventure.jpg", href: "/games/GamesHub#puzzles" },
  ];

  return (
    <section className="container mx-auto py-12 px-4">
      <AdventureHeader header="إلى أين" subHeader="اختار ما تريد تفعله" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {actions.map((action, index) => (
          <Link key={action.id} href={action.href} className="group block">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative rounded-[2.5rem] overflow-hidden bg-muted aspect-[4/3]"
            >
              {/* الصورة */}
              <Image
                src={action.image}
                alt={action.title}
                fill
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* المحتوى */}
              <div className="absolute inset-0 p-8 flex flex-col justify-between">
                {/* الجزء العلوي - الفئة */}
                <div className="flex justify-start">
                  <span className="px-4 py-1.5 rounded-full bg-primary backdrop-blur-md text-xs font-medium text-white border border-white/20">
                    {action.category}
                  </span>
                </div>

                {/* الجزء السفلي - العنوان */}
                <div>
                  <span className="text-white/60 text-xs font-medium tracking-wider block mb-2">{action.id}</span>
                  <h3 className="text-white text-2xl font-bold tracking-tight text-center">{action.title}</h3>
                </div>
              </div>

              {/* الزر الدائري في الزاوية */}
              <div className="absolute bottom-6 right-6 w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg transform transition-transform duration-300 group-hover:rotate-45">
                <ArrowUpRight className="w-6 h-6 text-slate-900" />
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </section>
  );
}