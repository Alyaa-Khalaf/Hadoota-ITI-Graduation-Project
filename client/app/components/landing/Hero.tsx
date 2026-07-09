"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ArrowLeft } from "lucide-react";
import heroImage from "../../../public/assets/kidsHero.jpg";

export default function Hero() {
  return (
    <section className="relative flex items-center overflow-hidden py-32 md:py-48" dir="rtl">
      {/* الخلفية مع Overlay */}
      <div className="absolute inset-0">
        <Image
          src={heroImage}
          alt="مغامرة حدوتة التعليمية"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative container mx-auto px-6 z-10">
        <div className="max-w-2xl">
          {/* تقييمات النجوم - مثل التمبليت */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-6 bg-white/10 w-fit px-4 py-1.5 rounded-full backdrop-blur-md border border-white/20"
          >
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-sm font-bold text-white">4.9/5 من 450+ تقييم</span>
          </motion.div>

          {/* العنوان مع التدرج اللوني */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-white leading-tight mb-6"
          >
            حوّل وقت الشاشة إلى{" "}
            <span className="inline-block  text-primary">
              مغامرة تعليمية
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-xl text-white/90 mb-10 leading-relaxed max-w-lg font-bold"
          >
            قصص تفاعلية ذكية مصممة خصيصاً لتنمية خيال طفلك وبناء مهاراته في بيئة آمنة وممتعة.
          </motion.p>

          {/* الأزرار */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button size="lg" className="rounded-full px-8 py-7 text-lg font-bold shadow-xl bg-primary hover:bg-primary/90">
              ابدأ رحلة طفلك الآن <ArrowLeft className="mr-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="destructive" className="rounded-full px-8 py-7 text-lg font-bold border-white/30 text-white hover:bg-white/10 backdrop-blur-sm">
              شاهد آراء الأهالي
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0 120L60 105C120 90 240 60 360 52.5C480 45 600 60 720 67.5C840 75 960 75 1080 67.5C1200 60 1320 45 1380 37.5L1440 30V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="hsl(var(--background))"
          />
        </svg>
      </div>
    </section>
  );
}