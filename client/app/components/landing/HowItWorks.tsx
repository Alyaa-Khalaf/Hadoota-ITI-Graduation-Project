"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const steps = [
  {
    icon: "🧑",
    number: "١",
    title: "اختر الشخصية والموضوع",
    description:
      "ابدأ بتخصيص مغامرتك — اختر بطلك المفضل والمادة التي تريد إتقانها.",
    iconBg: "bg-sky-100",
    numberBg: "bg-primary",
  },
  {
    icon: "🎮",
    number: "٢",
    title: "استمتع بالقصة التفاعلية",
    description:
      "انغمس في قصة شيقة تعليمية مليئة بالتحديات والمفاجآت التي تنمّي معلوماتك.",
    iconBg: "bg-orange-100",
    numberBg: "bg-primary",
  },
  {
    icon: "🏆",
    number: "٣",
    title: "تعلم واكسب الجوائز",
    description:
      "اجمع النقاط وافتح الشارات والمكافآت كلما أتقنت مهارة جديدة.",
    iconBg: "bg-yellow-100",
    numberBg: "bg-primary",
  },
];

export default function HowItWorks() {
  return (
    <section dir="rtl" className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            كيف تعمل ؟
          </h2>
          <p className="text-lg text-gray-600">
            ثلاث خطوات بسيطة لتبدأ رحلتك التعليمية
          </p>
        </div>

        {/* Stepper connector row */}
        <div className="relative mb-12">
          <div className="flex items-center justify-between max-w-3xl mx-auto px-6">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex items-center flex-1 last:flex-none"
              >
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, type: "spring" }}
                  className={`flex items-center justify-center w-12 h-12 rounded-xl text-white font-bold text-lg shadow-md shrink-0 ${step.numberBg}`}
                >
                  {step.number}
                </motion.div>
                {index < steps.length - 1 && (
                  <div
                    className="flex-1 mx-3 border-t-2 border-dashed border-gray-300"
                    aria-hidden="true"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow border-gray-100">
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-16 h-16 rounded-2xl ${step.iconBg} flex items-center justify-center text-3xl mx-auto mb-4`}
                  >
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button
            size="lg"
            variant={"default"}
            className=" px-5 py-5 text-lg"
          >
            ابدأ مغامرتك الآن
          </Button>
          <p className="mt-4 text-sm text-gray-500">
            مجاني تماماً — لا بطاقة بنكية مطلوبة
          </p>
        </div>
      </div>
    </section>
  );
}
