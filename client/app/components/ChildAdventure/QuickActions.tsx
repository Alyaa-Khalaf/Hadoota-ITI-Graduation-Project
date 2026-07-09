"use client";

import { motion } from "framer-motion";
import AdventureHeader from "./AdventureHeader";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";

export default function QuickActions() {
  const actions = [
    {
      id: 1,
      title: "ابدأ حكاية",
      icon: "📖",
      bgColor: "bg-blue-50 dark:bg-blue-950",
      borderColor: "border-blue-200 dark:border-blue-800",
      href: "/characters",
    },
    {
      id: 2,
      title: "اختار شخصية",
      icon: "🧑‍🚀",
      bgColor: "bg-purple-50 dark:bg-purple-950",
      borderColor: "border-purple-200 dark:border-purple-800",
      href: "/characters",
    },
    {
      id: 3,
      title: "ألغاز",
      icon: "🧠",
      bgColor: "bg-green-50 dark:bg-green-950",
      borderColor: "border-green-200 dark:border-green-800",
      href: "/games/GamesHub#puzzles",
    },
  ];

  return (
    <section className="space-y-6">
      <AdventureHeader header="إلى أين" subHeader="اختار ما تريد تفعله" />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {actions.map((action, index) => (
          <Link key={action.id} href={action.href} className="group">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.06, y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card
                className={`h-full ${action.bgColor} border-2 ${action.borderColor} transition-all group-hover:shadow-md cursor-pointer`}
              >
                <CardContent className="pt-6 pb-6 flex flex-col items-center justify-center gap-3 text-center h-full">
                  <span className="text-4xl sm:text-5xl">{action.icon}</span>
                  <span className="text-sm sm:text-base font-bold text-foreground">
                    {action.title}
                  </span>
                </CardContent>
              </Card>
            </motion.div>
          </Link>
        ))}
      </div>
    </section>
  );
}