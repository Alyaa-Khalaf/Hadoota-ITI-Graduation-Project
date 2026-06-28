"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

const featuresList = [
  "تقارير أسبوعية مفصلة عن مستوى طفلك",
  "تحكم كامل في وقت الشاشة والقصص",
  "تخصيص واختيار القيم اللغوية والأخلاقية",
];

export default function CTA() {
  return (
    <section
      id="cta"
      className="
        py-24
        bg-gradient-to-b
        from-page-warm
        via-page-dreamy/30
        to-white
      "
      dir="rtl"
    >
      <div className="container mx-auto max-w-7xl px-6 grid gap-12 lg:grid-cols-[1fr_1.1fr] items-center">

        {/* Mockup */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="
            relative
            rounded-3xl
            border
            border-primary/10
            bg-white
            p-8
            shadow-story
            min-h-[350px]
            flex
            flex-col
            justify-between
          "
        >
          {/* Header Card */}
          <div className="rounded-2xl bg-primary-wash p-6 border border-primary/10">
            <div className="h-4 w-28 rounded bg-primary/20 mb-3" />
            <div className="h-3 w-full rounded bg-primary/10 mb-2" />
            <div className="h-3 w-3/4 rounded bg-primary/10" />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="rounded-2xl bg-sky/5 p-5 border border-sky/10">
              <div className="h-3 w-16 rounded bg-sky/20 mb-3" />
              <div className="h-5 w-24 rounded bg-sky/30" />
            </div>

            <div className="rounded-2xl bg-blossom/5 p-5 border border-blossom/10">
              <div className="h-3 w-16 rounded bg-blossom/20 mb-3" />
              <div className="h-5 w-24 rounded bg-blossom/30" />
            </div>
          </div>

          {/* Progress */}
          <div className="mt-6 rounded-2xl bg-page-dreamy/50 p-5 border border-border-warm">
            <div className="h-3 w-24 rounded bg-primary/20 mb-4" />
            <div className="h-3 w-full rounded-full bg-primary/10 overflow-hidden">
              <div className="h-full w-[75%] rounded-full bg-primary" />
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <div className="space-y-8 font-sans">
          
          <div>
            <Badge variant="sky">
              👪 لوحة الأهل
            </Badge>
          </div>

          <h2 className="text-4xl font-black leading-tight tracking-tight text-header md:text-5xl">
            راحة بال تامة للآباء
          </h2>

          <p className="max-w-xl text-base font-bold leading-relaxed text-ink-muted md:text-lg">
            لوحة متكاملة تمنحك رؤية واضحة لتطور طفلك اللغوي،
            وتتيح لك إدارة أوقات الاستخدام واختيار التوجهات
            التعليمية المناسبة له بسهولة.
          </p>

          <div className="space-y-4">
            {featuresList.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 text-base font-bold text-ink"
              >
                <span
                  className="
                    flex
                    h-7
                    w-7
                    items-center
                    justify-center
                    rounded-full
                    bg-primary/10
                    text-primary
                    text-xs
                    font-black
                    shrink-0
                  "
                >
                  ✓
                </span>

                <p>{item}</p>
              </div>
            ))}
          </div>

          <div className="pt-4">
            <Link href="/auth/register">
              <Button
                variant="primary"
                className="text-base !py-4 !px-10"
              >
                استكشف لوحة الآباء
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}