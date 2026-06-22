"use client";
import { motion } from "framer-motion";
// استيراد المكونات الموحدة بالمسار النسبي الصحيح
import Badge from "../ui/Badge";
import Card from "../ui/Card";

const steps = [
  {
    icon: "🧙‍♂️",
    number: "١",
    title: "اختر الشخصية والموضوع",
    description: "...",
    color: "bg-sky/10 text-sky",
    iconBg: "bg-sky/15",
  },
  {
    icon: "🧩",
    number: "٢",
    title: "استمتع بالقصة التفاعلية",
    description: "...",
    color: "bg-primary/10 text-primary",
    iconBg: "bg-primary/15",
  },
  {
    icon: "🏆",
    number: "٣",
    title: "تعلم واكسب الجوائز",
    description: "...",
    color: "bg-sunny/20 text-amber-600",
    iconBg: "bg-sunny/25",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24" dir="rtl">
      <div className="container mx-auto px-6 max-w-7xl">

        {/* النصوص العلوية المنسقة بالبادج الموحد والخط العريض */}
        <div className="mx-auto mb-16 max-w-3xl text-center font-sans">
         <Badge variant="sky">
           كيف تبدأ المغامرة؟
        </Badge>
          <h2 className="mt-4 text-4xl md:text-5xl font-black text-header tracking-tight">
            ثلاث خطوات بسيطة لتجربة تعليمية ممتعة
          </h2>
          <p className="mt-4 text-base font-bold text-ink-muted md:text-lg">
            نمط واضح وبسيط للأطفال والأهل مع تجربة تبدأ سريعاً وتبقي الجميع متحمسين.
          </p>
        </div>

        {/* شبكة الكروت الموروثة من الـ UI */}
        <div className="grid gap-8 md:grid-cols-3 items-stretch font-sans">
          {steps.map((step) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex"
            >
              {/* وراثة الكارت بالكامل وجعل الخلفية الهادئة مريحة للعين */}
              <Card
                hoverEffect
                className=" w-full bg-white/80 backdrop-blur-sm border border-primary/10 shadow-card p-8 text-center flex flex-col items-center justify-between"
              >
                <div>
                  {/* دائرة الأيقونة أو الإيموجي */}
                  <div
                    className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl text-3xl border border-border-warm/20 ${step.iconBg}`}
                  >
                    {step.icon}
                  </div>

                  {/* رقم الخطوة الدائري الملون بروح الموف السحري */}
                  <div
                    className={`mt-5 inline-flex h-10 w-10 items-center justify-center hover:bg-primary hover:text-white rounded-full font-black ${step.color}`}
                  >
                    {step.number}
                  </div>

                  {/* عنوان الخطوة */}
                  <h3 className="mt-5 text-xl font-black text-ink tracking-tight">
                    {step.title}
                  </h3>
                </div>

                {/* وصف الخطوة السفلي */}
                <p className="mt-4 text-sm font-bold leading-relaxed text-ink-muted">
                  {step.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}