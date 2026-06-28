"use client";

import { motion } from "framer-motion";
import Badge from "../ui/Badge";
import Card from "../ui/Card";
import {useEffect, useState} from "react";

const list = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: "easeOut",
    },
  },
};

type Testimonial = {
  id: string;
  name: string;
  role: string;
  title: string;
  quote: string;
  avatar?: string;
  avatarBg?: string;
};

export default function Testimonials() {
  const [testimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    void (async () => {
      try {
        // no-op placeholder

        // استبدل ده بالـ endpoint الحقيقي لاحقاً
        // const res = await fetch("/api/testimonials");
        // const data = await res.json();
        // setTestimonials(data.data?? []);

      } catch (error) {
        console.error("Failed to fetch testimonials", error);
      } finally {
        // no-op placeholder
      }
    })();
  }, []);

  return (
    <section
      id="testimonials"
      className="bg-story-bg py-24"
      dir="rtl"
    >
      <div className="mx-auto max-w-7xl px-6 text-center font-sans">
        
        <div>
          <Badge variant="sunny">
            آراء الأهل
          </Badge>
        </div>

        <h2 className="mt-4 text-4xl font-black tracking-tight text-header md:text-5xl">
          ماذا يقول <span className="text-primary">أهالينا؟</span>
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-base font-bold text-ink-muted md:text-lg">
          أكثر من عائلة مصرية وثقت بحدوتة – إليك بعض آرائهم
        </p>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={list}
          className="mt-16 grid gap-8 text-right md:grid-cols-3"
        >
          {testimonials?.map((t) => (
            <motion.div key={t.id} variants={item} className="flex">
              {/* وراثة الكارت بالكامل وجعله يتمدد ليتساوى مع جيرانه تلقائياً */}
              <Card 
                hoverEffect={true} 
                className="relative flex flex-col justify-between w-full p-8"
              >
                <div>
                  <div
                    className="
                      absolute
                      top-5
                      left-5
                      text-5xl
                      font-serif
                      text-primary/10
                      select-none
                    "
                  >
                    ❞
                  </div>

                  <div className="mb-5">
                    <Badge variant={"sky"}>{t.title}</Badge>
                  </div>

                  <p className="text-sm font-bold leading-relaxed text-ink-muted">
                    {t.quote}
                  </p>
                </div>

                <div className="mt-8 border-t border-border-warm pt-5">
                  <div className="flex items-center gap-3">
                    <div
                      className={`
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-full
                        text-lg
                        shadow-sm
                        ${t.avatarBg}
                      `}
                    >
                      {t.avatar}
                    </div>

                    <div>
                      <p className="text-sm font-black text-ink">
                        {t.name}
                      </p>

                      <p className="mt-0.5 text-xs font-bold text-ink-muted">
                        {t.role}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className={`
                    absolute
                    top-0
                    right-0
                    h-1.5
                    w-full
                    rounded-t-3xl
                    bg-primary
                  `}
                />
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}