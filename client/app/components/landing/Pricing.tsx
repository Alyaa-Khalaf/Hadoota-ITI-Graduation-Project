"use client";
import { motion } from "framer-motion";
// استيراد المكونات الموحدة بالمسار النسبي الصحيح
import Badge from "../ui/Badge";
import Card from "../ui/Card";
import Button from "../ui/Button";

const plans = [
  {
    title: "مجانى",
    price: "٠",
    description: "ابدأ التجربة مع قصص وأنشطة محدودة بدون أي التزام مالي.",
    features: ["محتوى تعليمي أساسي", "متابعة تقدم بسيطة", "تحديثات دورية مجانية"],
    highlight: false,
    badge: "تجربة البداية",
  },
  {
    title: "الأساسي",
    price: "٤٩",
    description: "الوصول الكامل للطفل مع تقارير أسبوعية وأدوات تحكم متقدمة للأهل.",
    features: ["مكتبة قصص تفاعلية كاملة", "تقارير أداء ذكية للأهل", "تحكم أبوي كامل في وقت الشاشة"],
    highlight: true,
    badge: "الأكثر شعبية 🔥",
  },
  {
    title: "المتميز",
    price: "٧٩",
    description: "أدوات تعليمية أعمق، ميزات ذكاء اصطناعي، وتجربة مخصصة لكل طفل.",
    features: ["تخصيص كامل لمسار طفلك", "تحديات واختبارات لغوية إضافية", "دعم فني وتوجيه أولي خاص"],
    highlight: false,
    badge: "العائلات المتميزة",
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="bg-story-bg py-24" dir="rtl">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* البادج العلوي والعناوين المنسقة */}
        <div className="mx-auto mb-16 max-w-3xl text-center font-sans">
          <div>
            <Badge variant="sunny">💰 الأسعار بخطط مرنة</Badge>
          </div>
          
          <h2 className="mt-4 text-4xl font-black text-ink md:text-5xl tracking-tight">
            اختر الخطة المناسبة <span className="text-primary">لطفلك</span>
          </h2>
          <p className="mt-3 text-base font-bold text-ink-muted md:text-lg">
            حلول مرنة تناسب احتياجات الأطفال والأهل مع ميزات واضحة وبدون مصاريف مخفية.
          </p>
        </div>

        {/* شبكة الكروت الثلاثية الموروثة من الـ UI */}
        <div className="grid gap-8 md:grid-cols-3 items-stretch font-sans">
          {plans.map((plan) => (
            <motion.div
              key={plan.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              whileHover={{ y: -6 }}
              className="flex"
            >
              {/* وراثة الكارت بالكامل مع تطبيق ستايل الـ Highlight للخطة النشطة */}
              <Card 
                hoverEffect={false} // قفلناه هنا عشان الـ Framer Motion هو اللي بيتحكم في الـ Hover للـ Wrapper
                className={`w-full flex flex-col justify-between p-8 ${
                  plan.highlight ? "border-2 border-primary shadow-xl" : ""
                }`}
              >
                <div>
                  {/* بادج الكارت الداخلي الصغير موروث من الـ ui */}
                  <div className="mb-5">
                    <Badge variant={plan.highlight ? "sunny" : "dreamy"}>
                      {plan.badge}
                    </Badge>
                  </div>

                  {/* اسم الخطة */}
                  <h3 className="text-xl font-black text-ink">{plan.title}</h3>
                  
                  {/* السعر والعملة */}
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-5xl font-black text-ink tracking-tight">{plan.price}</span>
                    <span className="text-sm font-black text-ink-muted">جنيه / شهرياً</span>
                  </div>
                  
                  <p className="mt-4 text-sm font-bold leading-relaxed text-ink-muted">{plan.description}</p>

                  {/* قائمة الميزات */}
                  <ul className="mt-8 space-y-4 text-sm font-bold text-ink/90">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-page-sky text-xs font-black text-sky">
                          ✓
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* أزرار التحكم موروثة بالكامل من الـ UI بنظافة */}
                <div className="mt-10">
                  <Button
                    variant={plan.highlight ? "primary" : "sky"}
                    fullWidth={true}
                    className="!text-base font-black"
                  >
                    اختر خطة {plan.title}
                  </Button>
                </div>

              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}