"use client";

import { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import { useAuth } from "@/context/AuthContext";

/* الكتاب السحري: عنصر التوقيع - يفتح ويطلق نجوم القصة عند الـ hover */
function MagicStorybook() {
  const [isOpen, setIsOpen] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-60, 60], [8, -8]), {
    stiffness: 150,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mouseX, [-60, 60], [-8, 8]), {
    stiffness: 150,
    damping: 20,
  });
  const ref = useRef(null);

  function handleMouseMove(e) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
    setIsOpen(false);
  }

  return (
    <motion.div
      ref={ref}
      onMouseEnter={() => setIsOpen(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className="relative mx-auto mb-6 flex h-32 w-44 cursor-pointer items-center justify-center sm:h-40 sm:w-56"
    >
      {/* نجوم تتطلق من الكتاب لما يفتح */}
      {isOpen &&
        [...Array(6)].map((_, i) => (
          <motion.span
            key={i}
            className="pointer-events-none absolute text-xl"
            style={{ left: "50%", top: "30%" }}
            initial={{ opacity: 0, x: 0, y: 0, scale: 0.3 }}
            animate={{
              opacity: [0, 1, 0],
              x: (i - 2.5) * 26,
              y: -60 - (i % 3) * 18,
              scale: [0.3, 1, 0.6],
              rotate: i % 2 === 0 ? 180 : -180,
            }}
            transition={{ duration: 1.1, delay: i * 0.05, ease: "easeOut" }}
          >
            {["✨", "⭐", "💫"][i % 3]}
          </motion.span>
        ))}

      {/* الغطاء الخلفي للكتاب */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary to-sky shadow-2xl shadow-primary/30" />

      {/* صفحة الكتاب اللي بتفتح */}
      <motion.div
        className="absolute right-1/2 top-1/2 h-[88%] w-[46%] origin-right rounded-l-xl bg-white shadow-inner"
        style={{ translateY: "-50%" }}
        animate={{ rotateY: isOpen ? -150 : 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />

      <div className="absolute left-1/2 top-1/2 h-[88%] w-[46%] -translate-y-1/2 rounded-r-xl bg-white" />

      {/* رمز القصة في النص */}
      <motion.span
        className="relative z-10 text-5xl"
        animate={{ scale: isOpen ? 1.1 : 1, y: isOpen ? -4 : 0 }}
        transition={{ duration: 0.3 }}
      >
        📖
      </motion.span>
    </motion.div>
  );
}

export default function Hero() {
  const [openSchoolChoice, setOpenSchoolChoice] = useState(false);
  const { accessToken } = useAuth();

  return (
    <section
      className="relative overflow-hidden bg-story-bg pt-40 pb-24 text-center"
      dir="rtl"
    >
      {/* خلفية متحركة */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-12 h-96 w-96 -translate-x-1/2 rounded-full bg-sky/10 blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute right-10 top-40 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <div className="container mx-auto max-w-4xl px-4 flex flex-col items-center">

        {/* الكتاب السحري - عنصر التوقيع */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <MagicStorybook />
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <Badge variant="dreamy">
            ✨ التطبيق الأول لقصص الأطفال التفاعلية في مصر
          </Badge>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="max-w-4xl text-5xl md:text-6xl lg:text-7xl font-black leading-[1.15] tracking-tight"
        >
          حوّل وقت الشاشة إلى{" "}
          <motion.span
            className="relative inline-block text-primary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            مغامرة تعليمية
            <motion.svg
              viewBox="0 0 200 16"
              className="absolute -bottom-2 left-0 h-3 w-full text-sky"
              preserveAspectRatio="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9, ease: "easeInOut" }}
            >
              <motion.path
                d="M2 10 Q 50 2, 100 8 T 198 6"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
            </motion.svg>
          </motion.span>{" "}
          ممتعة
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 max-w-2xl text-lg md:text-xl text-ink-muted leading-loose"
        >
          قصص تفاعلية ذكية، آمنة ومسلية، مصممة خصيصاً لتنمية خيال طفلك وبناء
          مهاراته اللغوية والأخلاقية.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.45 }}
          className="mt-10 flex flex-col sm:flex-row items-center  gap-4 w-full sm:w-auto"
        >
          {accessToken ? (
            <>
              <Link href="/childAdventure">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    variant="sky"
                    fullWidth
                    className="text-lg !py-4 !px-10 "
                  >
                    🚀 متابعة رحلة طفلك
                  </Button>
                </motion.div>
              </Link>

              <Link href="/ParentDashboard">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    variant="outline"
                    fullWidth
                    className="text-lg !py-4 !px-10 hover:bg-primary hover:text-white border-primary"
                  >
                    لوحة التحكم
                  </Button>
                </motion.div>
              </Link>
            </>
          ) : (
            <>
              <div className="relative w-full sm:w-auto">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    variant="sky"
                    fullWidth
                    className="text-lg !py-4 !px-10 bg-primary relative overflow-hidden"
                    onClick={() => setOpenSchoolChoice((v) => !v)}
                  >
                    <motion.span
                      className="absolute inset-0 bg-white/20"
                      initial={{ x: "-100%" }}
                      animate={{ x: "200%" }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 1.5,
                        ease: "easeInOut",
                      }}
                      style={{ skewX: -20 }}
                    />
                    <span className="relative">ابدأ رحلة طفلك السحرية الآن ✨</span>
                  </Button>
                </motion.div>

                {openSchoolChoice && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-1/2 -translate-x-1/2 mt-3 w-56 bg-white shadow-xl rounded-xl overflow-hidden border z-50"
                  >
                    <Link
                      href="/auth/register/school"
                      className="block px-4 py-3 hover:bg-sky/10 text-right transition-colors"
                      onClick={() => setOpenSchoolChoice(false)}
                    >
                      تسجيل مدرسة
                    </Link>

                    <Link
                      href="/auth/register"
                      className="block px-4 py-3 hover:bg-sky/10 text-right border-t transition-colors"
                      onClick={() => setOpenSchoolChoice(false)}
                    >
                      ولي أمر
                    </Link>
                  </motion.div>
                )}
              </div>

              <Link href="#testimonials" className="w-full sm:w-auto">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    variant="outline"
                    fullWidth
                    className="text-lg !py-4 !px-10"
                  >
                    شاهد آراء الأهالي 💬
                  </Button>
                </motion.div>
              </Link>
            </>
          )}
        </motion.div>

        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
          className="mt-16 flex flex-wrap justify-center gap-4"
        >
          {[
            { variant: "sunny", label: "🧠 محتوى متوافق مع علم نفس الطفل" },
            { variant: "dreamy", label: "🛡️ آمن وخالٍ من الإعلانات تماماً" },
            { variant: "sky", label: "🔒 رقابة وتحكم كامل للأبوين" },
          ].map((b, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -3, scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <Badge variant={b.variant}>{b.label}</Badge>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}