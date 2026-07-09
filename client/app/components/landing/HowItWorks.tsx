"use client";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const steps = [
  {
    icon: "🧑",
    number: "١",
    title: "اختر الشخصية والموضوع",
    description: "ابدأ بتخصيص مغامرتك — اختر بطلك المفضل والمادة التي تريد إتقانها.",
    color: "text-sky",
    iconBg: "bg-sky/15",
    active: false,
  },
  {
    icon: "🎮",
    number: "٢",
    title: "استمتع بالقصة التفاعلية",
    description: "انغمس في قصة شيقة تعليمية مليئة بالتحديات والمفاجآت التي تنمّي معلوماتك.",
    color: "text-primary",
    iconBg: "bg-primary/15",
    active: true,
  },
  {
    icon: "🏆",
    number: "٣",
    title: "تعلم واكسب الجوائز",
    description: "اجمع النقاط وافتح الشارات والمكافآت كلما أتقنت مهارة جديدة.",
    color: "text-amber-600",
    iconBg: "bg-sunny/25",
    active: false,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24" dir="rtl">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid gap-8 md:grid-cols-3 items-stretch">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
              className="flex"
            >
              <Card
                className={`w-full rounded-2xl transition-all duration-300 ${
                  step.active
                    ? "border-2 border-primary shadow-lg"
                    : "border border-border-warm/30 shadow-none"
                }`}
              >
                <CardContent className="p-8 text-center flex flex-col items-center">
                  {/* الأيقونة */}
                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-2xl border border-border-warm/20 text-3xl ${step.iconBg}`}
                  >
                    {step.icon}
                  </div>

                  {/* رقم الخطوة */}
                  <div
                    className={`mt-5 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-black ${step.color}`}
                  >
                    {step.number}
                  </div>

                  {/* العنوان */}
                  <h3 className="mt-5 text-lg font-black text-ink">
                    {step.title}
                  </h3>

                  {/* الوصف */}
                  <p className="mt-3 text-sm font-bold text-ink-muted leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 flex flex-col items-center text-center">
          <Button className="rounded-full bg-primary hover:bg-primary/90 text-white px-8 py-6 text-base font-black">
            ابدأ مغامرتك الآن
          </Button>
          <p className="mt-4 text-sm font-bold text-ink-muted">
            مجاني تماماً — لا بطاقة بنكية مطلوبة
          </p>
        </div>
      </div>
    </section>
  );
}