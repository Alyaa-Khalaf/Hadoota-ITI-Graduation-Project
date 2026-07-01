"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
// استيراد المكونات الموحدة بالمسار النسبي الصحيح
import Badge from "../ui/Badge";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { API_BASE } from "@/lib/apiConfig";
import type { Plan } from "@/types/pricing";

export default function Pricing() {
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [checkoutSlug, setCheckoutSlug] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/plans`)
      .then((res) => res.json())
      .then((result) => {
        if (result?.success && Array.isArray(result.data)) setPlans(result.data);
      })
      .catch(() => {
        // فشل الجلب — نعرض حالة فاضية بدون كسر الصفحة
      });
  }, []);

  // اختيار خطة: لو مسجّل دخول → يروح بوابة الدفع مباشرة، لو لأ → لصفحة تسجيل الدخول
  const handleChoose = (slug: string) => {
    setCheckoutSlug(slug);
    router.push(`/dashboard/subscription?plan=${encodeURIComponent(slug)}`);
  };

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

        {plans.length === 0 ? (
          <p className="text-center text-base font-bold text-ink-muted">
            لا توجد خطط متاحة حالياً.
          </p>
        ) : (
        /* شبكة الكروت موروثة من الـ UI */
        <div className="grid gap-8 md:grid-cols-3 items-stretch font-sans">
          {plans.map((plan) => (
            <motion.div
              key={plan._id}
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
                  {plan.badge && (
                    <div className="mb-5">
                      <Badge variant={plan.highlight ? "sunny" : "dreamy"}>
                        {plan.badge}
                      </Badge>
                    </div>
                  )}

                  {/* اسم الخطة */}
                  <h3 className="text-xl font-black text-ink">{plan.name}</h3>

                  {/* السعر والعملة */}
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-5xl font-black text-ink tracking-tight">{plan.price}</span>
                    <span className="text-sm font-black text-ink-muted">
                      {plan.currency === "EGP" ? "جنيه" : plan.currency} /{" "}
                      {plan.durationDays >= 365 ? "سنوياً" : "شهرياً"}
                    </span>
                  </div>

                  {plan.description && (
                    <p className="mt-4 text-sm font-bold leading-relaxed text-ink-muted">{plan.description}</p>
                  )}

                  {/* قائمة الميزات */}
                  <ul className="mt-8 space-y-4 text-sm font-bold text-ink/90">
                    {(plan.features ?? []).map((feature) => (
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
                    onClick={() => handleChoose(plan.slug)}
                    disabled={checkoutSlug !== null}
                  >
                    {checkoutSlug === plan.slug
                      ? "جاري التحويل للدفع... ⏳"
                      : `اختر خطة ${plan.name}`}
                  </Button>
                </div>

              </Card>
            </motion.div>
          ))}
        </div>
        )}
      </div>
    </section>
  );
}
