"use client";

import { motion } from "framer-motion";
import Badge from "../ui/Badge";
import Card from "../ui/Card";

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

const testimonials = [
  {
    name: "أ. هدى منصور",
    role: "معلمة روضة – القاهرة",
    title: "النتيجة في الفصل كانت مذهلة",
    quote:
      "استخدمت حدوتة في فصلي مع ٢٢ طفل - النتيجة كانت مذهلة! الأطفال بقوا يحبوا القراءة وعندهم مفردات أكثر بكثير. الأسئلة في نهاية القصة بتقيم الفهم بشكل ممتع ومحفز.",
    avatar: "👩‍🏫",
    avatarBg: "bg-meadow/15",
    accent: "text-meadow",
    badge: "sunny",
  },
  {
    name: "منى إبراهيم",
    role: "أم وطبيبة أطفال",
    title: "آمنة ١٠٠٪ وبتعلّم قيم حلوة",
    quote:
      "كأم وطبيبة أطفال، أهتم جداً بنوعية المحتوى. حدوتة آمنة ١٠٠٪ وبتعلّم قيم حلوة زي الصدق والشجاعة. بنتي سلمى بتحكيلي القصص وهي فرحانة – ده أكثر حاجة ممكن أتمنّاها.",
    avatar: "👩‍⚕️",
    avatarBg: "bg-primary/10",
    accent: "text-primary",
    badge: "dreamy",
  },
  {
    name: "أحمد السيد",
    role: "أب لطفلين",
    title: "غيّرت علاقة أولادي بالشاشة تماماً",
    quote:
      "أولادي كانوا بيقضوا ساعات طويلة بدون فائدة، لكن مع حدوتة الوضع اتغيّر تماماً. بقوا بيسمعوا ويتعلموا، وأنا بتابع تقارير ذكاء أطفال أول بأول وأشوف بالظبط إيه اللي اتعلموه.",
    avatar: "👨",
    avatarBg: "bg-sky/10",
    accent: "text-sky",
    badge: "sunny",
  },
];

export default function Testimonials() {
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
          {testimonials.map((t) => (
            <motion.div
              key={t.name}
              variants={item}
              className="flex"
            >
              <Card
                hoverEffect
                className="
                  relative
                  flex
                  w-full
                  flex-col
                  justify-between
                  border
                  border-primary/10
                  bg-white/90
                  backdrop-blur-sm
                  p-8
                  shadow-card
                "
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
                    <Badge variant={ "sky"}>
                      "{t.title}"
                    </Badge>
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