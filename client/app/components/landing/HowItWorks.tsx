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
    description: "يختار طفلك بطلاً لقصته وموضوعاً يثير فضوله ويبدأ رحلته الخاصة.",
  },
  {
    icon: "🧩",
    number: "٢",
    title: "استمتع بالقصة التفاعلية",
    description: "الذكاء الاصطناعي يبني قصة فريدة فوراً مع صور مبهجة وأصوات واختيارات مشوقة.",
  },
  {
    icon: "🏆",
    number: "٣",
    title: "تعلم واكسب الجوائز",
    description: "أسئلة ذكية وممتعة في نهاية كل قصة لتعزيز الفهم اللغوي وكسب نقاط المكافأة.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24" dir="rtl">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* النصوص العلوية المنسقة بالبادج الموحد والخط العريض */}
        <div className="mx-auto mb-16 max-w-3xl text-center font-sans">
          <Badge variant="dreamy">كيف تبدأ المغامرة؟</Badge>
          
          <h2 className="mt-4 text-4xl font-black text-ink md:text-5xl tracking-tight">
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
                hoverEffect={true}
                className="w-full bg-page-dreamy/30 border border-border-warm/40 p-8 text-center flex flex-col items-center justify-between"
              >
                <div>
                  {/* دائرة الأيقونة أو الإيموجي */}
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-page-warm text-3xl shadow-sm border border-border-warm/20">
                    {step.icon}
                  </div>
                  
                  {/* رقم الخطوة الدائري الملون بروح الموف السحري */}
                  <div className="mt-5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-magic/10 text-lg font-black text-magic">
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